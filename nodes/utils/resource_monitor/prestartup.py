"""
Prestartup Hook - Inject profiling into ComfyUI execution pipeline
This module wraps ComfyUI's core execution methods before the system fully initializes
"""
import logging

logger = logging.getLogger(__name__)

# Global flag to track if profiling is enabled
PROFILER_ENABLED = False


def inject_profiling():
    """
    Inject profiling hooks into ComfyUI's execution system
    This should be called during ComfyUI startup before execution begins
    """
    global PROFILER_ENABLED

    # Check if profiler is enabled in settings
    try:
        from ...config_api import get_profiler_enabled
        if not get_profiler_enabled():
            logger.info("⏸️  Profiler is disabled in settings")
            PROFILER_ENABLED = False
            return False
    except Exception as e:
        logger.warning(f"Could not check profiler setting, defaulting to enabled: {e}")

    try:
        # Import ComfyUI execution modules
        import execution
        from .profiler_core import ProfilerManager

        # Get profiler instance
        profiler = ProfilerManager.get_instance()

        # Store original functions
        original_map_node_over_list = execution._async_map_node_over_list

        # Try to wrap PromptExecutor if it exists
        try:
            original_prompt_executor_execute = execution.PromptExecutor.execute
        except AttributeError:
            original_prompt_executor_execute = None
            logger.warning("PromptExecutor.execute not found, skipping that hook")

        # Wrap _async_map_node_over_list to capture actual node execution timing
        async def map_node_with_profiling(prompt_id, unique_id, obj, input_data_all, func, allow_interrupt=False, execution_block_cb=None, pre_execute_cb=None, hidden_inputs=None):
            """Wrap the actual node function execution to capture timing"""

            # Check if profiler is enabled before doing any profiling work
            from ...config_api import get_profiler_enabled
            profiler_enabled = get_profiler_enabled()

            # Only track timing for the main FUNCTION execution, not check_lazy_status, etc.
            is_main_execution = (func == getattr(obj, 'FUNCTION', None) or (isinstance(func, str) and func == getattr(obj, 'FUNCTION', None)))

            if is_main_execution and profiler_enabled:
                # Get node type
                class_type = obj.__class__.__name__

                # Start profiling (tracks its own timing internally)
                profiler.start_node(prompt_id, unique_id, class_type)

            try:
                # Execute original function
                result = await original_map_node_over_list(prompt_id, unique_id, obj, input_data_all, func, allow_interrupt, execution_block_cb, pre_execute_cb, hidden_inputs)

                if is_main_execution and profiler_enabled:
                    # Call profiler.end_node() to capture VRAM, RAM, and complete profiling
                    # Note: cache_hit detection deferred for future implementation
                    profiler.end_node(prompt_id, unique_id, outputs=result, cache_hit=False)

                return result

            except RuntimeError as e:
                # OOM Detection (Phase 6.1) - catch all PyTorch OOM variations
                error_msg = str(e).lower()
                is_oom = any(phrase in error_msg for phrase in [
                    "out of memory",
                    "allocation",  # Catches "Allocation on device" errors
                    "oom"
                ])
                
                if is_oom and is_main_execution and profiler_enabled:
                    logger.error(f"💥 OOM detected in node {class_type} (ID: {unique_id})")
                    
                    if prompt_id in profiler.active_profiles:
                        profile = profiler.active_profiles[prompt_id]
                        
                        if unique_id in profile.nodes:
                            node = profile.nodes[unique_id]
                            node.oom_occurred = True
                            node.oom_error = str(e)
                            
                            # Capture OOM context
                            try:
                                import torch
                                node.vram_at_oom = torch.cuda.memory_allocated()
                                
                                # Get GPU memory summary
                                memory_summary = torch.cuda.memory_summary()
                                logger.error(f"GPU Memory Summary:\n{memory_summary}")
                                
                                # Snapshot loaded models
                                node.models_at_oom = profiler._scan_gpu_models()
                                
                                # Log models present at OOM
                                if node.models_at_oom:
                                    logger.error(f"Models loaded at OOM:")
                                    for gpu_id, models in node.models_at_oom.items():
                                        logger.error(f"  GPU {gpu_id}: {len(models)} models")
                                        for model in models:
                                            logger.error(
                                                f"    - {model['name']} ({model['type']}): "
                                                f"{model['vram_mb']} MB"
                                            )
                                
                            except Exception as capture_error:
                                logger.error(f"Failed to capture OOM context: {capture_error}")
                            
                            # Mark workflow as OOM'd
                            profile.oom_occurred = True
                            profile.oom_node_id = unique_id
                    
                    # End node tracking with error
                    profiler.end_node(prompt_id, unique_id)
                
                # Re-raise to maintain ComfyUI error flow
                raise
                
            except Exception as e:
                if is_main_execution and profiler_enabled:
                    # Track non-OOM errors
                    if prompt_id in profiler.active_profiles:
                        if unique_id in profiler.active_profiles[prompt_id].nodes:
                            profiler.active_profiles[prompt_id].nodes[unique_id].error = str(e)
                raise

        # Wrap PromptExecutor.execute for workflow-level profiling
        if original_prompt_executor_execute:
            def prompt_executor_execute_with_profiling(self, prompt, prompt_id, extra_data={}, execute_outputs=[]):
                """Wrap workflow execution to capture start/end times"""

                # Check if profiler is enabled
                from ...config_api import get_profiler_enabled
                profiler_enabled = get_profiler_enabled()

                if profiler_enabled:
                    # Start workflow profiling
                    profiler.start_workflow(prompt_id)

                try:
                    # Execute original function
                    result = original_prompt_executor_execute(self, prompt, prompt_id, extra_data, execute_outputs)

                    if profiler_enabled:
                        # End workflow profiling
                        profiler.end_workflow(prompt_id)

                        # Broadcast profiler update via WebSocket
                        try:
                            from server import PromptServer
                            server = PromptServer.instance
                            stats = profiler.get_stats()
                            server.send_sync("swissarmyknife.profiler", stats)
                        except Exception as e:
                            logger.debug(f"Failed to broadcast profiler update: {e}")

                    return result

                except Exception:
                    if profiler_enabled:
                        # Still end workflow on error
                        profiler.end_workflow(prompt_id)
                    raise

            # Replace the method
            execution.PromptExecutor.execute = prompt_executor_execute_with_profiling

        # Replace _async_map_node_over_list
        execution._async_map_node_over_list = map_node_with_profiling

        PROFILER_ENABLED = True
        logger.info("✅ Profiling hooks successfully injected into ComfyUI execution")
        return True

    except Exception as e:
        logger.error(f"❌ Failed to inject profiling hooks: {e}", exc_info=True)
        PROFILER_ENABLED = False
        return False


def is_profiling_enabled() -> bool:
    """Check if profiling is currently enabled"""
    return PROFILER_ENABLED

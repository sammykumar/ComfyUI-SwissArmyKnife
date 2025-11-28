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

    try:
        # Import ComfyUI execution modules
        import execution
        from .profiler_core import ProfilerManager
        import time

        # Get profiler instance
        profiler = ProfilerManager.get_instance()

        # Store original functions
        original_map_node_over_list = execution._async_map_node_over_list
        original_prompt_executor_init = None

        # Try to wrap PromptExecutor if it exists
        try:
            original_prompt_executor_execute = execution.PromptExecutor.execute
        except AttributeError:
            original_prompt_executor_execute = None
            logger.warning("PromptExecutor.execute not found, skipping that hook")

        # Wrap _async_map_node_over_list to capture actual node execution timing
        async def map_node_with_profiling(prompt_id, unique_id, obj, input_data_all, func, allow_interrupt=False, execution_block_cb=None, pre_execute_cb=None, hidden_inputs=None):
            """Wrap the actual node function execution to capture timing"""
            
            # Only track timing for the main FUNCTION execution, not check_lazy_status, etc.
            is_main_execution = (func == getattr(obj, 'FUNCTION', None) or (isinstance(func, str) and func == getattr(obj, 'FUNCTION', None)))
            
            if is_main_execution:
                # Get node type
                class_type = obj.__class__.__name__
                
                # Start timing
                start_time = time.time()
                profiler.start_node(prompt_id, unique_id, class_type)
            
            try:
                # Execute original function
                result = await original_map_node_over_list(prompt_id, unique_id, obj, input_data_all, func, allow_interrupt, execution_block_cb, pre_execute_cb, hidden_inputs)
                
                if is_main_execution:
                    # End timing
                    end_time = time.time()
                    execution_time = (end_time - start_time) * 1000  # Convert to ms
                    
                    # Update the node profile with actual timing
                    if prompt_id in profiler.active_profiles:
                        if unique_id in profiler.active_profiles[prompt_id].nodes:
                            node_profile = profiler.active_profiles[prompt_id].nodes[unique_id]
                            node_profile.end_time = end_time
                            print(f"[SwissArmyKnife][Profiler] Node {class_type} (ID: {unique_id}) actually took {execution_time:.2f}ms")
                
                return result
                
            except Exception as e:
                if is_main_execution:
                    # Track error
                    if prompt_id in profiler.active_profiles:
                        if unique_id in profiler.active_profiles[prompt_id].nodes:
                            profiler.active_profiles[prompt_id].nodes[unique_id].error = str(e)
                raise

        # Wrap PromptExecutor.execute for workflow-level profiling
        if original_prompt_executor_execute:
            def prompt_executor_execute_with_profiling(self, prompt, prompt_id, extra_data={}, execute_outputs=[]):
                """Wrap workflow execution to capture start/end times"""

                # Start workflow profiling
                profiler.start_workflow(prompt_id)

                try:
                    # Execute original function
                    result = original_prompt_executor_execute(self, prompt, prompt_id, extra_data, execute_outputs)

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

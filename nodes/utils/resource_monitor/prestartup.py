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

        # Get profiler instance
        profiler = ProfilerManager.get_instance()

        # Store original functions
        original_execute = execution.execute
        original_prompt_executor_init = None

        # Try to wrap PromptExecutor if it exists
        try:
            original_prompt_executor_execute = execution.PromptExecutor.execute
        except AttributeError:
            original_prompt_executor_execute = None
            logger.warning("PromptExecutor.execute not found, skipping that hook")

        # Wrap execution.execute for per-node profiling
        def execute_with_profiling(server, dynprompt, caches, current_item, extra_data, executed, prompt_id, execution_list, pending_subgraph_results, pending_async_nodes, ui_node_outputs):
            """Wrap node execution to capture profiling data"""

            # Extract node info
            unique_id = current_item
            class_type = dynprompt.get_node(unique_id)["class_type"]

            # Check for cache hit before execution
            cache_hit = caches.outputs.get(unique_id) is not None

            # Start node profiling
            profiler.start_node(prompt_id, unique_id, class_type)

            try:
                # Execute original function
                result = original_execute(server, dynprompt, caches, current_item, extra_data, executed, prompt_id, execution_list, pending_subgraph_results, pending_async_nodes, ui_node_outputs)

                # End node profiling with outputs
                outputs = result if result else None
                profiler.end_node(prompt_id, unique_id, outputs, cache_hit)

                return result

            except Exception as e:
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

        # Replace execution.execute
        execution.execute = execute_with_profiling

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

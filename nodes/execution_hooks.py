"""
ComfyUI Execution Hooks for automatic event publishing to Azure Queue.

This module hooks into ComfyUI's execution lifecycle to automatically emit events
when prompts start, complete, or fail - without requiring manual node placement.
"""

import json
import os
from datetime import datetime, timezone
from typing import Optional

try:
    from azure.storage.queue import QueueClient

    AZURE_AVAILABLE = True
except ImportError:
    AZURE_AVAILABLE = False
    print("[SAF execution_hooks] azure-storage-queue not installed")


class ExecutionEventPublisher:
    """Publishes execution events to Azure Storage Queue automatically."""

    def __init__(self):
        self._queue_client: Optional[QueueClient] = None
        self._connection_string = None
        self._queue_name = "job-events"
        self._initialized = False

    def initialize(self):
        """Initialize the Azure Queue client (called after config is loaded)."""
        if self._initialized:
            return

        if not AZURE_AVAILABLE:
            print("[SAF execution_hooks] Azure SDK not available")
            return

        # Import config API to get connection string from UI settings
        try:
            from .config_api import get_setting_value, _cached_settings

            connection_string = get_setting_value(
                "swiss_army_knife.azure_storage.connection_string"
            )
            queue_name = _cached_settings.get("azure_job_events_queue", "job-events")

            if not connection_string:
                print(
                    "[SAF execution_hooks] Azure Storage Connection String not configured"
                )
                return

            self._queue_client = QueueClient.from_connection_string(
                conn_str=connection_string, queue_name=queue_name
            )
            self._queue_name = queue_name
            self._initialized = True
            print(
                f"[SAF execution_hooks] ✅ Execution event publisher initialized (queue: {queue_name})"
            )

        except Exception as exc:
            print(f"[SAF execution_hooks] Failed to initialize publisher: {exc}")

    def _publish_event(self, event_data: dict):
        """Publish an event to the Azure queue."""
        if not self._initialized or not self._queue_client:
            # Silently skip if not configured (graceful degradation)
            return

        try:
            message_json = json.dumps(event_data)
            self._queue_client.send_message(message_json)
            print(
                f"[SAF execution_hooks] ✅ Published {event_data.get('eventType')} for job {event_data.get('jobId')}"
            )
        except Exception as exc:
            print(f"[SAF execution_hooks] Failed to publish event: {exc}")

    def on_execution_start(self, prompt_id: str, prompt: dict):
        """Called when a prompt starts executing."""
        self._publish_event(
            {
                "jobId": prompt_id,
                "promptId": prompt_id,
                "eventType": "job_started",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        )

    def on_execution_complete(self, prompt_id: str, prompt: dict, outputs: dict):
        """Called when a prompt completes successfully."""
        self._publish_event(
            {
                "jobId": prompt_id,
                "promptId": prompt_id,
                "eventType": "job_completed",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "metadata": {"nodeCount": len(outputs)},
            }
        )

    def on_execution_error(self, prompt_id: str, prompt: dict, error: Exception):
        """Called when a prompt execution fails."""
        self._publish_event(
            {
                "jobId": prompt_id,
                "promptId": prompt_id,
                "eventType": "job_failed",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "errorMessage": str(error),
            }
        )


# Global publisher instance
_publisher = ExecutionEventPublisher()


def register_execution_hooks():
    """Register hooks into ComfyUI's execution system."""
    try:
        import execution

        # Store original PromptExecutor methods
        original_execute = execution.PromptExecutor.execute

        def execute_with_hooks(self, prompt, prompt_id, extra_data={}, execute_outputs=[]):
            """Wrapped execute method that emits events."""
            # Initialize publisher if needed (deferred until first execution)
            if not _publisher._initialized:
                _publisher.initialize()

            # Emit job_started event
            _publisher.on_execution_start(prompt_id, prompt)

            try:
                # Call original execute method
                result = original_execute(
                    self, prompt, prompt_id, extra_data, execute_outputs
                )

                # Emit job_completed event
                _publisher.on_execution_complete(
                    prompt_id, prompt, self.outputs if hasattr(self, "outputs") else {}
                )

                return result

            except Exception as error:
                # Emit job_failed event
                _publisher.on_execution_error(prompt_id, prompt, error)
                raise  # Re-raise the exception

        # Monkey-patch the execute method
        execution.PromptExecutor.execute = execute_with_hooks

        print("[SAF execution_hooks] ✅ Execution hooks registered")

    except ImportError as exc:
        print(f"[SAF execution_hooks] Could not import execution module: {exc}")
    except Exception as exc:
        print(f"[SAF execution_hooks] Failed to register hooks: {exc}")


# Auto-register hooks when module is imported
register_execution_hooks()

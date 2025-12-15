"""
ComfyUI Execution Hooks for automatic event publishing to Azure Queue.

This module hooks into PromptServer's message bus to listen for execution events
and automatically publish them to Azure Storage Queue - without requiring manual node placement.
"""

import json
from datetime import datetime, timezone
from typing import Optional

from .lib.audit_logger import create_audit_logger

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
        self._queue_name = "job-events"
        self._initialized = False
        self._active_prompts = {}  # Track prompt_id -> start time

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
            self._log_audit_event(event_data, success=True)
        except Exception as exc:
            print(f"[SAF execution_hooks] Failed to publish event: {exc}")
            self._log_audit_event(event_data, success=False, error=str(exc))

    def _log_audit_event(
        self, event_data: dict, *, success: bool, error: Optional[str] = None
    ):
        job_id = event_data.get("jobId") or event_data.get("promptId") or "unknown"
        event_type = event_data.get("eventType", "job_event")
        action = "publish_event"
        message = f"Published {event_type} for job {job_id}"
        extra = {"queue": self._queue_name}
        if error:
            extra["error"] = error

        if event_type == "job_completed":
            AUDIT_LOGGER.success(
                job_id=job_id,
                event_type=event_type,
                action=action,
                message=message,
                extra=extra,
            )
        elif event_type == "job_failed" or not success:
            AUDIT_LOGGER.failure(
                job_id=job_id,
                event_type=event_type,
                action=action,
                message=message if success else error or message,
                extra=extra,
            )
        else:
            AUDIT_LOGGER.info(
                job_id=job_id,
                event_type=event_type,
                action=action,
                message=message,
                extra=extra,
            )

    def handle_execution_start(self, data: dict):
        """Handle execution_start message from ComfyUI."""
        prompt_id = data.get("prompt_id")
        if not prompt_id:
            return

        self._active_prompts[prompt_id] = datetime.now(timezone.utc)

        self._publish_event(
            {
                "jobId": prompt_id,
                "promptId": prompt_id,
                "eventType": "job_started",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        )

    def handle_execution_success(self, data: dict):
        """Handle execution_success message from ComfyUI."""
        prompt_id = data.get("prompt_id")
        if not prompt_id:
            return

        self._active_prompts.pop(prompt_id, None)

        self._publish_event(
            {
                "jobId": prompt_id,
                "promptId": prompt_id,
                "eventType": "job_completed",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        )

    def handle_execution_error(self, data: dict):
        """Handle execution_error message from ComfyUI."""
        prompt_id = data.get("prompt_id")
        if not prompt_id:
            return

        self._active_prompts.pop(prompt_id, None)

        error_message = data.get("exception_message", "Unknown error")

        self._publish_event(
            {
                "jobId": prompt_id,
                "promptId": prompt_id,
                "eventType": "job_failed",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "errorMessage": error_message,
            }
        )


# Global publisher instance
AUDIT_LOGGER = create_audit_logger("comfy-execution-hooks")
_publisher = ExecutionEventPublisher()


def register_execution_hooks():
    """Register hooks into PromptServer's message bus."""
    try:
        from server import PromptServer

        server = PromptServer.instance

        # Store original send_sync method
        original_send_sync = server.send_sync

        def send_sync_with_hooks(event, data, sid=None):
            """Wrapped send_sync that intercepts execution events."""
            # Initialize publisher on first message (deferred until runtime)
            if not _publisher._initialized:
                _publisher.initialize()

            # Intercept execution events and publish to Azure
            # Note: 'executed' fires per-node, 'execution_success' fires per-prompt
            if event == "execution_start":
                _publisher.handle_execution_start(data)
            elif event == "execution_success":
                # This fires once when the entire prompt completes successfully
                _publisher.handle_execution_success(data)
            elif event == "execution_error":
                _publisher.handle_execution_error(data)

            # Call original method to maintain ComfyUI functionality
            return original_send_sync(event, data, sid)

        # Monkey-patch send_sync to intercept messages
        server.send_sync = send_sync_with_hooks

        print("[SAF execution_hooks] ✅ Execution hooks registered via PromptServer message bus")

    except ImportError as exc:
        print(f"[SAF execution_hooks] Could not import PromptServer: {exc}")
    except Exception as exc:
        print(f"[SAF execution_hooks] Failed to register hooks: {exc}")


# Auto-register hooks when module is imported
register_execution_hooks()

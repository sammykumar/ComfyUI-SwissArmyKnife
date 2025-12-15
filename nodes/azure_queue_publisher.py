"""
Azure Queue Publisher Node
Publishes job events to Azure Storage Queue for event-driven architecture.
"""

import os
import json
from typing import Any, Dict, Literal
from datetime import datetime, timezone

from ..lib.audit_logger import create_audit_logger

try:
    from azure.storage.queue import QueueClient

    AZURE_AVAILABLE = True
except ImportError:
    AZURE_AVAILABLE = False
    print("⚠️  azure-storage-queue not installed")

EventType = Literal["job_started", "job_completed", "character_ready", "job_failed"]
AUDIT_LOGGER = create_audit_logger("comfy-publisher")


class AzureQueuePublisher:
    """Custom ComfyUI node for publishing job events to Azure Storage Queue."""

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "job_id": ("STRING", {"default": "", "multiline": False}),
                "event_type": (
                    ["job_started", "job_completed", "character_ready", "job_failed"],
                    {"default": "job_started"},
                ),
            },
            "optional": {
                "prompt_id": ("STRING", {"default": "", "multiline": False}),
                "client_id": ("STRING", {"default": "", "multiline": False}),
                "run_id": ("STRING", {"default": "", "multiline": False}),
                "character_index": ("INT", {"default": 0, "min": 0, "max": 1000}),
                "error_message": ("STRING", {"default": "", "multiline": True}),
                "output_url": ("STRING", {"default": "", "multiline": False}),
                "metadata": ("STRING", {"default": "{}", "multiline": True}),
            },
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("status",)
    FUNCTION = "publish_event"
    CATEGORY = "azure/events"
    OUTPUT_NODE = True

    def __init__(self):
        self.queue_client = None
        self._initialize_queue_client()

    def _initialize_queue_client(self):
        """Initialize Azure Storage Queue client."""
        if not AZURE_AVAILABLE:
            print("❌ Azure Storage Queue SDK not available")
            return

        connection_string = os.environ.get("AZURE_STORAGE_CONNECTION_STRING")
        queue_name = os.environ.get("AZURE_JOB_EVENTS_QUEUE", "job-events")

        if not connection_string:
            print("❌ AZURE_STORAGE_CONNECTION_STRING not set")
            return

        try:
            self.queue_client = QueueClient.from_connection_string(
                conn_str=connection_string, queue_name=queue_name
            )
            print(f"✅ Azure Queue Client initialized for queue: {queue_name}")
        except Exception as exc:  # pragma: no cover - best-effort init guard
            print(f"❌ Failed to initialize Azure Queue Client: {exc}")

    def publish_event(
        self,
        job_id: str,
        event_type: EventType,
        prompt_id: str = "",
        client_id: str = "",
        run_id: str = "",
        character_index: int = 0,
        error_message: str = "",
        output_url: str = "",
        metadata: str = "{}",
    ) -> tuple[str]:
        """Publish job event to Azure Storage Queue."""
        if not AZURE_AVAILABLE or not self.queue_client:
            error = "Queue client not available"
            print(f"❌ {error}")
            return (f"ERROR: {error}",)

        if not job_id:
            return ("ERROR: job_id is required",)

        try:
            metadata_dict = json.loads(metadata) if metadata else {}
        except json.JSONDecodeError:
            metadata_dict = {}

        event_data: Dict[str, Any] = {
            "jobId": job_id,
            "promptId": prompt_id or job_id,
            "eventType": event_type,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

        if client_id:
            event_data["clientId"] = client_id
        if run_id:
            event_data["runId"] = run_id
        if character_index >= 0:
            event_data["characterIndex"] = character_index
        if error_message:
            event_data["errorMessage"] = error_message
        if output_url:
            event_data["outputUrl"] = output_url
        if metadata_dict:
            event_data["metadata"] = metadata_dict

        try:
            message_json = json.dumps(event_data)
            self.queue_client.send_message(message_json)

            success_msg = f"✅ Published {event_type} event for job {job_id}"
            print(success_msg)
            AUDIT_LOGGER.info(
                job_id=job_id,
                event_type=event_type,
                action="publish_event",
                message="Event published from AzureQueuePublisher node",
                extra={"queuePayloadSize": len(message_json)},
            )
            return (f"SUCCESS: {success_msg}",)
        except Exception as exc:  # pragma: no cover - runtime transport errors
            error_msg = f"Failed to publish event: {exc}"
            print(f"❌ {error_msg}")
            AUDIT_LOGGER.failure(
                job_id=job_id,
                event_type=event_type,
                action="publish_event_failed",
                message=error_msg,
            )
            return (f"ERROR: {error_msg}",)


NODE_CLASS_MAPPINGS = {"AzureQueuePublisher": AzureQueuePublisher}
NODE_DISPLAY_NAME_MAPPINGS = {"AzureQueuePublisher": "Azure Queue Publisher"}

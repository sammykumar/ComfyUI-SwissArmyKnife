import json
from datetime import datetime, timezone

from aiohttp import web

from lib.audit_logger import create_audit_logger

try:
    from azure.storage.queue import QueueClient

    AZURE_AVAILABLE = True
except ImportError:  # pragma: no cover - environment guard
    AZURE_AVAILABLE = False
    print("[SAF] azure-storage-queue not installed; emit-event endpoint disabled")

try:
    from ..nodes.config_api import get_debug_mode, get_setting_value, _cached_settings
except Exception:  # pragma: no cover - fallback
    def get_debug_mode():
        return False
    def get_setting_value(setting_id):
        return ""
    _cached_settings = {}

_queue_client = None
AUDIT_LOGGER = create_audit_logger("comfy-events-api")


def _log_debug(*args):
    if get_debug_mode():
        print("[SAF emit-event debug]", *args)


def _get_queue_client():
    global _queue_client
    if _queue_client:
        return _queue_client

    if not AZURE_AVAILABLE:
        print("[SAF] Queue client unavailable: azure-storage-queue not installed")
        return None

    # Get connection string from Swiss Army Knife config system
    connection_string = get_setting_value("swiss_army_knife.azure_storage.connection_string")
    if not connection_string:
        print("[SAF] Queue client unavailable: Azure Storage Connection String not set in SwissArmyKnife settings")
        return None

    # Get queue name from cached settings (defaults to "job-events")
    queue_name = _cached_settings.get("azure_job_events_queue", "job-events")

    try:
        _queue_client = QueueClient.from_connection_string(
            conn_str=connection_string, queue_name=queue_name
        )
        print(f"[SAF] Queue client initialized for queue: {queue_name}")
        return _queue_client
    except Exception as exc:  # pragma: no cover - network/auth failures
        print(f"[SAF] Failed to initialize queue client: {exc}")
        return None


def _build_event(payload: dict) -> dict:
    now = datetime.now(timezone.utc).isoformat()
    job_id = payload.get("jobId") or payload.get("promptId")
    event_type = payload.get("eventType")

    event = {
        "jobId": job_id,
        "promptId": payload.get("promptId") or job_id,
        "eventType": event_type,
        "timestamp": payload.get("timestamp") or now,
    }

    # Optional fields
    for key in ("clientId", "runId", "outputUrl", "errorMessage"):
        val = payload.get(key)
        if val:
            event[key] = val

    if "characterIndex" in payload:
        try:
            event["characterIndex"] = int(payload.get("characterIndex"))
        except Exception:
            pass

    metadata_val = payload.get("metadata")
    if metadata_val:
        try:
            event["metadata"] = metadata_val if isinstance(metadata_val, dict) else json.loads(metadata_val)
        except Exception:
            # ignore bad metadata parsing
            pass

    return event


async def emit_event(request: web.Request) -> web.Response:
    try:
        data = await request.json()
    except Exception:
        return web.json_response({"error": "Invalid JSON payload"}, status=400)

    job_id = data.get("jobId") or data.get("promptId")
    event_type = data.get("eventType")

    if not job_id or not event_type:
        return web.json_response({"error": "jobId (or promptId) and eventType are required"}, status=400)

    client = _get_queue_client()
    if not client:
        return web.json_response({"error": "Queue client not available"}, status=500)

    event = _build_event(data)

    message_body = json.dumps(event, separators=(",", ":"))

    try:
        client.send_message(message_body)
        print(f"[SAF emit-event] Published queue payload: {message_body}")
        if get_debug_mode():
            _log_debug("Published", event)
        AUDIT_LOGGER.success(
            job_id=job_id,
            event_type=event_type,
            action="emit_event",
            message="Event published via emit-event endpoint",
            extra={"queuePayloadSize": len(message_body)},
        )
        return web.json_response({"success": True, "jobId": job_id, "eventType": event_type})
    except Exception as exc:  # pragma: no cover - runtime transport errors
        print(f"[SAF] Failed to publish event: {exc}")
        AUDIT_LOGGER.failure(
            job_id=job_id or "unknown",
            event_type=event_type or "job_error",
            action="emit_event_failed",
            message=f"Failed to publish event: {exc}",
        )
        return web.json_response({"error": f"Failed to publish event: {exc}"}, status=500)


async def health(_: web.Request) -> web.Response:
    return web.json_response({"status": "ok"})


# Initialize routes using ComfyUI's recommended pattern
def initialize_routes():
    """Register SAF event routes using PromptServer.instance.routes (ComfyUI standard pattern)."""
    try:
        from server import PromptServer

        routes = PromptServer.instance.routes

        @routes.post("/swiss-army-knife/emit-event")
        async def handle_emit_event(request):
            return await emit_event(request)

        @routes.get("/swiss-army-knife/health")
        async def handle_health(request):
            return await health(request)

        print("[SwissArmyKnife] Event routes registered successfully")

        # Debug logging
        if get_debug_mode():
            print("[SwissArmyKnife] Routes: POST /swiss-army-knife/emit-event, GET /swiss-army-knife/health")

    except Exception as exc:
        print(f"[SwissArmyKnife] Failed to register event routes: {exc}")
        import traceback
        traceback.print_exc()


# Auto-initialize when module is imported
initialize_routes()

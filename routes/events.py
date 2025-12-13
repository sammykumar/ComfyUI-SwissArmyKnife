import json
import os
from datetime import datetime, timezone

from aiohttp import web

try:
    from azure.storage.queue import QueueClient

    AZURE_AVAILABLE = True
except ImportError:  # pragma: no cover - environment guard
    AZURE_AVAILABLE = False
    print("[SAF] azure-storage-queue not installed; emit-event endpoint disabled")

try:
    from ..nodes.config_api import get_debug_mode
except Exception:  # pragma: no cover - fallback
    def get_debug_mode():
        return False

_queue_client = None
_queue_name = os.environ.get("AZURE_JOB_EVENTS_QUEUE", "job-events")


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

    connection_string = os.environ.get("AZURE_STORAGE_CONNECTION_STRING")
    if not connection_string:
        print("[SAF] Queue client unavailable: AZURE_STORAGE_CONNECTION_STRING not set")
        return None

    try:
        _queue_client = QueueClient.from_connection_string(
            conn_str=connection_string, queue_name=_queue_name
        )
        print(f"[SAF] Queue client initialized for queue: {_queue_name}")
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

    try:
        client.send_message(json.dumps(event))
        if get_debug_mode():
            _log_debug("Published", event)
        return web.json_response({"success": True, "jobId": job_id, "eventType": event_type})
    except Exception as exc:  # pragma: no cover - runtime transport errors
        print(f"[SAF] Failed to publish event: {exc}")
        return web.json_response({"error": f"Failed to publish event: {exc}"}, status=500)


async def health(_: web.Request) -> web.Response:
    return web.json_response({"status": "ok"})


def register_event_routes(app):
    # Prefer PromptServer routes API; fall back to aiohttp router if needed.
    routes = getattr(app, "routes", None)
    router = getattr(app, "router", None)

    if routes:
        routes.post("/swiss-army-knife/emit-event")(emit_event)
        routes.get("/swiss-army-knife/health")(health)
        print("[SwissArmyKnife] Registered emit-event via PromptServer routes")
    elif router:
        router.add_post("/swiss-army-knife/emit-event", emit_event)
        router.add_get("/swiss-army-knife/health", health)
        print("[SwissArmyKnife] Registered emit-event via aiohttp router")
    else:
        print("[SwissArmyKnife] Failed to register emit-event routes: no routes/router available")

    try:
        # Log current registered paths for quick diagnostics when DEBUG is on.
        if get_debug_mode():
            registered = []
            if routes and hasattr(routes, "resources"):
                for res in routes.resources():
                    for route in res:
                        registered.append(f"{route.method} {route.resource}")
            elif router:
                for res in router.resources():
                    for route in res:
                        registered.append(f"{route.method} {route.resource}")
            print("[SwissArmyKnife] Routes registered:", ", ".join(registered))
    except Exception as exc:  # pragma: no cover - diagnostics only
        print(f"[SwissArmyKnife] Route logging failed: {exc}")

"""Structured logging helper for job audit events in Python components."""

from __future__ import annotations

import json
import os
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, Optional
from urllib.error import URLError
from urllib.request import Request, urlopen

LogLevel = str


@dataclass
class AuditLogEvent:
  job_id: str
  event_type: str
  component: str
  action: str
  status: LogLevel
  message: str
  run_id: Optional[str] = None
  extra: Dict[str, Any] = field(default_factory=dict)
  timestamp: str = field(
    default_factory=lambda: datetime.now(timezone.utc).isoformat()
  )

  def to_dict(self) -> Dict[str, Any]:
    payload: Dict[str, Any] = {
      'jobId': self.job_id,
      'eventType': self.event_type,
      'component': self.component,
      'action': self.action,
      'status': self.status,
      'message': self.message,
      'timestamp': self.timestamp,
    }
    if self.run_id:
      payload['runId'] = self.run_id
    payload.update(self.extra)
    return payload


class AuditLogger:
  def __init__(
    self,
    *,
    component: str,
    send_to_audit_endpoint: bool = False,
    audit_endpoint_url: Optional[str] = None,
  ) -> None:
    self.component = component
    self.send_to_audit_endpoint = send_to_audit_endpoint
    self.audit_endpoint_url = (
      audit_endpoint_url or os.getenv('JOB_AUDIT_ENDPOINT_URL')
    )

  def log(
    self,
    *,
    job_id: str,
    event_type: str,
    action: str,
    status: LogLevel,
    message: str,
    run_id: Optional[str] = None,
    extra: Optional[Dict[str, Any]] = None,
  ) -> None:
    event = AuditLogEvent(
      job_id=job_id,
      event_type=event_type,
      component=self.component,
      action=action,
      status=status,
      message=message,
      run_id=run_id,
      extra=extra or {},
    )

    self._emit_to_console(event)

    if self.send_to_audit_endpoint and self.audit_endpoint_url:
      try:
        self._send_to_audit_endpoint(event)
      except Exception as exc:  # pragma: no cover - best effort
        print(
          f"[AuditLogger] Failed to send to audit endpoint: {exc}",
          file=sys.stderr,
        )

  def _emit_to_console(self, event: AuditLogEvent) -> None:
    entry = event.to_dict()
    entry['level'] = self._map_status_to_level(event.status)
    line = json.dumps(entry)
    if event.status == 'failure':
      print(line, file=sys.stderr)
    else:
      print(line, file=sys.stdout)

  def _send_to_audit_endpoint(self, event: AuditLogEvent) -> None:
    if not self.audit_endpoint_url:
      return

    request = Request(
      self.audit_endpoint_url,
      data=json.dumps(event.to_dict()).encode('utf-8'),
      headers={'Content-Type': 'application/json'},
      method='POST',
    )

    with urlopen(request, timeout=5) as response:  # nosec B310
      if response.status >= 400:
        raise URLError(f'HTTP {response.status}')

  @staticmethod
  def _map_status_to_level(status: LogLevel) -> str:
    if status == 'failure':
      return 'error'
    if status == 'warning':
      return 'warn'
    return 'info'

  def info(self, **kwargs: Any) -> None:
    self.log(status='info', **kwargs)

  def success(self, **kwargs: Any) -> None:
    self.log(status='success', **kwargs)

  def warning(self, **kwargs: Any) -> None:
    self.log(status='warning', **kwargs)

  def failure(self, **kwargs: Any) -> None:
    self.log(status='failure', **kwargs)


def create_audit_logger(component: str) -> AuditLogger:
  return AuditLogger(
    component=component,
    send_to_audit_endpoint=os.getenv('ENABLE_JOB_AUDIT_ENDPOINT') == 'true',
    audit_endpoint_url=os.getenv('JOB_AUDIT_ENDPOINT_URL'),
  )

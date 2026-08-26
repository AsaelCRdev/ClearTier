import { apiFetch } from './apiClient';
import type { AuditLogEntry } from '../models/auditLog.model';

export async function fetchAuditLogs(): Promise<AuditLogEntry[]> {
  const page = await apiFetch<{ content: Array<{ id: number; action: string; targetType: string; createdAt: string; actorId: number | null }> }>('/audit?page=0&size=100');
  return page.content.map((log) => ({
    id: String(log.id),
    timestamp: log.createdAt,
    actor: log.actorId === null ? 'Sistema' : String(log.actorId),
    action: log.action,
    target: log.targetType,
  }));
}

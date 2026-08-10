import { delay } from './apiClient';
import { dbGetAuditLogs } from './mockBackend';
import type { AuditLogEntry } from '../models/auditLog.model';

export async function fetchAuditLogs(): Promise<AuditLogEntry[]> {
  return delay(dbGetAuditLogs());
}

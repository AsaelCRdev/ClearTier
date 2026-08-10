import { delay } from './apiClient';
import { dbGetResources, dbGetPermissionMatrix, dbCycleCellEffect } from './mockBackend';
import type { Resource, PermissionCell, PermissionEffect } from '../models/permission.model';

export async function fetchResources(): Promise<Resource[]> {
  return delay(dbGetResources());
}

export async function fetchPermissionMatrix(): Promise<PermissionCell[]> {
  return delay(dbGetPermissionMatrix());
}

export async function toggleCell(roleId: string, resourceId: string): Promise<PermissionEffect> {
  // Sin delay artificial aquí a propósito: el clic en la matriz debe sentirse
  return dbCycleCellEffect(roleId, resourceId);
}

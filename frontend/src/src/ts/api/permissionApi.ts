import { apiFetch } from './apiClient';
import type { Resource, PermissionCell, PermissionEffect } from '../models/permission.model';

export async function fetchResources(): Promise<Resource[]> {
  const resources = await apiFetch<Array<{ nameResource: string; descriptionResource: string }>>('/resources');
  return resources.map((resource) => ({
    id: resource.nameResource,
    name: resource.nameResource,
    label: resource.nameResource.replace(/(^|-|_)(\w)/g, (_, separator, letter) => `${separator === '_' ? ' ' : separator}${letter.toUpperCase()}`),
    description: resource.descriptionResource,
  }));
}

export async function fetchPermissionMatrix(): Promise<PermissionCell[]> {
  return apiFetch<PermissionCell[]>('/permissions/matrix');
}

export async function toggleCell(roleId: string, resourceId: string): Promise<PermissionEffect> {
  const result = await apiFetch<PermissionCell>(`/permissions/matrix/${encodeURIComponent(roleId)}/${encodeURIComponent(resourceId)}`, {
    method: 'PUT',
  });
  return result.effect;
}

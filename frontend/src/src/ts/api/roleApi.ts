import { apiFetch } from './apiClient';
import type { Role, CreateRoleInput } from '../models/role.model';

export async function fetchRoles(): Promise<Role[]> {
  const roles = await apiFetch<Array<{ id: number; name: string; description: string; isSystemRol: boolean }>>('/role');
  return roles.map((role) => ({
    id: role.name,
    name: role.name,
    description: role.description,
    isSystemRole: role.isSystemRol,
    usersCount: 0,
  }));
}


export async function createRole(input: CreateRoleInput): Promise<Role> {
  const name = input.name.trim();
  if (name.length < 3 || name.length > 20) {
    throw new Error('El nombre debe tener entre 3 y 20 caracteres');
  }
  const role = await apiFetch<{ id: number; name: string; description: string; isSystemRol: boolean }>('/role', {
    method: 'POST',
    body: JSON.stringify({ ...input, name }),
  });
  return { id: role.name, name: role.name, description: role.description, isSystemRole: role.isSystemRol, usersCount: 0 };
}

export async function canDeleteRole(roleId: string): Promise<boolean> {
  return false;
}
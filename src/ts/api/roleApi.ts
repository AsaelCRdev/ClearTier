import { delay } from './apiClient';
import { dbGetRoles, dbAddRole, dbFindRoleByName, dbCanDeleteRole } from './mockBackend';
import type { Role, CreateRoleInput } from '../models/role.model';

export async function fetchRoles(): Promise<Role[]> {
  return delay(dbGetRoles());
}

/*Valida las reglas de negocio de la Historia "Crear rol" antes de tocar
  el mock backend: nombre único y longitud entre 3 y 20 caracteres.
 */
export async function createRole(input: CreateRoleInput): Promise<Role> {
  const name = input.name.trim();
  if (name.length < 3 || name.length > 20) {
    throw new Error('El nombre debe tener entre 3 y 20 caracteres');
  }
  if (dbFindRoleByName(name)) {
    throw new Error('El nombre del rol ya está en uso');
  }
  return delay(dbAddRole({ ...input, name }));
}

export async function canDeleteRole(roleId: string): Promise<boolean> {
  return delay(dbCanDeleteRole(roleId));
}

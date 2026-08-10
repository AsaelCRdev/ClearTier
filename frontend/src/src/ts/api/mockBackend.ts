/* MOCK BACKEND
  Este módulo no lo vamos ausar en la versionn final del proyecto: es un
  reemplazo temporal del backend real para que el frontend se pueda demostrar y 
  probar de forma independiente.
  Esto lo hago de la siguiente manera:
  toda la "base de datos" vive en un solo objeto `db`, que se
  serializa a JSON y se guarda en `localStorage` bajo la clave IAM_DB_KEY.
  Así los datos sobreviven a un refresh de la página (igual que sobrevivirían
  a un restart del backend real, porque estarían en PostgreSQL).
 
  Cuando el backend de Spring Boot exista, este archivo se elimina y los
  archivos de `src/ts/api/*.ts` (userApi.ts, roleApi.ts, etc.) se modifican
  para usar `fetch()` con el api real en vez de llamar a estas funciones.
  Ese es el único punto de cambio necesario — las páginas nunca importan
  este archivo directamente.

 */

import type { User } from '../models/user.model';
import type { Role } from '../models/role.model';
import type { Resource, PermissionCell, PermissionEffect } from '../models/permission.model';
import type { AuditLogEntry } from '../models/auditLog.model';
import type { AiChangeRequest, AiChangeItem } from '../models/aiChange.model';

const IAM_DB_KEY = 'iam_mock_db';
const DAILY_QUOTA_LIMIT = 1500;

interface Database {
  users: User[];
  roles: Role[];
  resources: Resource[];
  permissions: PermissionCell[];
  auditLogs: AuditLogEntry[];
  aiRequests: AiChangeRequest[];
  aiQuotaUsed: number;
  aiQuotaDate: string; 
}

/** Genera un id corto único, suficiente para datos de demo que no llega a la version final. */
function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

/** esto lo hice para que sea identico al figma que teniamos muchachos y pudieran apreciar las cosas tal cual y si quieren añadirle mas */
function seedDatabase(): Database {
  const roles: Role[] = [
    { id: 'role_super_admin', name: 'Super Admin', description: 'Acceso total al sistema.', isSystemRole: true, usersCount: 3 },
    { id: 'role_manager', name: 'Manager', description: 'Gestiona operaciones del día a día.', isSystemRole: false, usersCount: 12 },
    { id: 'role_editor', name: 'Editor', description: 'Puede editar contenido asignado.', isSystemRole: false, usersCount: 48 },
    { id: 'role_viewer', name: 'Viewer', description: 'Solo puede visualizar información.', isSystemRole: false, usersCount: 1180 },
  ];

  const resources: Resource[] = [
    { id: 'res_dashboard', name: 'dashboard', label: 'Dashboard' },
    { id: 'res_users', name: 'users', label: 'Users' },
    { id: 'res_roles', name: 'roles', label: 'Roles' },
    { id: 'res_settings', name: 'settings', label: 'Settings' },
    { id: 'res_audit', name: 'audit-logs', label: 'Audit Logs' },
  ];

  // El rol Super Admin siempre tiene ALLOW en todo; el resto arranca en UNSET
  const permissions: PermissionCell[] = [];
  for (const resource of resources) {
    for (const role of roles) {
      permissions.push({
        roleId: role.id,
        resourceId: resource.id,
        effect: role.isSystemRole ? 'ALLOW' : 'UNSET',
      });
    }
  }

  const users: User[] = [
    { id: uid('user'), fullName: 'Alice Smith', email: 'alice@company.com', roleId: 'role_super_admin', roleName: 'Super Admin', status: 'Active', createdAt: '2023-01-10T09:00:00Z' },
    { id: uid('user'), fullName: 'Bob Jones', email: 'bob@company.com', roleId: 'role_editor', roleName: 'Editor', status: 'Active', createdAt: '2023-02-14T09:00:00Z' },
    { id: uid('user'), fullName: 'Charlie Davis', email: 'charlie@company.com', roleId: 'role_viewer', roleName: 'Viewer', status: 'Inactive', createdAt: '2023-03-02T09:00:00Z' },
  ];

  const auditLogs: AuditLogEntry[] = [
    { id: uid('log'), timestamp: '2023-10-27T14:30:00Z', actor: 'Alice Smith', action: 'Update Role', target: 'Bob Jones -> Editor' },
    { id: uid('log'), timestamp: '2023-10-27T10:15:22Z', actor: 'System', action: 'Auto Provision', target: 'Evan Wright' },
    { id: uid('log'), timestamp: '2023-10-26T16:45:10Z', actor: 'Diana Prince', action: 'Revoke Access', target: 'Charlie Davis' },
    { id: uid('log'), timestamp: '2023-10-25T09:12:00Z', actor: 'System', action: 'System Alert', target: 'Failed Login Threshold' },
  ];

  return {
    users,
    roles,
    resources,
    permissions,
    auditLogs,
    aiRequests: [],
    aiQuotaUsed: 0,
    aiQuotaDate: new Date().toISOString().slice(0, 10),
  };
}

/* Carga la BD desde localStorage, o la crea con datos semilla si es la primera vez. */
function loadDatabase(): Database {
  const raw = localStorage.getItem(IAM_DB_KEY);
  if (!raw) {
    const seeded = seedDatabase();
    saveDatabase(seeded);
    return seeded;
  }
  return JSON.parse(raw) as Database;
}

function saveDatabase(db: Database): void {
  localStorage.setItem(IAM_DB_KEY, JSON.stringify(db));
}

// La BD se carga una sola vez al importar el módulo y se mantiene en memoria;
// cada función de escritura la vuelve a guardar en localStorage.
let db = loadDatabase();

/*la parte de los usuarios*/

export function dbGetUsers(): User[] {
  return db.users;
}

export function dbFindUserByEmail(email: string): User | undefined {
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function dbAddUser(input: { fullName: string; email: string; roleId: string }): User {
  const role = db.roles.find((r) => r.id === input.roleId);
  const user: User = {
    id: uid('user'),
    fullName: input.fullName,
    email: input.email,
    roleId: input.roleId,
    roleName: role ? role.name : 'Unknown',
    status: 'Active',
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  if (role) role.usersCount += 1;
  dbAddAuditLog('Alice Smith', 'Create User', user.fullName);
  saveDatabase(db);
  return user;
}

/* parte de los roles */

export function dbGetRoles(): Role[] {
  return db.roles;
}

export function dbGetRoleById(id: string): Role | undefined {
  return db.roles.find((r) => r.id === id);
}

export function dbFindRoleByName(name: string): Role | undefined {
  return db.roles.find((r) => r.name.toLowerCase() === name.toLowerCase());
}

export function dbAddRole(input: { name: string; description: string }): Role {
  const role: Role = {
    id: uid('role'),
    name: input.name,
    description: input.description,
    isSystemRole: false,
    usersCount: 0,
  };
  db.roles.push(role);

  //para que el rol nuevo arrque con el estado unset.
  for (const resource of db.resources) {
    db.permissions.push({ roleId: role.id, resourceId: resource.id, effect: 'UNSET' });
  }
  dbAddAuditLog('Alice Smith', 'Create Role', role.name);
  saveDatabase(db);
  return role;
}

/** Implementa la regla de negocio: no se puede eliminar un rol con usuarios activos. */
export function dbCanDeleteRole(roleId: string): boolean {
  const role = dbGetRoleById(roleId);
  if (!role) return false;
  if (role.isSystemRole) return false;
  return role.usersCount === 0;
}

/* para la aprte de permisos */

export function dbGetResources(): Resource[] {
  return db.resources;
}

export function dbGetPermissionMatrix(): PermissionCell[] {
  return db.permissions;
}

/* Cicla el efecto de una celda: UNSET -> ALLOW -> DENY -> UNSET. */
export function dbCycleCellEffect(roleId: string, resourceId: string): PermissionEffect {
  const role = dbGetRoleById(roleId);
  if (role?.isSystemRole) {
    // Regla de negocio: el rol de sistema no se puede modificar, ni manualmente.
    return 'ALLOW';
  }
  const cell = db.permissions.find((p) => p.roleId === roleId && p.resourceId === resourceId);
  if (!cell) throw new Error('Celda de permiso no encontrada');

  const nextByEffect: Record<PermissionEffect, PermissionEffect> = {
    UNSET: 'ALLOW',
    ALLOW: 'DENY',
    DENY: 'UNSET',
  };
  cell.effect = nextByEffect[cell.effect];
  dbAddAuditLog('Alice Smith', 'Update Permission', `${roleId} · ${resourceId} -> ${cell.effect}`);
  saveDatabase(db);
  return cell.effect;
}

/*para la parte de las auditorias */

export function dbGetAuditLogs(): AuditLogEntry[] {
  // Orden descendente por fecha, igual que en la captura,para mostrar primero el mas reciente.
  return [...db.auditLogs].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
}

export function dbAddAuditLog(actor: string, action: string, target: string): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: uid('log'),
    timestamp: new Date().toISOString(),
    actor,
    action,
    target,
  };
  db.auditLogs.push(entry);
  saveDatabase(db);
  return entry;
}

/* parte del modulo de IA*/

/* Reinicia el contador si cambió el día (simula el reset diario de Gemini a medianoche). */
function ensureQuotaFreshness(): void {
  const today = new Date().toISOString().slice(0, 10);
  if (db.aiQuotaDate !== today) {
    db.aiQuotaDate = today;
    db.aiQuotaUsed = 0;
    saveDatabase(db);
  }
}

export function dbGetAiQuota(): { used: number; limit: number } {
  ensureQuotaFreshness();
  return { used: db.aiQuotaUsed, limit: DAILY_QUOTA_LIMIT };
}

/* Devuelve false si ya se alcanzó el límite diario */
export function dbConsumeAiQuota(): boolean {
  ensureQuotaFreshness();
  if (db.aiQuotaUsed >= DAILY_QUOTA_LIMIT) return false;
  db.aiQuotaUsed += 1;
  saveDatabase(db);
  return true;
}

/* Peticiones de la IA */

export function dbCreateAiDraft(promptText: string, items: AiChangeItem[]): AiChangeRequest {
  const request: AiChangeRequest = {
    id: uid('ai'),
    promptText,
    status: 'DRAFT',
    items,
    createdAt: new Date().toISOString(),
  };
  db.aiRequests.push(request);
  saveDatabase(db);
  return request;
}

/*Aplica un draft aprobado: crea el rol si no existe y ajusta las celdas de la matriz de permisos según cada línea del diff. 
  Este es el único puntodonde un cambio de la IA toca datos reales — nunca ocurre automáticamente,
  solo cuando el administrador presiona "Commit Changes".
 */
export function dbCommitAiDraft(requestId: string): void {
  const request = db.aiRequests.find((r) => r.id === requestId);
  if (!request || request.status !== 'DRAFT') return;

  const roleNameItem = request.items.find((i) => i.operation === 'ADD_ROLE');
  let targetRole: Role | undefined;

  if (roleNameItem) {
    const roleName = roleNameItem.label.replace(/^ROLE\s+"|"$/g, '');
    targetRole = dbFindRoleByName(roleName) ?? dbAddRole({ name: roleName, description: `Rol generado por IA a partir de: "${request.promptText}"` });
  }

  if (targetRole) {
    for (const item of request.items) {
      if (item.operation === 'ALLOW' || item.operation === 'DENY') {
        const resource = db.resources.find((r) => item.label.startsWith(r.name));
        if (!resource) continue;
        const cell = db.permissions.find((p) => p.roleId === targetRole!.id && p.resourceId === resource.id);
        if (cell) cell.effect = item.operation;
      }
    }
  }

  request.status = 'COMMITTED';
  dbAddAuditLog('Alice Smith', 'AI Change Committed', targetRole ? targetRole.name : request.promptText);
  saveDatabase(db);
}

export function dbRejectAiDraft(requestId: string): void {
  const request = db.aiRequests.find((r) => r.id === requestId);
  if (request) {
    request.status = 'REJECTED';
    saveDatabase(db);
  }
}

/** Útil solo para pruebas/demo: borra todo y vuelve a los datos semilla. */
export function dbReset(): void {
  db = seedDatabase();
  saveDatabase(db);
}

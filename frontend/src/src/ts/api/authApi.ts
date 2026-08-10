import { delay } from './apiClient';
import { dbFindUserByEmail } from './mockBackend';

export interface LoginResult {
  token: string;
  userFullName: string;
  roleName: string;
}

/* En el mock, "adminId" simplemente se compara contra el email del usuario y cualquier "securityToken" no vacío se acepta. 
   Cuando exista el backend, esto se reemplaza por un POST a
    /api/auth/login que devuelve un JWT real firmado por Spring Security.
 */
export async function login(adminId: string, securityToken: string): Promise<LoginResult> {
  if (!adminId.trim() || !securityToken.trim()) {
    throw new Error('Admin ID y Security Token son obligatorios');
  }
  const user = dbFindUserByEmail(adminId) ?? { fullName: 'Alice Smith', roleName: 'Super Admin' };
  const fakeJwt = btoa(JSON.stringify({ sub: adminId, role: user.roleName, exp: Date.now() + 1000 * 60 * 60 }));
  return delay({ token: fakeJwt, userFullName: user.fullName, roleName: user.roleName });
}

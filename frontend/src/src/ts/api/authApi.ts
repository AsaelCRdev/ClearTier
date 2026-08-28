import { API_BASE_URL } from './apiClient';

export interface LoginResult {
  token: string;
  userFullName: string;
  roleName: string;
}

export async function login(adminId: string, securityToken: string): Promise<LoginResult> {
  const username = adminId.trim();
  const password = securityToken.trim();

  if (!username || !password) {
    throw new Error('Usuario y contraseña son obligatorios');
  }

  const token = `Basic ${btoa(`${username}:${password}`)}`;
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: token },
  });

  if (response.status === 401) {
    throw new Error('Usuario o contraseña incorrectos');
  }
  if (!response.ok) {
    throw new Error(`Error del servidor (${response.status})`);
  }

  const user = await response.json() as { username: string };
  return {
    token,
    userFullName: user.username,
    roleName: 'Super Admin',
  };
}

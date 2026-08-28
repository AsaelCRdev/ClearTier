/*El token de sesión debe borrarse al cerrar la pestaña O navegador, no persistir indefinidamente.
Los datos de negocio sí usan localStorage porquesimulan una base de datos, no una sesión.
*/
const TOKEN_KEY = 'iam_token';
const USER_KEY = 'iam_user';

export interface SessionInfo {
  token: string;
  userFullName: string;
  roleName: string;
}

export function saveSession(session: SessionInfo): void {
  sessionStorage.setItem(TOKEN_KEY, session.token);
  sessionStorage.setItem(USER_KEY, JSON.stringify({ userFullName: session.userFullName, roleName: session.roleName }));
}

export function getSession(): SessionInfo | null {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const userRaw = sessionStorage.getItem(USER_KEY);
  if (!token || !userRaw) return null;
  const { userFullName, roleName } = JSON.parse(userRaw);
  return { token, userFullName, roleName };
}

export function clearSession(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

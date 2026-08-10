import { getSession } from './tokenStorage';

/**
 * Debe llamarse al principio de CADA página protegida (todas menos login.html).
 * Si no hay sesión, redirige a login antes de que el resto del script corra
 * — esto es el equivalente manual del `canActivate` de un Guard de Angular.
 *
 * Devuelve la sesión para que el script de la página la use (ej. mostrar
 * el nombre del usuario en la navbar) sin tener que leerla dos veces.
 */
export function requireAuth() {
  const session = getSession();
  if (!session) {
    window.location.href = '/src/pages/login.html';
    // Lanzamos para detener la ejecución del resto del script de la página
    throw new Error('No autenticado');
  }
  return session;
}

import { requireAuth } from '../auth/routeGuard';
import { renderSidebar } from '../components/sidebar';
import { renderNavbar } from '../components/navbar';
import { fetchUsers } from '../api/userApi';
import { fetchRoles } from '../api/roleApi';
import { fetchPermissionMatrix } from '../api/permissionApi';
import { fetchAuditLogs } from '../api/auditApi';

// 1) Guard de ruta: si no hay sesión, esto redirige y detiene el resto del script.
const session = requireAuth();

// 2) Layout común: sidebar marcando "dashboard" como activo, navbar con iniciales del usuario.
renderSidebar('sidebar-root', 'dashboard');
renderNavbar('navbar-root', { userInitial: session.userFullName.charAt(0), hasNotifications: true });

// 3) Carga de métricas — Promise.all para pedir todo en paralelo en vez de
// esperar cada fetch uno detrás de otro (más rápido para el usuario).
async function loadMetrics() {
  const [users, roles, matrix, logs] = await Promise.all([
    fetchUsers(),
    fetchRoles(),
    fetchPermissionMatrix(),
    fetchAuditLogs(),
  ]);

  // Nota didáctica: `roles[].usersCount` representa la población total simulada
  // de la empresa (para que el dashboard se vea realista, como en el diseño original),
  // mientras que `users` es la lista editable de usuarios que ves en la pantalla Users.
  void users;
  const totalUsers = roles.reduce((sum, r) => sum + r.usersCount, 0);
  document.getElementById('metric-total-users')!.textContent = totalUsers.toLocaleString('en-US');

  document.getElementById('metric-active-roles')!.textContent = String(roles.length);

  const grantedPermissions = matrix.filter((cell) => cell.effect !== 'UNSET').length;
  document.getElementById('metric-permissions')!.textContent = String(grantedPermissions);

  const since = Date.now() - 24 * 60 * 60 * 1000;
  const recentChanges = logs.filter((log) => new Date(log.timestamp).getTime() >= since).length;
  document.getElementById('metric-recent-changes')!.textContent = String(recentChanges || logs.length);
}

loadMetrics();

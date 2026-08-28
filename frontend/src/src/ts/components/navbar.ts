import { clearSession } from '../auth/tokenStorage';

interface NavbarOptions {
  userInitial: string; // ej. "A" para Alice
  hasNotifications: boolean;
}

/*Inyecta la navbar superior .El botón de logout limpia la sesión y usa `window.location.href` para
  forzar una recarga completa hacia login — no queremos dejar estadoresidual en memoria de una sesión anterior.
 */
export function renderNavbar(containerId: string, options: NavbarOptions): void {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="navbar-spacer"></div>
    <div class="navbar-actions">
      <button class="icon-btn position-relative" id="notif-bell" title="Notificaciones">
        <i class="bi bi-bell"></i>
        ${options.hasNotifications ? '<span class="notif-dot"></span>' : ''}
      </button>
      <div class="avatar-circle">${options.userInitial}</div>
      <button class="icon-btn" id="logout-btn" title="Cerrar sesión">
        <i class="bi bi-box-arrow-right"></i>
      </button>
    </div>
  `;

  document.getElementById('logout-btn')?.addEventListener('click', () => {
    clearSession();
    window.location.href = '/src/pages/login.html';
  });
}

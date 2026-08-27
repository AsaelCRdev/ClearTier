export type PageKey = 'dashboard' | 'users' | 'roles' | 'permissions' | 'audit' | 'ai-assistant';

const NAV_ITEMS: { key: PageKey; label: string; icon: string; href: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill', href: '/src/pages/dashboard.html' },
  { key: 'users', label: 'Users', icon: 'bi-people-fill', href: '/src/pages/users/users.html' },
  { key: 'roles', label: 'Roles', icon: 'bi-key-fill', href: '/src/pages/roles/roles.html' },
  { key: 'permissions', label: 'Permissions', icon: 'bi-shield-lock-fill', href: '/src/pages/permissions/permissions.html' },
  { key: 'audit', label: 'Audit Log', icon: 'bi-clock-history', href: '/src/pages/audit/audit.html' },
];

const AI_ITEM = { key: 'ai-assistant' as PageKey, label: 'AI Assistant', icon: 'bi-robot', href: '/src/pages/ai-assistant/ai-assistant.html' };

/* Inyecta el HTML de la sidebar dentro del elemento con id `containerId`, y marca como activo el item que coincida con `activePage`.
 Esto reemplaza al `routerLinkActive` que usarías en Angular.
 */
export function renderSidebar(containerId: string, activePage: PageKey): void {
  const container = document.getElementById(containerId);
  if (!container) return;

  const renderItem = (item: (typeof NAV_ITEMS)[number]) => `
    <a href="${item.href}" class="sidebar-link ${item.key === activePage ? 'active' : ''}">
      <i class="bi ${item.icon}"></i>
      <span>${item.label}</span>
    </a>`;

  container.innerHTML = `
    <details class="sidebar-menu">
      <summary class="sidebar-menu-toggle">
        <span class="sidebar-brand">
          <i class="bi bi-shield-fill-check"></i>
          <span>ClearTier</span>
        </span>
        <i class="bi bi-chevron-down sidebar-menu-chevron" aria-hidden="true"></i>
      </summary>
      <div class="sidebar-menu-content">
        <nav class="sidebar-nav" aria-label="Main navigation">
          ${NAV_ITEMS.map(renderItem).join('')}
        </nav>
        <div class="sidebar-section-label">INTELLIGENCE</div>
        <nav class="sidebar-nav" aria-label="Intelligence navigation">
          ${renderItem(AI_ITEM)}
        </nav>
      </div>
    </details>
  `;
}

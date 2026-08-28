import { requireAuth } from '../auth/routeGuard';
import { renderSidebar } from '../components/sidebar';
import { renderNavbar } from '../components/navbar';
import { showToast } from '../components/toast';
import { fetchResources, fetchPermissionMatrix, toggleCell } from '../api/permissionApi';
import { fetchRoles } from '../api/roleApi';
import type { Resource, PermissionCell, PermissionEffect } from '../models/permission.model';
import type { Role } from '../models/role.model';

const session = requireAuth();
renderSidebar('sidebar-root', 'permissions');
renderNavbar('navbar-root', { userInitial: session.userFullName.charAt(0), hasNotifications: true });

const tabsContainer = document.getElementById('role-filter-tabs') as HTMLDivElement;
const headRow = document.getElementById('matrix-head-row') as HTMLTableRowElement;
const body = document.getElementById('matrix-body') as HTMLTableSectionElement;

let roles: Role[] = [];
let resources: Resource[] = [];
let matrix: PermissionCell[] = [];
let activeRoleId: string | 'ALL' = 'ALL';

function effectClass(effect: PermissionEffect): string {
  return effect === 'ALLOW' ? 'effect-allow' : effect === 'DENY' ? 'effect-deny' : 'effect-unset';
}

function renderTabs(): void {
  const tabs = [{ id: 'ALL' as const, label: 'All Roles' }, ...roles.filter((r) => !r.isSystemRole).map((r) => ({ id: r.id, label: r.name }))];
  tabsContainer.innerHTML = tabs
    .map(
      (tab) => `<button class="btn btn-sm ${activeRoleId === tab.id ? 'btn-warning' : 'btn-outline-light'}" data-tab-id="${tab.id}">${tab.label}</button>`
    )
    .join('');

  tabsContainer.querySelectorAll<HTMLButtonElement>('button[data-tab-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeRoleId = btn.dataset.tabId as string;
      renderTabs();
      renderTable();
    });
  });
}

function renderTable(): void {
  const visibleRoles = activeRoleId === 'ALL' ? roles : roles.filter((r) => r.id === activeRoleId);

  headRow.innerHTML =
    `<th>Resource</th>` +
    visibleRoles.map((r) => `<th ${r.isSystemRole ? 'style="color:var(--accent);"' : ''}>${r.name}${r.isSystemRole ? ' (System)' : ''}</th>`).join('');

  body.innerHTML = resources
    .map((resource) => {
      const cells = visibleRoles
        .map((role) => {
          const cell = matrix.find((c) => c.roleId === role.id && c.resourceId === resource.id) ?? {
            roleId: role.id,
            resourceId: resource.id,
            effect: 'UNSET' as PermissionEffect,
          };
          const disabled = role.isSystemRole;
          return `<td>
            <button class="matrix-cell-btn ${effectClass(cell.effect)}"
                    data-role-id="${role.id}" data-resource-id="${resource.id}"
                    ${disabled ? 'disabled' : ''}>
              ${cell.effect}
            </button>
          </td>`;
        })
        .join('');
      return `<tr><td class="fw-semibold">${resource.label}</td>${cells}</tr>`;
    })
    .join('');

  body.querySelectorAll<HTMLButtonElement>('.matrix-cell-btn:not(:disabled)').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const roleId = btn.dataset.roleId!;
      const resourceId = btn.dataset.resourceId!;
      try {
        const newEffect = await toggleCell(roleId, resourceId);
      // Actualiza solo esa celda en memoria y su botón en el DOM — evita
      // volver a pedir toda la matriz al servidor por un solo clic.
      const cell = matrix.find((c) => c.roleId === roleId && c.resourceId === resourceId)!;
      cell.effect = newEffect;
      btn.textContent = newEffect;
      btn.className = `matrix-cell-btn ${effectClass(newEffect)}`;
      showToast(`Permiso actualizado a ${newEffect}`, 'success');
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'No se pudo actualizar el permiso', 'error');
      }
    });
  });
}

async function loadAll(): Promise<void> {
  [roles, resources, matrix] = await Promise.all([fetchRoles(), fetchResources(), fetchPermissionMatrix()]);
  renderTabs();
  renderTable();
}

loadAll();

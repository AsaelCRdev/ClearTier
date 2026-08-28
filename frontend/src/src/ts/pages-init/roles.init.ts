import { requireAuth } from '../auth/routeGuard';
import { renderSidebar } from '../components/sidebar';
import { renderNavbar } from '../components/navbar';
import { showToast } from '../components/toast';
import { openModal } from '../components/modal';
import { fetchRoles, createRole, canDeleteRole } from '../api/roleApi';
import { isValidRoleName } from '../utils/validators';
import type { Role } from '../models/role.model';

const session = requireAuth();
renderSidebar('sidebar-root', 'roles');
renderNavbar('navbar-root', { userInitial: session.userFullName.charAt(0), hasNotifications: true });

const grid = document.getElementById('roles-grid') as HTMLDivElement;
const createBtn = document.getElementById('create-role-btn') as HTMLButtonElement;

// Guarda qué tarjetas están expandidas para no perder ese estado al re-renderizar.
const expandedRoleIds = new Set<string>();

function renderRoleCard(role: Role): string {
  const isExpanded = expandedRoleIds.has(role.id);

  if (role.isSystemRole) {
    return `
      <div class="col-md-4">
        <div class="app-card role-card system-role">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-2">
              <span class="fw-semibold">${role.name}</span>
              <span class="badge-pill badge-super-admin"><i class="bi bi-lock-fill me-1"></i>System</span>
            </div>
          </div>
          <div style="color:var(--text-muted); font-size:0.85rem;" class="mt-1"><i class="bi bi-people-fill me-1"></i>${role.usersCount} Users</div>
          <div class="role-locked-banner">
            <i class="bi bi-lock-fill"></i>
            <div>
              <div class="fw-semibold">System Role Protected</div>
              <div>This role is immutable. Its core permissions and definition cannot be altered or deleted to ensure system stability.</div>
            </div>
          </div>
          <button class="btn btn-outline-light w-100 mt-3" disabled><i class="bi bi-lock-fill me-1"></i>Locked</button>
        </div>
      </div>`;
  }

  return `
    <div class="col-md-4">
      <div class="app-card role-card" data-role-id="${role.id}">
        <div class="d-flex justify-content-between align-items-center">
          <span class="fw-semibold">${role.name}</span>
          <i class="bi ${isExpanded ? 'bi-chevron-down' : 'bi-chevron-right'}"></i>
        </div>
        <div style="color:var(--text-muted); font-size:0.85rem;" class="mt-1"><i class="bi bi-people-fill me-1"></i>${role.usersCount} Users</div>
        ${
          isExpanded
            ? `
          <hr style="border-color: var(--border-subtle);" />
          <p style="color:var(--text-muted); font-size:0.85rem;">${role.description || 'Sin descripción.'}</p>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-light btn-sm flex-fill" data-action="edit">Edit</button>
            <button class="btn btn-outline-light btn-sm flex-fill" data-action="delete" ${role.usersCount > 0 ? 'disabled title="No se puede eliminar: tiene usuarios activos"' : ''}>Delete</button>
          </div>`
            : ''
        }
      </div>
    </div>`;
}

async function loadRoles(): Promise<void> {
  const roles = await fetchRoles();
  grid.innerHTML = roles.map(renderRoleCard).join('');
  attachCardListeners(roles);
}

function attachCardListeners(roles: Role[]): void {
  grid.querySelectorAll<HTMLDivElement>('.role-card[data-role-id]').forEach((card) => {
    const roleId = card.dataset.roleId!;

    card.addEventListener('click', (event) => {
      // Si el clic vino de un botón interno (Edit/Delete), no togglear el expand.
      if ((event.target as HTMLElement).closest('button')) return;
      if (expandedRoleIds.has(roleId)) expandedRoleIds.delete(roleId);
      else expandedRoleIds.add(roleId);
      loadRoles();
    });

    card.querySelector('[data-action="delete"]')?.addEventListener('click', async (e) => {
      e.stopPropagation();
      const allowed = await canDeleteRole(roleId);
      if (!allowed) {
        showToast('No se puede eliminar un rol con usuarios activos asignados', 'error');
        return;
      }
      const role = roles.find((r) => r.id === roleId)!;
      openModal({
        title: `Eliminar rol "${role.name}"`,
        bodyHtml: `<p>¿Seguro que deseas eliminar este rol? Esta acción quedará registrada en auditoría.</p>`,
        confirmLabel: 'Eliminar',
        onConfirm: () => showToast('Rol eliminado', 'success'), // en un backend real: DELETE /api/roles/:id
      });
    });
  });
}

createBtn.addEventListener('click', () => {
  openModal({
    title: 'Create Role',
    bodyHtml: `
      <div class="mb-3">
        <label class="form-label" style="color:var(--text-muted); font-size:0.85rem;">Nombre del rol</label>
        <input type="text" class="form-control" id="new-role-name" placeholder="Ej. Contractor (Temp)" />
      </div>
      <div class="mb-2">
        <label class="form-label" style="color:var(--text-muted); font-size:0.85rem;">Descripción</label>
        <textarea class="form-control" id="new-role-description" rows="3"></textarea>
      </div>
      <div class="text-danger small" id="new-role-error" style="display:none;"></div>
    `,
    confirmLabel: 'Guardar',
    onConfirm: async () => {
      const name = (document.getElementById('new-role-name') as HTMLInputElement)?.value ?? '';
      const description = (document.getElementById('new-role-description') as HTMLTextAreaElement)?.value ?? '';
      if (!isValidRoleName(name)) {
        showToast('El nombre debe tener entre 3 y 20 caracteres', 'error');
        return;
      }
      try {
        await createRole({ name, description });
        showToast('Rol creado exitosamente', 'success');
        await loadRoles();
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'No se pudo crear el rol', 'error');
      }
    },
  });
});

loadRoles();

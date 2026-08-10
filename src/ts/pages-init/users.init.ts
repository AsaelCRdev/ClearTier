import { requireAuth } from '../auth/routeGuard';
import { renderSidebar } from '../components/sidebar';
import { renderNavbar } from '../components/navbar';
import { showToast } from '../components/toast';
import { fetchUsers, createUser } from '../api/userApi';
import { fetchRoles } from '../api/roleApi';
import { isValidEmail } from '../utils/validators';
import type { User } from '../models/user.model';
import type { Role } from '../models/role.model';

const session = requireAuth();
renderSidebar('sidebar-root', 'users');
renderNavbar('navbar-root', { userInitial: session.userFullName.charAt(0), hasNotifications: true });

const tableBody = document.getElementById('users-table-body') as HTMLTableSectionElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const roleSelect = document.getElementById('input-role') as HTMLSelectElement;
const form = document.getElementById('create-user-form') as HTMLFormElement;
const toggleBtn = document.getElementById('toggle-form-btn') as HTMLButtonElement;
const toggleLabel = document.getElementById('toggle-form-label') as HTMLSpanElement;
const errorBox = document.getElementById('create-user-error') as HTMLDivElement;

let allUsers: User[] = [];
let allRoles: Role[] = [];

/** Dibuja la tabla, aplicando el filtro de búsqueda por nombre o email. */
function renderTable(filterText = ''): void {
  const filtered = allUsers
    .filter((u) => u.fullName.toLowerCase().includes(filterText.toLowerCase()) || u.email.toLowerCase().includes(filterText.toLowerCase()))
    .sort((a, b) => a.fullName.localeCompare(b.fullName));

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4" style="color:var(--text-muted);">No se encontraron usuarios.</td></tr>`;
    return;
  }

  tableBody.innerHTML = filtered
    .map(
      (u) => `
      <tr>
        <td>
          <div class="fw-semibold">${escapeHtml(u.fullName)}</div>
          <div style="color:var(--text-muted); font-size:0.82rem;">${escapeHtml(u.email)}</div>
        </td>
        <td><span class="badge-pill ${u.roleName === 'Super Admin' ? 'badge-super-admin' : 'badge-role'}">${escapeHtml(u.roleName)}</span></td>
        <td><span class="badge-pill ${u.status === 'Active' ? 'badge-active' : 'badge-inactive'}">${u.status}</span></td>
        <td class="text-end pe-3" style="color:var(--text-muted);">···</td>
      </tr>`
    )
    .join('');
}

/** Previene inyección de HTML si un nombre/correo contuviera caracteres especiales. */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function loadData(): Promise<void> {
  [allUsers, allRoles] = await Promise.all([fetchUsers(), fetchRoles()]);
  roleSelect.innerHTML = allRoles.map((r) => `<option value="${r.id}">${r.name}</option>`).join('');
  renderTable();
}

searchInput.addEventListener('input', () => renderTable(searchInput.value));

toggleBtn.addEventListener('click', () => {
  const isHidden = form.style.display === 'none';
  form.style.display = isHidden ? 'block' : 'none';
  toggleLabel.textContent = isHidden ? 'Cancel' : 'Provision User';
  toggleBtn.querySelector('i')!.className = isHidden ? 'bi bi-x-lg me-1' : 'bi bi-plus-lg me-1';
  errorBox.style.display = 'none';
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorBox.style.display = 'none';

  const fullName = (document.getElementById('input-full-name') as HTMLInputElement).value.trim();
  const email = (document.getElementById('input-email') as HTMLInputElement).value.trim();
  const roleId = roleSelect.value;

  if (!fullName || !isValidEmail(email)) {
    errorBox.textContent = 'Completa el nombre y un correo válido.';
    errorBox.style.display = 'block';
    return;
  }

  try {
    await createUser({ fullName, email, roleId });
    showToast('Usuario creado exitosamente', 'success');
    form.reset();
    toggleBtn.click();
    await loadData();
  } catch (err) {
    errorBox.textContent = err instanceof Error ? err.message : 'No se pudo crear el usuario';
    errorBox.style.display = 'block';
  }
});

loadData();

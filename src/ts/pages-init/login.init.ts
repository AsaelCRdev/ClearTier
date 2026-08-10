import { login } from '../api/authApi';
import { saveSession, getSession } from '../auth/tokenStorage';

// Si ya hay una sesión activa, no tiene sentido mostrar el login de nuevo.
if (getSession()) {
  window.location.href = '/src/pages/dashboard.html';
}

const form = document.getElementById('login-form') as HTMLFormElement;
const errorBox = document.getElementById('login-error') as HTMLDivElement;
const submitBtn = document.getElementById('login-submit-btn') as HTMLButtonElement;

form.addEventListener('submit', async (event) => {
  // preventDefault() evita que el navegador recargue la página al enviar
  // el formulario (comportamiento HTML por defecto que no queremos en una SPA-lite).
  event.preventDefault();
  errorBox.style.display = 'none';

  const adminId = (document.getElementById('admin-id') as HTMLInputElement).value;
  const securityToken = (document.getElementById('security-token') as HTMLInputElement).value;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Authenticating...';

  try {
    const result = await login(adminId, securityToken);
    saveSession({ token: result.token, userFullName: result.userFullName, roleName: result.roleName });
    window.location.href = '/src/pages/dashboard.html';
  } catch (err) {
    errorBox.textContent = err instanceof Error ? err.message : 'Error de autenticación';
    errorBox.style.display = 'block';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Authenticate Session';
  }
});

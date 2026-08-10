/*Muestra un mensaje flotante temporal (éxito o error). Se usa en lugar de
 `alert()` porque no bloquea la interacción y se ve consistente con el
  diseño dark theme del resto de la app.

  Requiere un contenedor `<div id="toast-root"></div>` en el HTML de la
  página (se agrega automáticamente si no existe).
 */
export function showToast(message: string, variant: 'success' | 'error' = 'success'): void {
  let root = document.getElementById('toast-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'toast-root';
    document.body.appendChild(root);
  }

  const toast = document.createElement('div');
  toast.className = `app-toast app-toast-${variant}`;
  toast.innerHTML = `
    <i class="bi ${variant === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}"></i>
    <span>${message}</span>
  `;
  root.appendChild(toast);

  // requestAnimationFrame asegura que el navegador pinte el estado inicial
  // antes de agregar la clase que dispara la transición CSS de entrada.
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300); 
  }, 3500);
}

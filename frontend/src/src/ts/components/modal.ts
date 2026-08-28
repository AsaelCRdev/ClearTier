interface ModalOptions {
  title: string;
  bodyHtml: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  showConfirm?: boolean;
}

/*Crea y muestra un modal genérico (usado tanto para el "Print Preview" del Audit Log como para confirmaciones de eliminar rol, etc.).
  Se construye 100% en memoria y se destruye del DOM al cerrarse, para no dejar nodos huérfanos acumulándose en la página.
 */
export function openModal(options: ModalOptions): void {
  const overlay = document.createElement('div');
  overlay.className = 'app-modal-overlay';
  overlay.innerHTML = `
    <div class="app-modal">
      <div class="app-modal-header">
        <h5>${options.title}</h5>
        <button class="icon-btn" id="modal-close-btn"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="app-modal-body">${options.bodyHtml}</div>
      <div class="app-modal-footer">
        <button class="btn btn-outline-light" id="modal-cancel-btn">Cancel</button>
        ${options.showConfirm !== false ? `<button class="btn btn-warning" id="modal-confirm-btn">${options.confirmLabel ?? 'Confirmar'}</button>` : ''}
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.querySelector('#modal-close-btn')?.addEventListener('click', close);
  overlay.querySelector('#modal-cancel-btn')?.addEventListener('click', close);
  overlay.querySelector('#modal-confirm-btn')?.addEventListener('click', () => {
    options.onConfirm?.();
    close();
  });
  // Cerrar al hacer clic fuera del cuadro del modal (en el overlay oscuro).
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
}

function e(e){let t=document.createElement(`div`);t.className=`app-modal-overlay`,t.innerHTML=`
    <div class="app-modal">
      <div class="app-modal-header">
        <h5>${e.title}</h5>
        <button class="icon-btn" id="modal-close-btn"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="app-modal-body">${e.bodyHtml}</div>
      <div class="app-modal-footer">
        <button class="btn btn-outline-light" id="modal-cancel-btn">Cancel</button>
        ${e.showConfirm===!1?``:`<button class="btn btn-warning" id="modal-confirm-btn">${e.confirmLabel??`Confirmar`}</button>`}
      </div>
    </div>
  `,document.body.appendChild(t);let n=()=>t.remove();t.querySelector(`#modal-close-btn`)?.addEventListener(`click`,n),t.querySelector(`#modal-cancel-btn`)?.addEventListener(`click`,n),t.querySelector(`#modal-confirm-btn`)?.addEventListener(`click`,()=>{e.onConfirm?.(),n()}),t.addEventListener(`click`,e=>{e.target===t&&n()})}export{e as t};
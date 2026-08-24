import"./tokenStorage-DVhbB3ZF.js";import{n as e,r as t,t as n}from"./navbar-C9i_qDKd.js";import{n as r,r as i,t as a}from"./roleApi-C7egl86q.js";import{t as o}from"./toast-wPD29RCn.js";import{n as s}from"./validators-eXC2fl6a.js";import{t as c}from"./modal-9Ha9NeQJ.js";var l=t();e(`sidebar-root`,`roles`),n(`navbar-root`,{userInitial:l.userFullName.charAt(0),hasNotifications:!0});var u=document.getElementById(`roles-grid`),d=document.getElementById(`create-role-btn`),f=new Set;function p(e){let t=f.has(e.id);return e.isSystemRole?`
      <div class="col-md-4">
        <div class="app-card role-card system-role">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-2">
              <span class="fw-semibold">${e.name}</span>
              <span class="badge-pill badge-super-admin"><i class="bi bi-lock-fill me-1"></i>System</span>
            </div>
          </div>
          <div style="color:var(--text-muted); font-size:0.85rem;" class="mt-1"><i class="bi bi-people-fill me-1"></i>${e.usersCount} Users</div>
          <div class="role-locked-banner">
            <i class="bi bi-lock-fill"></i>
            <div>
              <div class="fw-semibold">System Role Protected</div>
              <div>This role is immutable. Its core permissions and definition cannot be altered or deleted to ensure system stability.</div>
            </div>
          </div>
          <button class="btn btn-outline-light w-100 mt-3" disabled><i class="bi bi-lock-fill me-1"></i>Locked</button>
        </div>
      </div>`:`
    <div class="col-md-4">
      <div class="app-card role-card" data-role-id="${e.id}">
        <div class="d-flex justify-content-between align-items-center">
          <span class="fw-semibold">${e.name}</span>
          <i class="bi ${t?`bi-chevron-down`:`bi-chevron-right`}"></i>
        </div>
        <div style="color:var(--text-muted); font-size:0.85rem;" class="mt-1"><i class="bi bi-people-fill me-1"></i>${e.usersCount} Users</div>
        ${t?`
          <hr style="border-color: var(--border-subtle);" />
          <p style="color:var(--text-muted); font-size:0.85rem;">${e.description||`Sin descripción.`}</p>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-light btn-sm flex-fill" data-action="edit">Edit</button>
            <button class="btn btn-outline-light btn-sm flex-fill" data-action="delete" ${e.usersCount>0?`disabled title="No se puede eliminar: tiene usuarios activos"`:``}>Delete</button>
          </div>`:``}
      </div>
    </div>`}async function m(){let e=await i();u.innerHTML=e.map(p).join(``),h(e)}function h(e){u.querySelectorAll(`.role-card[data-role-id]`).forEach(t=>{let n=t.dataset.roleId;t.addEventListener(`click`,e=>{e.target.closest(`button`)||(f.has(n)?f.delete(n):f.add(n),m())}),t.querySelector(`[data-action="delete"]`)?.addEventListener(`click`,async t=>{if(t.stopPropagation(),!await a(n)){o(`No se puede eliminar un rol con usuarios activos asignados`,`error`);return}let r=e.find(e=>e.id===n);c({title:`Eliminar rol "${r.name}"`,bodyHtml:`<p>¿Seguro que deseas eliminar este rol? Esta acción quedará registrada en auditoría.</p>`,confirmLabel:`Eliminar`,onConfirm:()=>o(`Rol eliminado`,`success`)})})})}d.addEventListener(`click`,()=>{c({title:`Create Role`,bodyHtml:`
      <div class="mb-3">
        <label class="form-label" style="color:var(--text-muted); font-size:0.85rem;">Nombre del rol</label>
        <input type="text" class="form-control" id="new-role-name" placeholder="Ej. Contractor (Temp)" />
      </div>
      <div class="mb-2">
        <label class="form-label" style="color:var(--text-muted); font-size:0.85rem;">Descripción</label>
        <textarea class="form-control" id="new-role-description" rows="3"></textarea>
      </div>
      <div class="text-danger small" id="new-role-error" style="display:none;"></div>
    `,confirmLabel:`Guardar`,onConfirm:async()=>{let e=document.getElementById(`new-role-name`)?.value??``,t=document.getElementById(`new-role-description`)?.value??``;if(!s(e)){o(`El nombre debe tener entre 3 y 20 caracteres`,`error`);return}try{await r({name:e,description:t}),o(`Rol creado exitosamente`,`success`),await m()}catch(e){o(e instanceof Error?e.message:`No se pudo crear el rol`,`error`)}}})}),m();
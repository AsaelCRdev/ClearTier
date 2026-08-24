import{n as e,t}from"./tokenStorage-DVhbB3ZF.js";function n(){let t=e();if(!t)throw window.location.href=`/src/pages/login.html`,Error(`No autenticado`);return t}var r=[{key:`dashboard`,label:`Dashboard`,icon:`bi-grid-1x2-fill`,href:`/src/pages/dashboard.html`},{key:`users`,label:`Users`,icon:`bi-people-fill`,href:`/src/pages/users/users.html`},{key:`roles`,label:`Roles`,icon:`bi-key-fill`,href:`/src/pages/roles/roles.html`},{key:`permissions`,label:`Permissions`,icon:`bi-shield-lock-fill`,href:`/src/pages/permissions/permissions.html`},{key:`audit`,label:`Audit Log`,icon:`bi-clock-history`,href:`/src/pages/audit/audit.html`}],i={key:`ai-assistant`,label:`AI Assistant`,icon:`bi-robot`,href:`/src/pages/ai-assistant/ai-assistant.html`};function a(e,t){let n=document.getElementById(e);if(!n)return;let a=e=>`
    <a href="${e.href}" class="sidebar-link ${e.key===t?`active`:``}">
      <i class="bi ${e.icon}"></i>
      <span>${e.label}</span>
    </a>`;n.innerHTML=`
    <div class="sidebar-brand">
      <i class="bi bi-shield-fill-check"></i>
      <span>IAM Control</span>
    </div>
    <nav class="sidebar-nav">
      ${r.map(a).join(``)}
    </nav>
    <div class="sidebar-section-label">INTELLIGENCE</div>
    <nav class="sidebar-nav">
      ${a(i)}
    </nav>
  `}function o(e,n){let r=document.getElementById(e);r&&(r.innerHTML=`
    <div class="navbar-spacer"></div>
    <div class="navbar-actions">
      <button class="icon-btn position-relative" id="notif-bell" title="Notificaciones">
        <i class="bi bi-bell"></i>
        ${n.hasNotifications?`<span class="notif-dot"></span>`:``}
      </button>
      <div class="avatar-circle">${n.userInitial}</div>
      <button class="icon-btn" id="logout-btn" title="Cerrar sesión">
        <i class="bi bi-box-arrow-right"></i>
      </button>
    </div>
  `,document.getElementById(`logout-btn`)?.addEventListener(`click`,()=>{t(),window.location.href=`/src/pages/login.html`}))}export{a as n,n as r,o as t};
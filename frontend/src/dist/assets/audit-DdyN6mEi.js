import"./tokenStorage-DVhbB3ZF.js";import{n as e,r as t,t as n}from"./navbar-C9i_qDKd.js";import{t as r}from"./auditApi-BS7Bqp6T.js";import{t as i}from"./modal-9Ha9NeQJ.js";function a(e){let t=new Date(e),n=e=>String(e).padStart(2,`0`);return`${t.getFullYear()}-${n(t.getMonth()+1)}-${n(t.getDate())} ${n(t.getHours())}:${n(t.getMinutes())}:${n(t.getSeconds())}`}function o(e){return e.includes(`,`)||e.includes(`"`)||e.includes(`
`)?`"${e.replace(/"/g,`""`)}"`:e}var s=t();e(`sidebar-root`,`audit`),n(`navbar-root`,{userInitial:s.userFullName.charAt(0),hasNotifications:!0});var c=document.getElementById(`audit-table-body`),l=document.getElementById(`filter-input`),u=document.getElementById(`filter-date`),d=document.getElementById(`export-csv-btn`),f=[];function p(){let e=l.value.toLowerCase(),t=u.value;return f.filter(n=>{let r=!e||n.actor.toLowerCase().includes(e)||n.action.toLowerCase().includes(e),i=!t||n.timestamp.slice(0,10)===t;return r&&i})}function m(){let e=p();if(e.length===0){c.innerHTML=`<tr><td colspan="4" class="text-center py-4" style="color:var(--text-muted);">No hay auditorías que coincidan con el filtro.</td></tr>`;return}c.innerHTML=e.map(e=>`
      <tr>
        <td style="font-family: Consolas, monospace; font-size:0.85rem;">${a(e.timestamp)}</td>
        <td>${e.actor}</td>
        <td style="color:var(--accent);">${e.action}</td>
        <td>${e.target}</td>
      </tr>`).join(``)}l.addEventListener(`input`,m),u.addEventListener(`change`,m);function h(e){let t=[`Timestamp,Actor,Action,Target`,...e.map(e=>[a(e.timestamp),e.actor,e.action,e.target].map(o).join(`,`))].join(`
`),n=new Blob([t],{type:`text/csv;charset=utf-8;`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=`iam-audit-log-${new Date().toISOString().slice(0,10)}.csv`,i.click(),URL.revokeObjectURL(r)}function g(e){let t=e.map(e=>`<tr><td>${a(e.timestamp).slice(0,10)}<br/><span style="font-size:0.75rem;color:#888;">${a(e.timestamp).slice(11)}</span></td><td>${e.actor}</td><td>${e.action} : ${e.target}</td></tr>`).join(``);i({title:`Export Audit Log (Print Preview)`,showConfirm:!1,bodyHtml:`
      <div style="background:white; color:#111; padding:1rem; border-radius:6px;">
        <h5 style="margin-bottom:0.2rem;">IAM Audit Log Export</h5>
        <p style="color:#666; font-size:0.8rem;">Generated: ${new Date().toLocaleString(`en-US`)}</p>
        <table style="width:100%; border-collapse:collapse; font-size:0.85rem;">
          <thead><tr style="border-bottom:1px solid #ccc;"><th style="text-align:left;padding:6px 4px;">Date</th><th style="text-align:left;padding:6px 4px;">Actor</th><th style="text-align:left;padding:6px 4px;">Action</th></tr></thead>
          <tbody id="print-preview-rows">${t}</tbody>
        </table>
      </div>
      <div class="text-end mt-3">
        <button class="btn btn-warning" id="print-to-pdf-btn"><i class="bi bi-printer me-1"></i>Print to PDF</button>
      </div>
    `}),document.getElementById(`print-to-pdf-btn`)?.addEventListener(`click`,()=>window.print())}d.addEventListener(`click`,()=>{let e=p();h(e),g(e)});async function _(){f=await r(),m()}_();
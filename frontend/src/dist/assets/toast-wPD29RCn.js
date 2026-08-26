function e(e,t=`success`){let n=document.getElementById(`toast-root`);n||(n=document.createElement(`div`),n.id=`toast-root`,document.body.appendChild(n));let r=document.createElement(`div`);r.className=`app-toast app-toast-${t}`,r.innerHTML=`
    <i class="bi ${t===`success`?`bi-check-circle-fill`:`bi-x-circle-fill`}"></i>
    <span>${e}</span>
  `,n.appendChild(r),requestAnimationFrame(()=>r.classList.add(`show`)),setTimeout(()=>{r.classList.remove(`show`),setTimeout(()=>r.remove(),300)},3500)}export{e as t};
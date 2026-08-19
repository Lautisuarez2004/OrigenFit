/* Origen Fit · sincroniza el carrito al volver desde una ficha, incluso con BFCache/Safari. */
document.addEventListener('DOMContentLoaded',()=>{
  const CART_KEY='origenfit-cart-v1';
  const isStore=()=>!!document.getElementById('grid')||!!document.getElementById('comboGrid');
  if(!isStore())return;

  const signature=()=>localStorage.getItem(CART_KEY)||'[]';
  let snapshot=signature();
  let reloading=false;

  const remember=()=>{snapshot=signature();};
  const syncIfChanged=()=>{
    if(reloading)return;
    const current=signature();
    if(current===snapshot)return;
    reloading=true;
    location.reload();
  };

  /* Guardamos el estado que la tienda estaba mostrando justo antes de dejarla. */
  window.addEventListener('pagehide',remember,{capture:true});
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='hidden')remember();
    else if(document.visibilityState==='visible')setTimeout(syncIfChanged,0);
  });

  /* Cubrimos regreso por historial, pestañas y restauración desde BFCache. */
  window.addEventListener('pageshow',()=>setTimeout(syncIfChanged,0));
  window.addEventListener('focus',()=>setTimeout(syncIfChanged,0));
});

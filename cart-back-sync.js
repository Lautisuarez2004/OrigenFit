/* Origen Fit · sincroniza el carrito al volver con Atrás/Adelante, incluso con BFCache de Safari/iPhone. */
(()=>{
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

  /* Antes de abandonar/congelar la tienda guardamos el estado que estaba mostrando. */
  window.addEventListener('pagehide',remember,{capture:true});
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='hidden')remember();
    else if(document.visibilityState==='visible')setTimeout(syncIfChanged,0);
  });

  /* Al volver desde una ficha, Safari puede restaurar la página desde BFCache sin reconstruir el JS. */
  window.addEventListener('pageshow',()=>setTimeout(syncIfChanged,0));
  window.addEventListener('focus',()=>setTimeout(syncIfChanged,0));
})();

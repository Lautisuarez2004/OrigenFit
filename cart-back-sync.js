/* Origen Fit · sincroniza el carrito al volver con la navegación Atrás/Adelante del navegador. */
(()=>{
  const CART_KEY='origenfit-cart-v1';
  const savedCount=()=>{
    try{
      const cart=JSON.parse(localStorage.getItem(CART_KEY)||'[]');
      return Array.isArray(cart)?cart.reduce((sum,item)=>sum+(Number(item?.quantity)||0),0):0;
    }catch(_){return 0;}
  };

  window.addEventListener('pageshow',event=>{
    const nav=performance.getEntriesByType?.('navigation')?.[0];
    const fromHistory=!!event.persisted||nav?.type==='back_forward';
    if(!fromHistory)return;

    /* Sólo importa en la tienda/listados, que son los que pueden volver desde BFCache con el carrito viejo. */
    if(!document.getElementById('grid')&&!document.getElementById('comboGrid'))return;

    setTimeout(()=>{
      const badge=document.getElementById('ofCartCount');
      if(!badge)return;
      const shown=Number(String(badge.textContent||'0').trim())||0;
      const saved=savedCount();
      if(shown!==saved)location.reload();
    },120);
  });
})();

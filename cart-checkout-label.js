/* Origen Fit · copy final del CTA del carrito */
document.addEventListener('DOMContentLoaded',()=>{
  const apply=()=>{
    const button=document.getElementById('ofCartCheckout');
    if(!button)return false;
    button.textContent='Finalizar compra';
    button.setAttribute('aria-label','Finalizar compra');
    return true;
  };

  if(apply())return;
  const observer=new MutationObserver(()=>{
    if(apply())observer.disconnect();
  });
  observer.observe(document.body,{childList:true,subtree:true});
});

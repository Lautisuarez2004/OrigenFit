/* Origen Fit · acción Seguir comprando desde carrito y fichas */
document.addEventListener('DOMContentLoaded',()=>{
  const style=document.createElement('style');
  style.textContent=`
    .of-cart-continue{
      width:100%;border:1px solid #111;border-radius:999px;padding:12px 14px;
      background:#fff;color:#111;font-weight:950;margin:0 0 10px;cursor:pointer;
    }
    .of-cart-continue:hover{background:#f4f4f5}
  `;
  document.head.appendChild(style);

  const mount=()=>{
    const foot=document.querySelector('.of-cart-foot');
    const checkout=document.getElementById('ofCartCheckout');
    if(!foot||!checkout)return false;
    if(document.getElementById('ofCartContinue'))return true;

    const btn=document.createElement('button');
    btn.id='ofCartContinue';
    btn.className='of-cart-continue';
    btn.type='button';
    btn.textContent='Seguir comprando';
    btn.setAttribute('aria-label','Seguir comprando');
    checkout.insertAdjacentElement('beforebegin',btn);

    btn.onclick=()=>{
      const isComboDetail=document.body?.dataset?.comboDetail==='1';
      const isProductDetail=document.body?.dataset?.productDetail==='1';
      if(isComboDetail){window.location.href='index.html#combos';return;}
      if(isProductDetail){window.location.href='index.html#productos';return;}
      document.getElementById('ofCartClose')?.click();
    };
    return true;
  };

  if(mount())return;
  const observer=new MutationObserver(()=>{
    if(mount())observer.disconnect();
  });
  observer.observe(document.body,{childList:true,subtree:true});
});

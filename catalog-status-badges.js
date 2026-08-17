/* Origen Fit · badges limpios + jerarquía de precio promo en productos y combos */
document.addEventListener('DOMContentLoaded',async()=>{
  if(typeof db==='undefined') return;
  const productGrid=document.getElementById('grid');
  const comboGrid=document.getElementById('comboGrid');
  const detailPriceBox=document.getElementById('priceBox');
  if(!productGrid&&!comboGrid&&!detailPriceBox) return;

  const style=document.createElement('style');
  style.textContent=`
    .product-card-link .art,.combo-card .combo-art{position:relative!important}
    .product-card-link>.body-card>.of-card-flags,.combo-card .of-card-flags{display:none!important}
    .of-status-overlay{position:absolute;top:12px;left:12px;z-index:8;display:flex;flex-direction:column;align-items:flex-start;gap:7px;pointer-events:none}
    .of-status-overlay span{display:inline-flex;align-items:center;min-height:27px;padding:6px 10px;border-radius:5px;font-size:.72rem;line-height:1;font-weight:950;letter-spacing:.025em;text-transform:uppercase;box-shadow:0 2px 8px rgba(0,0,0,.12)}
    .of-status-overlay .shipping{background:#31a844;color:#fff}.of-status-overlay .out{background:#111;color:#fff}
    .of-promo-label,.of-combo-promo-label{display:none!important}
    .of-payment-label,#priceBox .promo-label{display:block!important;position:static!important;transform:none!important;color:var(--red,#e30613)!important;font-size:.78rem!important;line-height:1.15!important;font-weight:950!important;margin:4px 0 0!important;overflow-wrap:anywhere}
    .of-price-stack,.of-combo-payment-stack{display:flex!important;flex-direction:column!important;align-items:flex-end!important;gap:3px!important;min-width:max-content!important}
    .of-price-stack .price,.of-combo-payment-stack .combo-price{margin:0!important}
    #priceBox{display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:4px!important}
    #priceBox .price,#priceBox .old{margin:0!important}
    @media(max-width:650px){.of-status-overlay{top:9px;left:9px;gap:5px}.of-status-overlay span{min-height:24px;padding:5px 8px;font-size:.64rem;border-radius:4px}.of-price-stack,.of-combo-payment-stack{align-items:flex-start!important}.of-payment-label,#priceBox .promo-label{font-size:.72rem!important}}
  `;
  document.head.appendChild(style);

  /* Fichas: precio promo -> original tachado -> texto de forma de pago. */
  if(detailPriceBox){
    const arrangeDetailPrice=()=>{
      const label=detailPriceBox.querySelector('.promo-label');
      const price=detailPriceBox.querySelector('.price');
      const old=detailPriceBox.querySelector('.old');
      if(!label||!price)return;
      if(old){
        if(price.nextElementSibling!==old)price.insertAdjacentElement('afterend',old);
        if(old.nextElementSibling!==label)old.insertAdjacentElement('afterend',label);
      }else if(price.nextElementSibling!==label){
        price.insertAdjacentElement('afterend',label);
      }
    };
    new MutationObserver(()=>requestAnimationFrame(arrangeDetailPrice)).observe(detailPriceBox,{childList:true,subtree:true});
    arrangeDetailPrice();
  }

  if(!productGrid&&!comboGrid)return;
  let products=[],combos=[];
  const [pr,cr]=await Promise.allSettled([
    db.from('products').select('id,name,brand,price,promo_price,promo_label,stock,free_shipping,visible').eq('visible',true),
    db.from('combos').select('id,name,price,promo_price,promo_label,stock,free_shipping,visible').eq('visible',true)
  ]);
  if(pr.status==='fulfilled'&&!pr.value.error)products=pr.value.data||[];
  if(cr.status==='fulfilled'&&!cr.value.error)combos=cr.value.data||[];
  const productById=new Map(products.map(p=>[String(p.id),p]));
  const comboById=new Map(combos.map(c=>[String(c.id),c]));
  const hasPromo=item=>item?.promo_price!=null&&Number(item.promo_price)>0&&(item.price==null||Number(item.promo_price)<Number(item.price));

  function findProduct(card){
    const byId=productById.get(String(card.dataset.productId||''));if(byId)return byId;
    const name=card.querySelector('h3')?.textContent?.trim()||'';
    const brand=[...card.querySelectorAll('.tags .tag')].map(x=>x.textContent?.trim()||'').find(x=>x&&!/^Stock\s*:|^Sin stock$/i.test(x))||'';
    const candidates=products.filter(p=>p.name===name);return candidates.find(p=>(p.brand||'')===brand)||candidates[0]||null;
  }
  function findCombo(card){
    const byId=comboById.get(String(card.dataset.comboId||''));if(byId)return byId;
    const name=card.querySelector('h3')?.textContent?.trim()||'';return combos.find(c=>c.name===name)||null;
  }
  function hideLegacyStock(card){card.querySelectorAll('.tags .tag').forEach(tag=>{if(/^Stock\s*:|^Sin stock$/i.test(tag.textContent.trim()))tag.style.display='none';});}
  function paintStatus(card,item,artSelector){
    if(!item)return;hideLegacyStock(card);const art=card.querySelector(artSelector);if(!art)return;
    let overlay=art.querySelector(':scope > .of-status-overlay');if(!overlay){overlay=document.createElement('div');overlay.className='of-status-overlay';art.appendChild(overlay);}
    const badges=[];if(item.free_shipping)badges.push('<span class="shipping">Envío gratis</span>');if(Number(item.stock)<=0)badges.push('<span class="out">Sin stock</span>');
    overlay.innerHTML=badges.join('');overlay.style.display=badges.length?'flex':'none';
  }
  function paymentLabel(card,item,type){
    if(!item)return;let label=card.querySelector('.of-payment-label');
    if(!hasPromo(item)||!item.promo_label){label?.remove();return;}
    if(type==='product'){
      const price=card.querySelector('.price');if(!price)return;
      let stack=price.closest('.of-price-stack');if(!stack){stack=document.createElement('div');stack.className='of-price-stack';price.replaceWith(stack);stack.appendChild(price);}
      const old=stack.querySelector('.of-old-price');
      if(!label){label=document.createElement('div');label.className='of-payment-label';}
      label.textContent=item.promo_label;
      if(old){if(old.nextElementSibling!==label)old.insertAdjacentElement('afterend',label);}else if(price.nextElementSibling!==label)price.insertAdjacentElement('afterend',label);
    }else{
      const price=card.querySelector('.combo-price');if(!price)return;
      const stack=price.parentElement;stack.classList.add('of-combo-payment-stack');
      const old=stack.querySelector('.combo-old-price,.of-old-price');
      if(!label){label=document.createElement('div');label.className='of-payment-label';}
      label.textContent=item.promo_label;
      if(old){if(old.nextElementSibling!==label)old.insertAdjacentElement('afterend',label);}else if(price.nextElementSibling!==label)price.insertAdjacentElement('afterend',label);
    }
  }
  function decorate(){
    productGrid?.querySelectorAll('.product-card-link').forEach(card=>{const item=findProduct(card);paintStatus(card,item,'.art');paymentLabel(card,item,'product');});
    comboGrid?.querySelectorAll('.combo-card').forEach(card=>{const item=findCombo(card);paintStatus(card,item,'.combo-art');paymentLabel(card,item,'combo');});
  }
  let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate();});};
  if(productGrid)new MutationObserver(schedule).observe(productGrid,{childList:true,subtree:true});
  if(comboGrid)new MutationObserver(schedule).observe(comboGrid,{childList:true,subtree:true});
  decorate();
});

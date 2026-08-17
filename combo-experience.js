/* Origen Fit · ficha, stock y acciones de combos en la portada */
document.addEventListener('DOMContentLoaded',async()=>{
  const grid=document.getElementById('comboGrid');
  if(!grid||typeof db==='undefined')return;
  let combos=[];
  try{const {data,error}=await db.from('combos').select('id,name,price,promo_price,promo_label,stock,image_url,free_shipping,visible').eq('visible',true);if(error)throw error;combos=data||[];}catch(err){console.warn('Combos Origen Fit:',err?.message||err);return;}
  const isPromo=c=>c.promo_price!=null&&Number(c.promo_price)>0&&(c.price==null||Number(c.promo_price)<Number(c.price));
  const identify=card=>{const name=card.querySelector('h3')?.textContent?.trim()||'';return combos.find(c=>c.name===name)||null;};
  const decorate=()=>{
    grid.querySelectorAll('.combo-card').forEach(card=>{
      const c=identify(card);if(!c)return;
      card.href=`combo.html?id=${encodeURIComponent(c.id)}`;card.target='_blank';card.rel='noopener';card.dataset.comboId=c.id;card.setAttribute('aria-label',`Ver combo ${c.name}`);
      card.querySelector('.combo-desc')?.remove();
      const price=card.querySelector('.combo-price');
      if(price&&isPromo(c)&&c.promo_label&&!card.querySelector('.of-combo-promo-label')){
        const label=document.createElement('div');label.className='of-combo-promo-label';label.textContent=c.promo_label;(price.closest('.combo-price-row')||price).insertAdjacentElement('afterend',label);
      }
      if(!card.querySelector('.of-card-flags')){
        const flags=document.createElement('div');flags.className='of-card-flags';flags.innerHTML=`<span class="of-stock-badge ${Number(c.stock)<=0?'out':''}">${Number(c.stock)>0?`Stock: ${c.stock}`:'SIN STOCK'}</span>${c.free_shipping?'<span class="of-free-shipping">Envío gratis</span>':''}`;
        const wa=card.querySelector('.combo-wa');(wa||card.querySelector('.combo-body'))?.insertAdjacentElement('beforebegin',flags);
      }
      const wa=card.querySelector('.combo-wa');if(wa)wa.innerHTML='<span>Ver combo</span><span>→</span>';
      if(!card.querySelector('.of-combo-add-cart')){
        const btn=document.createElement('button');btn.type='button';btn.className='of-add-cart of-combo-add-cart';btn.disabled=Number(c.stock)<=0;btn.textContent=Number(c.stock)>0?'Agregar al carrito':'Sin stock';btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();window.ORIGENFIT_CART?.addCombo(c.id);});(wa||card.querySelector('.combo-body'))?.insertAdjacentElement('beforebegin',btn);
      }
    });
  };
  const style=document.createElement('style');style.textContent=`.combos-grid .combo-card .combo-desc{display:none!important}.of-combo-promo-label{font-size:.72rem;line-height:1.2;color:#777;font-weight:850;margin:6px 0 0;text-align:right}.combo-card .of-card-flags{margin:14px 0 0}.combo-card .of-add-cart{background:var(--red,#e30613)}@media(max-width:650px){.of-combo-promo-label{text-align:left}}`;document.head.appendChild(style);
  new MutationObserver(()=>requestAnimationFrame(decorate)).observe(grid,{childList:true,subtree:true});decorate();
});

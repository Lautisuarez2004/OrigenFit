/* Origen Fit · ficha, stock y acciones de combos en la portada */
document.addEventListener('DOMContentLoaded',async()=>{
  const grid=document.getElementById('comboGrid');
  if(!grid||typeof db==='undefined')return;
  let combos=[];
  try{
    const {data,error}=await db.from('combos').select('id,name,price,promo_price,promo_label,stock,image_url,free_shipping,flavors_enabled,flavors,flavor_product_label,visible').eq('visible',true);
    if(error)throw error;combos=data||[];
  }catch(err){console.warn('Combos Origen Fit:',err?.message||err);return;}

  const isPromo=c=>c.promo_price!=null&&Number(c.promo_price)>0&&(c.price==null||Number(c.promo_price)<Number(c.price));
  const hasFlavors=c=>!!c?.flavors_enabled&&Array.isArray(c?.flavors)&&c.flavors.some(x=>String(x||'').trim())&&String(c?.flavor_product_label||'').trim();
  const identify=card=>{const byId=combos.find(c=>String(c.id)===String(card.dataset.comboId||''));if(byId)return byId;const name=card.querySelector('h3')?.textContent?.trim()||'';return combos.find(c=>c.name===name)||null;};

  const style=document.createElement('style');
  style.textContent=`
    .combos-grid .combo-card{height:100%!important;display:flex!important;flex-direction:column!important}
    .combos-grid .combo-card .combo-body{display:flex!important;flex-direction:column!important;flex:1 1 auto!important;min-height:0!important}
    .combos-grid .combo-card .combo-desc{display:none!important}
    .combos-grid .combo-card .combo-price-row{min-height:82px!important;align-items:flex-start!important}
    .combos-grid .combo-card .of-combo-add-cart,.combos-grid .combo-card .of-add-cart{margin-top:auto!important}
    .combos-grid .combo-card .combo-wa{margin-top:10px!important}
    .of-combo-promo-label{display:none!important}

    /* CTA estable: cualquier combo con stock siempre se ve como Agregar al carrito. */
    .combos-grid .combo-card .of-combo-add-cart:not(:disabled),
    .combos-grid .combo-card .of-add-cart:not(:disabled){position:relative!important;color:transparent!important}
    .combos-grid .combo-card .of-combo-add-cart:not(:disabled)::after,
    .combos-grid .combo-card .of-add-cart:not(:disabled)::after{
      content:"Agregar al carrito";position:absolute;inset:0;display:grid;place-items:center;
      color:#fff;font:inherit;font-weight:950;pointer-events:none;
    }

    @media(max-width:650px){.combos-grid .combo-card .combo-price-row{min-height:76px!important}}
  `;document.head.appendChild(style);

  const decorate=()=>{
    grid.querySelectorAll('.combo-card').forEach(card=>{
      const c=identify(card);if(!c)return;
      card.href=`combo.html?id=${encodeURIComponent(c.id)}`;card.target='_blank';card.rel='noopener';card.dataset.comboId=c.id;card.setAttribute('aria-label',`Ver combo ${c.name}`);
      card.querySelector('.combo-desc')?.remove();

      const price=card.querySelector('.combo-price');
      if(price&&isPromo(c)&&c.promo_label&&!card.querySelector('.of-combo-promo-label')){
        const label=document.createElement('div');label.className='of-combo-promo-label';label.textContent=c.promo_label;(price.closest('.combo-price-row')||price).insertAdjacentElement('afterend',label);
      }
      const wa=card.querySelector('.combo-wa');if(wa)wa.innerHTML='<span>Ver combo</span><span>→</span>';

      let btn=card.querySelector('.of-combo-add-cart');
      if(!btn){
        const existing=card.querySelector('.of-add-cart');
        if(existing){btn=existing;btn.classList.add('of-combo-add-cart');}
        else{btn=document.createElement('button');btn.type='button';btn.className='of-add-cart of-combo-add-cart';(wa||card.querySelector('.combo-body'))?.insertAdjacentElement('beforebegin',btn);}
      }
      btn.disabled=Number(c.stock)<=0;
      btn.textContent=Number(c.stock)>0?'Agregar al carrito':'Sin stock';
      btn.setAttribute('aria-label',Number(c.stock)<=0?'Sin stock':hasFlavors(c)?'Agregar al carrito y elegir sabor':'Agregar al carrito');
      btn.onclick=e=>{
        e.preventDefault();e.stopPropagation();if(Number(c.stock)<=0)return;
        if(hasFlavors(c)){
          const picker=window.ORIGENFIT_FLAVOR_CART;
          if(picker?.choose){
            picker.choose({type:'combo',id:String(c.id),name:c.name,flavors:c.flavors,flavorLabel:c.flavor_product_label||'Sabor'});
          }else{
            window.open(card.href,'_blank','noopener');
          }
          return;
        }
        const cart=window.ORIGENFIT_CART;if(cart?.addCombo)cart.addCombo(String(c.id),'');
      };
    });
  };
  let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate();});};
  new MutationObserver(schedule).observe(grid,{childList:true,subtree:true});decorate();setTimeout(decorate,900);
});

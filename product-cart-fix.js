/* Origen Fit · garantiza ficha individual + Agregar al carrito en cada tarjeta de Producto */
document.addEventListener('DOMContentLoaded',async()=>{
  const grid=document.getElementById('grid');
  if(!grid)return;
  const client=window.db||(typeof db!=='undefined'?db:null);
  if(!client)return;

  let products=[];
  try{
    const {data,error}=await client.from('products')
      .select('id,name,brand,stock,visible')
      .eq('visible',true);
    if(error)throw error;
    products=data||[];
  }catch(err){
    console.warn('Ficha/carrito productos:',err?.message||err);
    return;
  }

  const identify=card=>{
    const direct=products.find(p=>String(p.id)===String(card.dataset.productId||''));
    if(direct)return direct;
    const name=card.querySelector('h3')?.textContent?.trim()||'';
    const brand=[...card.querySelectorAll('.tags .tag')]
      .map(x=>x.textContent?.trim()||'')
      .find(x=>x&&!/^Stock\s*:|^Sin stock$/i.test(x))||'';
    const candidates=products.filter(p=>p.name===name);
    return candidates.find(p=>(p.brand||'')===brand)||candidates[0]||null;
  };

  const decorate=()=>{
    grid.querySelectorAll('.product-card-link').forEach(card=>{
      const p=identify(card);if(!p)return;
      card.dataset.productId=p.id;

      /* Igual que Combos: toda la tarjeta abre la ficha individual en otra pestaña. */
      card.href=`producto.html?id=${encodeURIComponent(p.id)}`;
      card.target='_blank';
      card.rel='noopener';
      card.setAttribute('aria-label',`Ver ${p.name}`);

      const wa=card.querySelector('.product-wa');
      if(wa)wa.innerHTML='<span>Ver producto</span><span>→</span>';

      let btn=card.querySelector('.of-product-add-cart');
      if(!btn){
        const existing=card.querySelector('.of-add-cart');
        if(existing){
          btn=existing;
          btn.classList.add('of-product-add-cart');
        }else{
          btn=document.createElement('button');
          btn.type='button';
          btn.className='of-add-cart of-product-add-cart';
          const target=card.querySelector('.product-wa');
          if(target)target.insertAdjacentElement('beforebegin',btn);
          else card.querySelector('.body-card')?.appendChild(btn);
        }
      }

      btn.disabled=Number(p.stock)<=0;
      btn.textContent=Number(p.stock)>0?'Agregar al carrito':'Sin stock';
      if(btn.dataset.cartBound==='1')return;
      btn.dataset.cartBound='1';
      btn.addEventListener('click',e=>{
        e.preventDefault();
        e.stopPropagation();
        if(Number(p.stock)<=0)return;
        const cart=window.ORIGENFIT_CART;
        if(cart?.addProduct)cart.addProduct(p.id);
        else if(cart?.add)cart.add(p.id);
      });
    });
  };

  const style=document.createElement('style');
  style.textContent=`
    .product-card-link .of-product-add-cart{
      display:block!important;width:100%!important;border:0!important;border-radius:999px!important;
      padding:11px 14px!important;background:#111!important;color:#fff!important;
      font-weight:950!important;margin-top:12px!important;cursor:pointer!important;
    }
    .product-card-link .of-product-add-cart:disabled{
      background:#d9d9dd!important;color:#777!important;cursor:not-allowed!important;
    }
  `;
  document.head.appendChild(style);

  /* Reaplica navegación y carrito cuando búsqueda/categoría/paginación redibujan el grid. */
  let queued=false;
  const schedule=()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;decorate();});
  };
  new MutationObserver(schedule).observe(grid,{childList:true,subtree:true});
  decorate();
  setTimeout(decorate,900);
});

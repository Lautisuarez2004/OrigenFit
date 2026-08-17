/* Origen Fit · tarjetas de producto uniformes + Más vendido como overlay */
document.addEventListener('DOMContentLoaded',async()=>{
  const grid=document.getElementById('grid');
  if(!grid)return;
  const client=window.db||(typeof db!=='undefined'?db:null);
  if(!client)return;

  let products=[];
  try{
    const {data,error}=await client.from('products')
      .select('id,name,brand,stock,featured,flavors_enabled,flavors,visible')
      .eq('visible',true);
    if(error)throw error;
    products=data||[];
  }catch(err){
    console.warn('Uniformidad de tarjetas:',err?.message||err);
    return;
  }

  const hasFlavors=p=>!!p?.flavors_enabled&&Array.isArray(p?.flavors)&&p.flavors.some(x=>String(x||'').trim());
  const identify=card=>{
    const byId=products.find(p=>String(p.id)===String(card.dataset.productId||''));
    if(byId)return byId;
    const name=card.querySelector('h3')?.textContent?.trim()||'';
    const brand=[...card.querySelectorAll('.tags .tag')]
      .map(x=>x.textContent?.trim()||'')
      .find(x=>x&&!/^Stock\s*:|^Sin stock$/i.test(x))||'';
    const candidates=products.filter(p=>p.name===name);
    return candidates.find(p=>(p.brand||'')===brand)||candidates[0]||null;
  };

  const style=document.createElement('style');
  style.textContent=`
    /* Más vendido deja de ocupar una fila del cuerpo. */
    .products .product-card-link .feat{display:none!important}
    .products .product-card-link .art{position:relative!important}
    .products .product-card-link .of-featured-badge{
      position:absolute;left:12px;bottom:12px;z-index:8;
      display:inline-flex;align-items:center;min-height:27px;padding:6px 10px;
      border-radius:5px;background:var(--red,#e30613);color:#fff;
      font-size:.72rem;line-height:1;font-weight:950;letter-spacing:.025em;
      text-transform:uppercase;box-shadow:0 2px 8px rgba(0,0,0,.12);pointer-events:none;
    }

    /* Todas las tarjetas conservan la misma estructura aunque cambien promos, badges o nombres. */
    .products #grid .product-card-link{
      height:100%!important;display:flex!important;flex-direction:column!important;
    }
    .products #grid .product-card-link .body-card{
      display:flex!important;flex-direction:column!important;flex:1 1 auto!important;min-height:0!important;
    }
    .products #grid .product-card-link .desc{display:none!important}
    .products #grid .product-card-link .row{min-height:82px!important;align-items:flex-start!important}
    .products #grid .product-card-link .tags{min-height:34px!important;align-content:flex-start!important}
    .products #grid .product-card-link .of-product-add-cart,
    .products #grid .product-card-link .of-add-cart{margin-top:auto!important}
    .products #grid .product-card-link .product-wa{margin-top:10px!important}

    @media(max-width:650px){
      .products .product-card-link .of-featured-badge{left:9px;bottom:9px;min-height:24px;padding:5px 8px;font-size:.64rem;border-radius:4px}
      .products #grid .product-card-link .row{min-height:76px!important}
    }
  `;
  document.head.appendChild(style);

  function decorate(){
    grid.querySelectorAll('.product-card-link').forEach(card=>{
      const p=identify(card);if(!p)return;
      card.dataset.productId=p.id;
      card.href=`producto.html?id=${encodeURIComponent(p.id)}`;
      card.target='_blank';card.rel='noopener';
      card.querySelector('.desc')?.remove();

      /* Badge Más vendido sobre la imagen, abajo a la izquierda. */
      card.querySelector('.feat')?.setAttribute('aria-hidden','true');
      const art=card.querySelector('.art');
      if(art){
        let badge=art.querySelector(':scope > .of-featured-badge');
        if(p.featured){
          if(!badge){badge=document.createElement('span');badge.className='of-featured-badge';art.appendChild(badge);}
          badge.textContent='Más vendido';
        }else badge?.remove();
      }

      /* En portada el CTA siempre conserva el mismo texto. Si hay sabores, abre la ficha para elegirlos. */
      const btn=card.querySelector('.of-product-add-cart,.of-add-cart');
      if(btn){
        btn.disabled=Number(p.stock)<=0;
        btn.textContent=Number(p.stock)<=0?'Sin stock':'Agregar al carrito';
        btn.onclick=e=>{
          e.preventDefault();e.stopPropagation();
          if(Number(p.stock)<=0)return;
          if(hasFlavors(p)){
            window.open(`producto.html?id=${encodeURIComponent(p.id)}`,'_blank','noopener');
            return;
          }
          const cart=window.ORIGENFIT_CART;
          if(cart?.addProduct)cart.addProduct(String(p.id),'');
          else if(cart?.add)cart.add(String(p.id),'');
        };
      }
    });
  }

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

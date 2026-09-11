/* Origen Fit · carruseles táctiles unificados.
 * Swipe/drag nativo primero, flechas como apoyo y scroll-snap estable.
 * Reemplaza la lógica vieja de ocultar/mostrar tarjetas por tandas.
 */
document.addEventListener('DOMContentLoaded',()=>{
  const style=document.createElement('style');
  style.id='of-touch-carousels-style';
  style.textContent=`
    .of-carousel-arrow,.promo-arrow,.promo-dot{touch-action:manipulation!important;-webkit-user-select:none!important;user-select:none!important;-webkit-touch-callout:none!important;-webkit-tap-highlight-color:transparent!important}
    #grid>.product-card-link.of-carousel-hidden{display:flex!important}
    #categoriesGrid>.category-card.of-carousel-hidden{display:grid!important}
    #comboGrid>.combo-card.of-carousel-hidden,#comboGrid>.combo-card.of-combo-hidden{display:flex!important}
    .of-carousel-shell,.of-touch-shell{position:relative!important;padding:0 44px!important}
    .of-carousel-shell .of-carousel-arrow,.of-touch-shell .of-carousel-arrow{position:absolute!important;top:50%!important;transform:translateY(-50%)!important;z-index:20!important;width:36px!important;height:48px!important;border:0!important;border-radius:12px!important;display:grid!important;place-items:center!important;background:rgba(255,255,255,.96)!important;color:#111!important;box-shadow:0 6px 18px rgba(0,0,0,.14)!important;font-size:1.8rem!important;font-weight:900!important;cursor:pointer!important}
    .of-carousel-shell .of-carousel-arrow.prev,.of-touch-shell .of-carousel-arrow.prev{left:0!important}.of-carousel-shell .of-carousel-arrow.next,.of-touch-shell .of-carousel-arrow.next{right:0!important}
    .of-carousel-shell .of-carousel-arrow:disabled,.of-touch-shell .of-carousel-arrow:disabled{opacity:.2!important;cursor:default!important}
    #grid.of-touch-track,#comboGrid.of-touch-track{display:flex!important;grid-template-columns:none!important;gap:16px!important;overflow-x:auto!important;overflow-y:hidden!important;scroll-snap-type:x mandatory!important;scroll-behavior:smooth!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;scrollbar-width:none!important;padding:4px 2px 18px!important}
    #grid.of-touch-track::-webkit-scrollbar,#comboGrid.of-touch-track::-webkit-scrollbar,#categoriesGrid.of-touch-track::-webkit-scrollbar,#promoTrack.of-touch-track::-webkit-scrollbar{display:none!important}
    #grid.of-touch-track>.product-card-link,#comboGrid.of-touch-track>.combo-card{flex:0 0 calc((100% - 32px)/3)!important;min-width:0!important;width:auto!important;scroll-snap-align:start!important;scroll-snap-stop:normal!important}
    #categoriesGrid.of-touch-track{display:flex!important;grid-template-columns:none!important;gap:14px!important;overflow-x:auto!important;overflow-y:hidden!important;scroll-snap-type:x proximity!important;scroll-behavior:smooth!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;scrollbar-width:none!important;padding:4px 2px 12px!important}
    #categoriesGrid.of-touch-track>.category-card{flex:0 0 calc((100% - 28px)/3)!important;min-width:0!important;width:auto!important;scroll-snap-align:start!important}
    #comboGrid .combo-card{position:relative!important}
    #comboGrid .of-combo-highlight{position:static!important;display:flex!important;width:100%!important;min-height:34px!important;align-items:center!important;justify-content:center!important;margin:0!important;padding:8px 10px!important;border:0!important;border-radius:0!important;background:var(--red,#e30613)!important;color:#fff!important;box-shadow:none!important;font-size:.72rem!important;line-height:1!important;font-weight:950!important;letter-spacing:.05em!important;text-transform:uppercase!important;pointer-events:none!important}
    #comboGrid .of-combo-highlight::before{content:'★';margin-right:6px}
    #promoTrack.of-touch-track{display:flex!important;overflow-x:auto!important;overflow-y:hidden!important;scroll-snap-type:x mandatory!important;scroll-behavior:smooth!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;scrollbar-width:none!important}
    #promoTrack.of-touch-track>.promo-slide{display:block!important;flex:0 0 100%!important;width:100%!important;min-width:100%!important;scroll-snap-align:start!important;scroll-snap-stop:always!important}
    .hero .hero-logo-wrap{display:none!important}.hero .hero-grid{grid-template-columns:1fr!important}
    @media(max-width:900px){#grid.of-touch-track>.product-card-link,#comboGrid.of-touch-track>.combo-card{flex-basis:calc((100% - 14px)/2)!important}.of-carousel-shell,.of-touch-shell{padding:0 38px!important}}
    @media(max-width:650px){
      .of-carousel-shell,.of-touch-shell{padding:0!important}
      #grid.of-touch-track,#comboGrid.of-touch-track{gap:10px!important;padding:4px 18px 16px!important;scroll-padding-inline:18px!important}
      #grid.of-touch-track>.product-card-link,#comboGrid.of-touch-track>.combo-card{flex:0 0 72%!important;max-width:300px!important}
      #categoriesGrid.of-touch-track{gap:10px!important;padding:4px 18px 10px!important;scroll-padding-inline:18px!important}
      #categoriesGrid.of-touch-track>.category-card{flex:0 0 31%!important;min-width:104px!important}
      #comboGrid.of-touch-track .combo-card{border-radius:20px!important}
      #comboGrid.of-touch-track .combo-art{height:240px!important;padding:14px!important}
      #comboGrid.of-touch-track .combo-body{padding:18px!important}
      #comboGrid.of-touch-track .combo-price-row{display:flex!important;min-height:76px!important}
      #comboGrid.of-touch-track .combo-price-row h3{font-size:1.12rem!important;line-height:1.08!important;min-height:0!important;display:block!important;overflow:visible!important}
      #comboGrid.of-touch-track .combo-price{font-size:1.05rem!important;white-space:nowrap!important}
      #comboGrid.of-touch-track .combo-old-price{font-size:.76rem!important}
      #comboGrid.of-touch-track .tags{display:flex!important}
      #comboGrid.of-touch-track .of-combo-add-cart,#comboGrid.of-touch-track .of-add-cart{min-height:44px!important;padding:10px 12px!important;font-size:.92rem!important;margin-top:auto!important}
      #comboGrid .of-combo-highlight{min-height:30px!important;padding:7px 8px!important;font-size:.66rem!important}
      .of-carousel-shell .of-carousel-arrow,.of-touch-shell .of-carousel-arrow{width:34px!important;height:44px!important;border-radius:0!important;background:rgba(17,17,17,.68)!important;color:#fff!important;box-shadow:none!important;font-size:1.8rem!important}
      .of-carousel-shell .of-carousel-arrow.prev,.of-touch-shell .of-carousel-arrow.prev{left:2px!important}.of-carousel-shell .of-carousel-arrow.next,.of-touch-shell .of-carousel-arrow.next{right:2px!important}
    }
  `;
  document.head.appendChild(style);

  document.addEventListener('dblclick',e=>{if(e.target.closest?.('.of-carousel-arrow,.promo-arrow,.promo-dot'))e.preventDefault();},{passive:false});

  function ensureShell(track,kind){
    if(!track)return null;
    let shell=track.closest('.of-carousel-shell,.of-touch-shell');
    if(!shell){shell=document.createElement('div');shell.className=`of-touch-shell of-${kind}-carousel`;track.parentNode.insertBefore(shell,track);shell.appendChild(track);}
    let prev=shell.querySelector(':scope > .of-carousel-arrow.prev');let next=shell.querySelector(':scope > .of-carousel-arrow.next');
    if(!prev){prev=document.createElement('button');prev.type='button';prev.className='of-carousel-arrow prev';prev.innerHTML='‹';shell.insertBefore(prev,track);}
    if(!next){next=document.createElement('button');next.type='button';next.className='of-carousel-arrow next';next.innerHTML='›';shell.appendChild(next);}
    prev.setAttribute('aria-label',`${kind} anteriores`);next.setAttribute('aria-label',`${kind} siguientes`);return{shell,prev,next};
  }

  function wireNativeCarousel(track,selector,kind){
    if(!track)return;track.classList.add('of-touch-track');const ui=ensureShell(track,kind);if(!ui)return;
    const children=()=>[...track.querySelectorAll(`:scope > ${selector}`)];
    const step=()=>{const list=children();if(!list.length)return Math.max(220,track.clientWidth*.75);if(list.length===1)return list[0].getBoundingClientRect().width;return Math.abs(list[1].offsetLeft-list[0].offsetLeft)||list[0].getBoundingClientRect().width;};
    const updateArrows=()=>{const max=Math.max(0,track.scrollWidth-track.clientWidth);ui.prev.disabled=track.scrollLeft<=3;ui.next.disabled=track.scrollLeft>=max-3;};
    ui.prev.onclick=e=>{e.preventDefault();e.stopPropagation();track.scrollBy({left:-step(),behavior:'smooth'});};
    ui.next.onclick=e=>{e.preventDefault();e.stopPropagation();track.scrollBy({left:step(),behavior:'smooth'});};
    let raf=0;track.addEventListener('scroll',()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(updateArrows);},{passive:true});
    new MutationObserver(()=>requestAnimationFrame(updateArrows)).observe(track,{childList:true});window.addEventListener('resize',()=>requestAnimationFrame(updateArrows));requestAnimationFrame(updateArrows);
  }

  const productGrid=document.getElementById('grid');let requestSerial=0;
  const renderAllProducts=(items,total)=>{
    if(!productGrid)return;const loading=document.getElementById('loading');const errorBox=document.getElementById('error');const pagination=document.getElementById('pagination');const meta=document.getElementById('resultsMeta');
    currentPage=1;totalProducts=Number(total||0);totalPages=1;if(pagination){pagination.innerHTML='';pagination.classList.add('hidden');}
    if(!items.length){productGrid.innerHTML='<div class="no-results">No encontramos productos con esos filtros.</div>';productGrid.classList.remove('hidden');meta?.classList.add('hidden');syncCategorySelection();loading?.classList.add('hidden');return;}
    productGrid.innerHTML=items.map(p=>{const promo=p.promo_price!=null&&Number(p.promo_price)>0&&(p.price==null||Number(p.promo_price)<Number(p.price));const finalPrice=promo?p.promo_price:p.price;const waUrl=productWhatsappUrl(p,finalPrice);const art=p.image_url?`<img src="${esc(p.image_url)}" alt="${esc(p.name)}">`:`<div class="jar"><span>${esc((p.brand||'Origen Fit').toUpperCase())}<br>${esc((p.category||'Suplemento').toUpperCase())}</span></div>`;return `<a class="card product-card-link" href="${esc(waUrl)}" target="_blank" rel="noopener" aria-label="Consultar ${esc(p.name)} por WhatsApp"><div class="art">${art}</div><div class="body-card">${p.featured?'<span class="feat">Más vendido</span>':''}<div class="row"><h3>${esc(p.name)}</h3><div class="price">${money(finalPrice)}</div></div><p class="desc">${esc(p.description||'')}</p><div class="tags">${p.brand?`<span class="tag">${esc(p.brand)}</span>`:''}<span class="tag">${p.stock>0?'Stock: '+p.stock:'Sin stock'}</span></div><div class="product-wa"><span>Consultar por WhatsApp</span><span>→</span></div></div></a>`;}).join('');
    productGrid.classList.remove('hidden');errorBox?.classList.add('hidden');syncCategorySelection();if(meta){meta.textContent=`${totalProducts} productos`;meta.classList.remove('hidden');}productGrid.scrollLeft=0;
  };

  async function loadTouchProducts(){
    if(!productGrid)return;const serial=++requestSerial;const loading=document.getElementById('loading');const errorBox=document.getElementById('error');const pagination=document.getElementById('pagination');const meta=document.getElementById('resultsMeta');if(loading){loading.textContent='Cargando productos…';loading.classList.remove('hidden');}errorBox?.classList.add('hidden');
    const category=activeCategory||null,search=activeSearch||null,pageSize=100;let page=1,total=0,all=[];
    try{while(true){const{data,error}=await withTimeout(db.rpc('get_products_page',{p_page:page,p_page_size:pageSize,p_category:category,p_search:search}));if(serial!==requestSerial)return;if(error)throw error;const payload=(data&&typeof data==='object')?data:{};total=Number(payload.total_count||0);const items=Array.isArray(payload.items)?payload.items:[];all.push(...items);if(all.length>=total||items.length<pageSize)break;if(++page>50)throw new Error('El catálogo excedió el límite de carga.');}if(serial!==requestSerial)return;renderAllProducts(all,total);}
    catch(err){if(serial!==requestSerial)return;console.error('Error cargando productos:',err);productGrid.innerHTML='';productGrid.classList.add('hidden');pagination?.classList.add('hidden');meta?.classList.add('hidden');if(errorBox){errorBox.innerHTML='No se pudo cargar el catálogo. <b>'+esc(err?.message||String(err))+'</b><br><button id="retryProducts" class="btn btn-light" style="margin-top:12px">Reintentar</button>';errorBox.classList.remove('hidden');setTimeout(()=>document.getElementById('retryProducts')?.addEventListener('click',loadTouchProducts,{once:true}),0);}}
    finally{if(serial===requestSerial)loading?.classList.add('hidden');}
  }

  if(productGrid){try{loadProducts=loadTouchProducts;}catch(_){}wireNativeCarousel(productGrid,'.product-card-link','Productos');const waitInitial=()=>{const loading=document.getElementById('loading');if(!loading||loading.classList.contains('hidden'))loadTouchProducts();else setTimeout(waitInitial,60);};requestAnimationFrame(waitInitial);}

  const categoryGrid=document.getElementById('categoriesGrid');if(categoryGrid)wireNativeCarousel(categoryGrid,'.category-card','Categorías');

  const comboGrid=document.getElementById('comboGrid');
  if(comboGrid){wireNativeCarousel(comboGrid,'.combo-card','Combos');const decorateCombos=()=>{comboGrid.querySelectorAll(':scope > .combo-card').forEach(card=>{if(card.querySelector(':scope > .of-combo-highlight'))return;const badge=document.createElement('div');badge.className='of-combo-highlight';badge.textContent='Combo especial';card.insertBefore(badge,card.firstChild);});};let comboRaf=0;new MutationObserver(()=>{cancelAnimationFrame(comboRaf);comboRaf=requestAnimationFrame(decorateCombos);}).observe(comboGrid,{childList:true});decorateCombos();setTimeout(decorateCombos,400);setTimeout(decorateCombos,1000);}

  const promoTrack=document.getElementById('promoTrack');const promoPrev=document.getElementById('promoPrev');const promoNext=document.getElementById('promoNext');const promoDots=document.getElementById('promoDots');
  if(promoTrack){promoTrack.classList.add('of-touch-track');const slides=()=>[...promoTrack.querySelectorAll(':scope > .promo-slide')];const currentIndex=()=>{const width=promoTrack.clientWidth||1;return Math.max(0,Math.min(slides().length-1,Math.round(promoTrack.scrollLeft/width)));};const go=index=>{const list=slides();if(!list.length)return;const i=(index+list.length)%list.length;promoTrack.scrollTo({left:i*promoTrack.clientWidth,behavior:'smooth'});};if(promoPrev)promoPrev.onclick=e=>{e.preventDefault();go(currentIndex()-1);};if(promoNext)promoNext.onclick=e=>{e.preventDefault();go(currentIndex()+1);};const wireDots=()=>promoDots?.querySelectorAll('.promo-dot').forEach(dot=>{dot.onclick=e=>{e.preventDefault();e.stopPropagation();go(Number(dot.dataset.i||0));};});const syncDots=()=>{const idx=currentIndex();promoDots?.querySelectorAll('.promo-dot').forEach((dot,i)=>dot.classList.toggle('active',i===idx));};let promoRaf=0;promoTrack.addEventListener('scroll',()=>{cancelAnimationFrame(promoRaf);promoRaf=requestAnimationFrame(syncDots);},{passive:true});new MutationObserver(()=>requestAnimationFrame(()=>{wireDots();syncDots();})).observe(promoTrack,{childList:true});setTimeout(()=>{wireDots();syncDots();},300);}
});
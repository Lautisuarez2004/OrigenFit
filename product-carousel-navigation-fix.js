/* Origen Fit · navegación estable del carrusel de productos.
 * - El catálogo filtrado se carga completo para evitar saltos al cambiar de página remota.
 * - Cada toque de flecha desplaza exactamente una posición.
 * - Las flechas usan touch-action: manipulation para que el doble toque no haga zoom.
 */
document.addEventListener('DOMContentLoaded',()=>{
  const grid=document.getElementById('grid');
  if(!grid) return;

  const arrowSelector='.of-carousel-arrow,.promo-arrow,.page-btn';

  const style=document.createElement('style');
  style.id='of-carousel-touch-fix';
  style.textContent=`
    ${arrowSelector}{
      touch-action:manipulation!important;
      -webkit-user-select:none!important;
      user-select:none!important;
      -webkit-touch-callout:none!important;
      -webkit-tap-highlight-color:transparent!important;
    }
  `;
  document.head.appendChild(style);

  document.addEventListener('dblclick',e=>{
    if(e.target.closest?.(arrowSelector)) e.preventDefault();
  },{passive:false});

  const slots=()=>{
    if(window.matchMedia('(max-width:650px)').matches) return 1;
    if(window.matchMedia('(max-width:900px)').matches) return 2;
    return 3;
  };

  const cards=()=>[...grid.querySelectorAll('.product-card-link')];

  const currentStart=()=>{
    const list=cards();
    const i=list.findIndex(card=>!card.classList.contains('of-carousel-hidden'));
    return i<0?0:i;
  };

  const render=(requestedStart)=>{
    const shell=grid.closest('.of-product-carousel');
    if(!shell) return;
    const prev=shell.querySelector('.of-carousel-arrow.prev');
    const next=shell.querySelector('.of-carousel-arrow.next');
    const list=cards();
    const visible=slots();
    const maxStart=Math.max(0,list.length-visible);
    const start=Math.max(0,Math.min(requestedStart,maxStart));

    list.forEach((card,i)=>{
      card.classList.toggle('of-carousel-hidden',i<start||i>=start+visible);
    });

    if(prev) prev.disabled=start<=0;
    if(next) next.disabled=start>=maxStart;

    const meta=document.getElementById('resultsMeta');
    if(meta&&list.length){
      const total=Number(totalProducts||list.length);
      const first=start+1;
      const last=Math.min(start+visible,total,list.length);
      meta.textContent=`Mostrando ${first}–${last} de ${total} productos`;
      meta.classList.remove('hidden');
    }
  };

  const wire=()=>{
    const shell=grid.closest('.of-product-carousel');
    if(!shell) return false;
    const prev=shell.querySelector('.of-carousel-arrow.prev');
    const next=shell.querySelector('.of-carousel-arrow.next');
    if(!prev||!next) return false;

    prev.onclick=()=>{
      const start=currentStart();
      if(start>0) render(start-1);
    };

    next.onclick=()=>{
      const list=cards();
      const start=currentStart();
      const maxStart=Math.max(0,list.length-slots());
      if(start<maxStart) render(start+1);
    };

    return true;
  };

  let requestSerial=0;

  const renderCatalog=(items,total)=>{
    const loading=document.getElementById('loading');
    const errorBox=document.getElementById('error');
    const pagination=document.getElementById('pagination');
    const meta=document.getElementById('resultsMeta');

    currentPage=1;
    totalProducts=Number(total||0);
    totalPages=1;

    if(pagination){
      pagination.innerHTML='';
      pagination.classList.add('hidden');
    }

    if(!items.length){
      grid.innerHTML='<div class="no-results">No encontramos productos con esos filtros.</div>';
      grid.classList.remove('hidden');
      if(meta) meta.classList.add('hidden');
      syncCategorySelection();
      if(loading) loading.classList.add('hidden');
      return;
    }

    grid.innerHTML=items.map(p=>{
      const promo=p.promo_price!=null&&Number(p.promo_price)>0&&(p.price==null||Number(p.promo_price)<Number(p.price));
      const finalPrice=promo?p.promo_price:p.price;
      const waUrl=productWhatsappUrl(p,finalPrice);
      const art=p.image_url
        ?`<img src="${esc(p.image_url)}" alt="${esc(p.name)}">`
        :`<div class="jar"><span>${esc((p.brand||'Origen Fit').toUpperCase())}<br>${esc((p.category||'Suplemento').toUpperCase())}</span></div>`;

      return `
        <a class="card product-card-link" href="${esc(waUrl)}" target="_blank" rel="noopener" aria-label="Consultar ${esc(p.name)} por WhatsApp">
          <div class="art">${art}</div>
          <div class="body-card">
            ${p.featured?'<span class="feat">Más vendido</span>':''}
            <div class="row">
              <h3>${esc(p.name)}</h3>
              <div class="price">${money(finalPrice)}</div>
            </div>
            <p class="desc">${esc(p.description||'')}</p>
            <div class="tags">
              ${p.brand?`<span class="tag">${esc(p.brand)}</span>`:''}
              <span class="tag">${p.stock>0?'Stock: '+p.stock:'Sin stock'}</span>
            </div>
            <div class="product-wa">
              <span>Consultar por WhatsApp</span>
              <span>→</span>
            </div>
          </div>
        </a>
      `;
    }).join('');

    grid.classList.remove('hidden');
    if(errorBox) errorBox.classList.add('hidden');
    syncCategorySelection();

    requestAnimationFrame(()=>{
      wire();
      render(0);
    });
  };

  async function loadStableProducts(){
    const serial=++requestSerial;
    const loading=document.getElementById('loading');
    const errorBox=document.getElementById('error');
    const pagination=document.getElementById('pagination');
    const meta=document.getElementById('resultsMeta');

    if(loading){
      loading.textContent='Cargando productos…';
      loading.classList.remove('hidden');
    }
    if(errorBox) errorBox.classList.add('hidden');

    const category=activeCategory||null;
    const search=activeSearch||null;
    const pageSize=100;
    let page=1;
    let total=0;
    let all=[];

    try{
      while(true){
        const {data,error}=await withTimeout(
          db.rpc('get_products_page',{
            p_page:page,
            p_page_size:pageSize,
            p_category:category,
            p_search:search
          })
        );

        if(serial!==requestSerial) return;
        if(error) throw error;

        const payload=(data&&typeof data==='object')?data:{};
        total=Number(payload.total_count||0);
        const items=Array.isArray(payload.items)?payload.items:[];
        all.push(...items);

        if(all.length>=total||items.length<pageSize) break;
        page+=1;
        if(page>50) throw new Error('El catálogo excedió el límite de carga del carrusel.');
      }

      if(serial!==requestSerial) return;
      renderCatalog(all,total);
    }catch(err){
      if(serial!==requestSerial) return;
      console.error('Error cargando productos:',err);
      grid.innerHTML='';
      grid.classList.add('hidden');
      if(pagination) pagination.classList.add('hidden');
      if(meta) meta.classList.add('hidden');

      if(errorBox){
        const message=err?.message||String(err);
        errorBox.innerHTML=
          'No se pudo cargar el catálogo. <b>'+esc(message)+'</b>'+
          '<br><button id="retryProducts" class="btn btn-light" style="margin-top:12px">Reintentar</button>';
        errorBox.classList.remove('hidden');
        setTimeout(()=>{
          const retry=document.getElementById('retryProducts');
          if(retry) retry.onclick=()=>loadStableProducts();
        },0);
      }
    }finally{
      if(serial===requestSerial&&loading) loading.classList.add('hidden');
    }
  }

  const installStableLoader=()=>{
    try{
      loadProducts=loadStableProducts;
      loadStableProducts();
    }catch(err){
      console.warn('Carrusel estable de productos:',err);
    }
  };

  const waitForInitialLoad=()=>{
    const loading=document.getElementById('loading');
    if(!loading||loading.classList.contains('hidden')){
      installStableLoader();
      return;
    }
    setTimeout(waitForInitialLoad,50);
  };

  requestAnimationFrame(()=>{
    wire();
    waitForInitialLoad();
  });

  window.addEventListener('resize',()=>{
    requestAnimationFrame(()=>render(currentStart()));
  });
});

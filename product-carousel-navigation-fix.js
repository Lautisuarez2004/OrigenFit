/* Origen Fit · navegación del carrusel de productos.
 * Corrige el salto por bloque de config-core: cada toque avanza/retrocede 1 producto.
 * Conserva la cantidad visible por breakpoint y la paginación remota existente.
 */
document.addEventListener('DOMContentLoaded',()=>{
  const grid=document.getElementById('grid');
  if(!grid) return;

  const slots=()=>{
    if(window.matchMedia('(max-width:650px)').matches) return 1;
    if(window.matchMedia('(max-width:900px)').matches) return 2;
    return 3;
  };

  const cards=()=>[...grid.querySelectorAll('.product-card-link')];

  const pageState=()=>{
    let page=1,pages=1,total=cards().length,pageSize=6;
    try{
      page=currentPage;
      pages=totalPages;
      total=totalProducts;
      pageSize=PRODUCTS_PER_PAGE;
    }catch(_){ }
    return {page,pages,total,pageSize};
  };

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

    const {page,pages,total,pageSize}=pageState();
    if(prev) prev.disabled=(page<=1&&start<=0);
    if(next) next.disabled=(page>=pages&&start>=maxStart);

    const meta=document.getElementById('resultsMeta');
    if(meta&&list.length&&total>0){
      const first=(page-1)*pageSize+start+1;
      const last=Math.min(first+visible-1,total,(page-1)*pageSize+list.length);
      meta.textContent=`Mostrando ${first}–${last} de ${total} productos`;
      meta.classList.remove('hidden');
    }
  };

  let busy=false;

  const wire=()=>{
    const shell=grid.closest('.of-product-carousel');
    if(!shell) return false;
    const prev=shell.querySelector('.of-carousel-arrow.prev');
    const next=shell.querySelector('.of-carousel-arrow.next');
    if(!prev||!next) return false;

    prev.onclick=async()=>{
      if(busy) return;
      const start=currentStart();
      if(start>0){
        render(start-1);
        return;
      }

      const {page}=pageState();
      if(page<=1) return;
      try{
        busy=true;
        await goToProductPage(page-1);
        setTimeout(()=>{
          const maxStart=Math.max(0,cards().length-slots());
          render(maxStart);
        },30);
      }catch(err){
        console.warn('Carrusel de productos:',err);
      }finally{
        setTimeout(()=>{busy=false;},40);
      }
    };

    next.onclick=async()=>{
      if(busy) return;
      const list=cards();
      const start=currentStart();
      const maxStart=Math.max(0,list.length-slots());
      if(start<maxStart){
        render(start+1);
        return;
      }

      const {page,pages}=pageState();
      if(page>=pages) return;
      try{
        busy=true;
        await goToProductPage(page+1);
        setTimeout(()=>render(0),30);
      }catch(err){
        console.warn('Carrusel de productos:',err);
      }finally{
        setTimeout(()=>{busy=false;},40);
      }
    };

    return true;
  };

  requestAnimationFrame(()=>{
    if(!wire()) setTimeout(wire,0);
  });
});

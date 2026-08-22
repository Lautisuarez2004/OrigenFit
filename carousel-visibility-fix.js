/*
 * Corrección de prioridad CSS para los carruseles.
 * En móvil, Categorías usa 3 miniaturas visibles, fondo blanco y proporciones uniformes.
 * No modifica Promos, Productos ni Combos.
 */
document.addEventListener('DOMContentLoaded',()=>{
  const grid=document.getElementById('categoriesGrid');

  const style=document.createElement('style');
  style.textContent=`
    .products .product-card-link.of-carousel-hidden{display:none!important}
    #categorias .categories-grid .category-card.of-carousel-hidden{display:none!important}

    /* Neutraliza el estilo "foto a sangre" anterior únicamente en Categorías. */
    #categorias .categories-grid .category-card.has-category-image{
      background:#fff!important;
      aspect-ratio:auto!important;
    }
    #categorias .categories-grid .category-card.has-category-image .category-art{
      background:#fff!important;
      border-radius:14px!important;
    }
    #categorias .categories-grid .category-card.has-category-image .category-art img{
      object-fit:contain!important;
      object-position:center!important;
    }
    #categorias .categories-grid .category-card.has-category-image .category-name{
      display:grid!important;
    }

    /* Desktop/tablet: tarjetas contenidas y parejas. */
    #categorias .categories-grid .category-card:not(.of-carousel-hidden){
      display:grid!important;
      grid-template-rows:132px 40px!important;
      align-items:center!important;
      padding:12px 14px!important;
      background:#fff!important;
    }
    #categorias .categories-grid .category-card .category-art{
      width:100%!important;
      height:132px!important;
      min-height:132px!important;
      max-height:132px!important;
      margin:0!important;
      padding:18px!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      overflow:hidden!important;
      background:#fff!important;
      border-radius:14px!important;
    }
    #categorias .categories-grid .category-card .category-art img{
      display:block!important;
      width:auto!important;
      height:auto!important;
      max-width:112px!important;
      max-height:98px!important;
      object-fit:contain!important;
      object-position:center!important;
      margin:auto!important;
    }
    #categorias .categories-grid .category-card .category-name{
      min-height:40px!important;
      display:grid!important;
      place-items:center!important;
      padding-top:6px!important;
      line-height:1.15!important;
      text-align:center!important;
    }

    @media(max-width:650px){
      /* Referencia: tres categorías visibles, sin cards oscuras ni marcos pesados. */
      #categorias .of-category-carousel{
        padding:0 34px!important;
      }
      #categorias .categories-grid.of-category-grid{
        display:grid!important;
        grid-template-columns:repeat(3,minmax(0,1fr))!important;
        gap:8px!important;
        overflow:visible!important;
        padding:0!important;
      }
      #categorias .categories-grid .category-card:not(.of-carousel-hidden),
      #categorias .categories-grid .category-card.has-category-image:not(.of-carousel-hidden){
        display:grid!important;
        grid-template-rows:82px 34px!important;
        min-width:0!important;
        width:auto!important;
        padding:0 2px!important;
        border:0!important;
        border-radius:0!important;
        background:transparent!important;
        box-shadow:none!important;
        overflow:visible!important;
        aspect-ratio:auto!important;
      }
      #categorias .categories-grid .category-card:hover{
        transform:none!important;
        box-shadow:none!important;
      }
      #categorias .categories-grid .category-card.active{
        border:0!important;
        box-shadow:none!important;
      }
      #categorias .categories-grid .category-card .category-art,
      #categorias .categories-grid .category-card.has-category-image .category-art{
        width:100%!important;
        height:82px!important;
        min-height:82px!important;
        max-height:82px!important;
        margin:0!important;
        padding:5px!important;
        border:0!important;
        border-radius:0!important;
        background:#fff!important;
        overflow:hidden!important;
      }
      #categorias .categories-grid .category-card .category-art img,
      #categorias .categories-grid .category-card.has-category-image .category-art img{
        width:auto!important;
        height:auto!important;
        max-width:68px!important;
        max-height:72px!important;
        object-fit:contain!important;
        object-position:center!important;
        margin:auto!important;
      }
      #categorias .categories-grid .category-card .category-name,
      #categorias .categories-grid .category-card.has-category-image .category-name{
        min-height:34px!important;
        height:34px!important;
        display:flex!important;
        align-items:flex-start!important;
        justify-content:center!important;
        padding:4px 1px 0!important;
        color:#111!important;
        font-size:.82rem!important;
        font-weight:650!important;
        line-height:1.05!important;
        text-align:center!important;
        overflow:hidden!important;
      }
      #categorias .categories-grid .category-card.active .category-name{
        color:var(--red,#e30613)!important;
        font-weight:850!important;
      }
      #categorias .of-category-carousel .of-carousel-arrow{
        width:30px!important;
        height:44px!important;
        border-radius:0!important;
        background:transparent!important;
        color:#111!important;
        box-shadow:none!important;
        font-size:2rem!important;
      }
      #categorias .of-category-carousel .of-carousel-arrow.prev{left:0!important}
      #categorias .of-category-carousel .of-carousel-arrow.next{right:0!important}
      #categorias .of-category-carousel .of-carousel-arrow:disabled{opacity:.22!important}
    }
  `;
  document.head.appendChild(style);

  if(!grid)return;

  /*
   * config-core usa 1 slot en móvil para todos los carruseles.
   * Categorías necesita 3; sobreescribimos sólo su ventana y sus flechas.
   */
  let offset=0;
  const cards=()=>[...grid.querySelectorAll('.category-card')];
  const slots=()=>window.matchMedia('(max-width:650px)').matches?3:(window.matchMedia('(max-width:900px)').matches?2:3);

  const render=()=>{
    const list=cards();
    const visible=slots();
    const maxStart=Math.max(0,list.length-visible);
    offset=Math.max(0,Math.min(offset,maxStart));
    list.forEach((card,i)=>card.classList.toggle('of-carousel-hidden',i<offset||i>=offset+visible));

    const shell=grid.closest('.of-category-carousel');
    const prev=shell?.querySelector('.of-carousel-arrow.prev');
    const next=shell?.querySelector('.of-carousel-arrow.next');
    if(prev)prev.disabled=offset<=0;
    if(next)next.disabled=offset>=maxStart;
  };

  const wire=()=>{
    const shell=grid.closest('.of-category-carousel');
    const prev=shell?.querySelector('.of-carousel-arrow.prev');
    const next=shell?.querySelector('.of-carousel-arrow.next');
    if(!prev||!next)return false;
    prev.onclick=()=>{offset=Math.max(0,offset-1);render();};
    next.onclick=()=>{offset=Math.min(Math.max(0,cards().length-slots()),offset+1);render();};
    render();
    return true;
  };

  requestAnimationFrame(()=>{
    if(!wire())setTimeout(wire,0);
  });

  new MutationObserver(()=>requestAnimationFrame(()=>{offset=0;wire();}))
    .observe(grid,{childList:true});

  window.addEventListener('resize',()=>{offset=0;requestAnimationFrame(wire);});
});

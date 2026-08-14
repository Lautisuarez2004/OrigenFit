window.ORIGENFIT_CONFIG={
  supabaseUrl:"https://bxnvquawhukqsmeqlfwa.supabase.co",
  supabaseKey:"sb_publishable_htQd5YCWT6cGgzicfKg-Ww_QsSin_Xz"
};

/*
 * Búsqueda global:
 * - Al escribir una búsqueda, se quita cualquier categoría activa para buscar
 *   en todo el catálogo.
 * - Al elegir una categoría, se limpia la búsqueda para volver al filtrado
 *   exclusivo por categoría.
 */
document.addEventListener('DOMContentLoaded',()=>{
  const searchInput=document.getElementById('productSearch');
  const searchButton=document.getElementById('searchBtn');
  if(!searchInput) return;

  const enableGlobalSearch=()=>{
    if(!searchInput.value.trim()) return;
    try{
      activeCategory='';
      syncCategorySelection();
    }catch(err){
      console.warn('No se pudo limpiar la categoría para la búsqueda global:',err);
    }
  };

  // Capture asegura que la categoría se limpie antes de ejecutar la búsqueda existente.
  searchInput.addEventListener('input',enableGlobalSearch,true);
  searchInput.addEventListener('keydown',e=>{
    if(e.key==='Enter') enableGlobalSearch();
  },true);
  if(searchButton){
    searchButton.addEventListener('click',enableGlobalSearch,true);
  }

  // Si el usuario vuelve a elegir una categoría, la búsqueda deja de aplicarse.
  document.addEventListener('click',e=>{
    const categoryButton=e.target.closest?.('.category-card, .drawer-category');
    if(!categoryButton) return;
    searchInput.value='';
    try{
      activeSearch='';
    }catch(err){
      console.warn('No se pudo limpiar la búsqueda al elegir categoría:',err);
    }
  },true);
});

/*
 * Carruseles manuales de productos y categorías.
 * Desktop: 3 tarjetas visibles. Tablet: 2. Móvil: 1.
 * No hay autoplay: el desplazamiento se hace exclusivamente con las flechas.
 */
document.addEventListener('DOMContentLoaded',()=>{
  const style=document.createElement('style');
  style.textContent=`
    .of-carousel-shell{position:relative;padding:0 58px}
    .of-carousel-arrow{
      position:absolute;top:50%;transform:translateY(-50%);z-index:8;
      width:46px;height:46px;border:0;border-radius:50%;
      display:grid;place-items:center;font-size:1.55rem;font-weight:950;
      box-shadow:0 10px 22px rgba(0,0,0,.18);cursor:pointer;
      transition:transform .16s ease,opacity .16s ease;
    }
    .of-carousel-arrow:hover:not(:disabled){transform:translateY(-50%) scale(1.06)}
    .of-carousel-arrow:disabled{opacity:.28;cursor:not-allowed}
    .of-carousel-arrow.prev{left:0}.of-carousel-arrow.next{right:0}
    .categories-section .of-carousel-arrow{background:#111;color:#fff}
    .products-section .of-carousel-arrow{background:#fff;color:#e30613}
    .of-carousel-hidden{display:none!important}
    #pagination{display:none!important}
    .categories-grid.of-category-grid{
      display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;
      gap:20px!important;overflow:visible!important;padding-bottom:0!important;
    }
    .categories-grid.of-category-grid .category-card{
      min-width:0!important;width:auto!important;scroll-snap-align:unset!important;
    }
    @media(max-width:900px){
      .categories-grid.of-category-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
    }
    @media(max-width:650px){
      .of-carousel-shell{padding:0 48px}
      .of-carousel-arrow{width:40px;height:40px}
      .categories-grid.of-category-grid{grid-template-columns:1fr!important}
    }
  `;
  document.head.appendChild(style);

  function visibleSlots(){
    if(window.matchMedia('(max-width:650px)').matches) return 1;
    if(window.matchMedia('(max-width:900px)').matches) return 2;
    return 3;
  }

  function makeShell(grid,kind){
    if(!grid || grid.dataset.ofCarouselReady==='1') return null;
    grid.dataset.ofCarouselReady='1';

    const shell=document.createElement('div');
    shell.className='of-carousel-shell of-'+kind+'-carousel';
    const prev=document.createElement('button');
    prev.type='button';
    prev.className='of-carousel-arrow prev';
    prev.innerHTML='‹';
    prev.setAttribute('aria-label',kind==='product'?'Productos anteriores':'Categorías anteriores');
    const next=document.createElement('button');
    next.type='button';
    next.className='of-carousel-arrow next';
    next.innerHTML='›';
    next.setAttribute('aria-label',kind==='product'?'Productos siguientes':'Categorías siguientes');

    grid.parentNode.insertBefore(shell,grid);
    shell.appendChild(prev);
    shell.appendChild(grid);
    shell.appendChild(next);
    return {shell,prev,next};
  }

  /* CATEGORÍAS */
  const categoryGrid=document.getElementById('categoriesGrid');
  const categoryUI=makeShell(categoryGrid,'category');
  let categoryOffset=0;

  function categoryCards(){
    return categoryGrid ? [...categoryGrid.querySelectorAll('.category-card')] : [];
  }

  function renderCategoryCarousel(){
    if(!categoryGrid || !categoryUI) return;
    categoryGrid.classList.add('of-category-grid');
    const cards=categoryCards();
    const slots=visibleSlots();
    const maxStart=Math.max(0,cards.length-slots);
    categoryOffset=Math.min(categoryOffset,maxStart);

    cards.forEach((card,i)=>{
      card.classList.toggle('of-carousel-hidden',i<categoryOffset || i>=categoryOffset+slots);
    });

    categoryUI.prev.disabled=categoryOffset<=0;
    categoryUI.next.disabled=categoryOffset>=maxStart;
    categoryUI.shell.style.display=cards.length?'block':'none';
  }

  if(categoryUI){
    categoryUI.prev.onclick=()=>{
      categoryOffset=Math.max(0,categoryOffset-1);
      renderCategoryCarousel();
    };
    categoryUI.next.onclick=()=>{
      const cards=categoryCards();
      categoryOffset=Math.min(Math.max(0,cards.length-visibleSlots()),categoryOffset+1);
      renderCategoryCarousel();
    };

    const categoryObserver=new MutationObserver(()=>{
      categoryOffset=0;
      requestAnimationFrame(renderCategoryCarousel);
    });
    categoryObserver.observe(categoryGrid,{childList:true});
    renderCategoryCarousel();
  }

  /* PRODUCTOS */
  const productGrid=document.getElementById('grid');
  const productUI=makeShell(productGrid,'product');
  let productOffset=0;
  let productMutationTimer=null;

  function productCards(){
    return productGrid ? [...productGrid.querySelectorAll('.product-card-link')] : [];
  }

  function renderProductCarousel(){
    if(!productGrid || !productUI) return;
    const cards=productCards();
    const slots=visibleSlots();
    const maxLocalStart=Math.max(0,cards.length-slots);
    productOffset=Math.min(productOffset,maxLocalStart);

    cards.forEach((card,i)=>{
      card.classList.toggle('of-carousel-hidden',i<productOffset || i>=productOffset+slots);
    });

    let page=1,pages=1,total=cards.length,pageSize=6;
    try{
      page=currentPage;
      pages=totalPages;
      total=totalProducts;
      pageSize=PRODUCTS_PER_PAGE;
    }catch(_){/* todavía cargando */}

    productUI.prev.disabled=(page<=1 && productOffset<=0);
    productUI.next.disabled=(page>=pages && productOffset>=maxLocalStart);
    productUI.shell.style.display=(cards.length || productGrid.querySelector('.no-results'))?'block':'none';

    const meta=document.getElementById('resultsMeta');
    if(meta && cards.length && total>0){
      const first=(page-1)*pageSize+productOffset+1;
      const last=Math.min(first+slots-1,total,(page-1)*pageSize+cards.length);
      meta.textContent=`Mostrando ${first}–${last} de ${total} productos`;
      meta.classList.remove('hidden');
    }
  }

  async function previousProducts(){
    const cards=productCards();
    const slots=visibleSlots();
    if(productOffset>0){
      productOffset=Math.max(0,productOffset-slots);
      renderProductCarousel();
      return;
    }

    try{
      if(currentPage>1){
        await goToProductPage(currentPage-1);
        const refreshed=productCards();
        productOffset=Math.max(0,refreshed.length-slots);
        renderProductCarousel();
      }
    }catch(err){
      console.warn('Carrusel de productos:',err);
    }
  }

  async function nextProducts(){
    const cards=productCards();
    const slots=visibleSlots();
    const maxLocalStart=Math.max(0,cards.length-slots);

    if(productOffset<maxLocalStart){
      productOffset=Math.min(maxLocalStart,productOffset+slots);
      renderProductCarousel();
      return;
    }

    try{
      if(currentPage<totalPages){
        productOffset=0;
        await goToProductPage(currentPage+1);
        renderProductCarousel();
      }
    }catch(err){
      console.warn('Carrusel de productos:',err);
    }
  }

  if(productUI){
    productUI.prev.onclick=previousProducts;
    productUI.next.onclick=nextProducts;

    const productObserver=new MutationObserver(()=>{
      clearTimeout(productMutationTimer);
      productMutationTimer=setTimeout(()=>{
        productOffset=0;
        renderProductCarousel();
      },0);
    });
    productObserver.observe(productGrid,{childList:true});
    renderProductCarousel();
  }

  window.addEventListener('resize',()=>{
    categoryOffset=0;
    productOffset=0;
    renderCategoryCarousel();
    renderProductCarousel();
  });
});

/* Ajuste visual del ícono de WhatsApp del header. */
document.addEventListener('DOMContentLoaded',()=>{
  const whatsappLink=document.querySelector('.shop-header .icon-btn[aria-label="WhatsApp"]');
  if(!whatsappLink) return;

  // El PNG original es pequeño y contiene negro/blanco dentro de la propia imagen.
  // Se reemplaza en pantalla por un SVG vectorial limpio para que no se recorte ni pierda definición.
  whatsappLink.innerHTML=`
    <svg class="whatsapp-vector" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M16 4.2a11.2 11.2 0 0 0-9.7 16.8L4.8 27.8l6.9-1.5A11.2 11.2 0 1 0 16 4.2Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M11.4 10.3c.5-.5 1.1-.5 1.5 0l1.35 2.05c.22.36.2.8-.08 1.1l-.9 1.02c.88 1.9 2.4 3.42 4.32 4.32l1.02-.92c.32-.28.76-.3 1.12-.07l2.02 1.32c.5.32.62.9.36 1.43-.48.98-1.65 1.8-2.92 1.8-5.05 0-9.15-4.1-9.15-9.15 0-1.2.5-2.2 1.36-2.9Z" fill="currentColor"/>
    </svg>`;

  const style=document.createElement('style');
  style.textContent=`
    .shop-header .icon-btn[aria-label="WhatsApp"]{
      overflow:visible;
      color:#fff;
    }
    .shop-header .whatsapp-vector{
      width:32px;
      height:32px;
      display:block;
      overflow:visible;
      flex:none;
    }
  `;
  document.head.appendChild(style);
});

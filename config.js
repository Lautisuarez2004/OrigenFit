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

  searchInput.addEventListener('input',enableGlobalSearch,true);
  searchInput.addEventListener('keydown',e=>{
    if(e.key==='Enter') enableGlobalSearch();
  },true);
  if(searchButton){
    searchButton.addEventListener('click',enableGlobalSearch,true);
  }

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
    }catch(_){ }

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

  whatsappLink.innerHTML=`
    <svg class="whatsapp-vector" viewBox="0 0 16 16" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="M13.601 2.326A7.854 7.854 0 0 0 8.002 0C3.58 0 0 3.582 0 8.003a7.95 7.95 0 0 0 1.078 4.004L0 16l4.102-1.055a7.93 7.93 0 0 0 3.9 1.02h.003c4.42 0 8.002-3.582 8.002-8.003a7.95 7.95 0 0 0-2.406-5.636zM8.005 14.66h-.002a6.63 6.63 0 0 1-3.379-.925l-.242-.145-2.435.626.65-2.375-.158-.245a6.64 6.64 0 0 1-1.026-3.557c0-3.673 2.987-6.66 6.659-6.66 1.778 0 3.447.692 4.703 1.948a6.61 6.61 0 0 1 1.95 4.708c-.002 3.673-2.99 6.66-6.72 6.66zm3.652-4.988c-.2-.1-1.183-.584-1.367-.65-.183-.067-.317-.1-.45.1-.133.2-.517.65-.633.784-.117.133-.233.15-.433.05-.2-.1-.844-.311-1.607-.992-.593-.529-.993-1.183-1.11-1.383-.116-.2-.012-.308.088-.408.09-.09.2-.233.3-.35.1-.116.133-.2.2-.333.067-.133.034-.25-.017-.35-.05-.1-.45-1.084-.616-1.484-.162-.39-.327-.337-.45-.343l-.383-.007c-.133 0-.35.05-.533.25-.183.2-.7.684-.7 1.667 0 .984.717 1.934.817 2.067.1.133 1.41 2.154 3.417 3.02.477.206.85.329 1.141.421.479.152.915.131 1.26.08.384-.057 1.183-.484 1.35-.95.167-.467.167-.867.117-.95-.05-.083-.183-.133-.383-.233z"/>
    </svg>`;

  const style=document.createElement('style');
  style.textContent=`
    .shop-header .icon-btn[aria-label="WhatsApp"]{
      overflow:visible;
      color:#fff;
    }
    .shop-header .whatsapp-vector{
      width:34px;
      height:34px;
      display:block;
      flex:none;
    }
    @media(max-width:650px){
      .shop-header .whatsapp-vector{width:31px;height:31px}
    }
  `;
  document.head.appendChild(style);
});

/* Tarjetas de producto uniformes: mantiene alineados textos, fotos y CTA aunque cambie el contenido. */
document.addEventListener('DOMContentLoaded',()=>{
  const style=document.createElement('style');
  style.textContent=`
    .products .product-card-link{
      display:flex!important;
      flex-direction:column;
      height:100%;
    }
    .products .product-card-link .art{
      flex:0 0 290px;
      height:290px;
      display:flex;
      align-items:center;
      justify-content:center;
    }
    .products .product-card-link .art img{
      width:100%;
      height:100%;
      max-width:86%;
      max-height:86%;
      object-fit:contain;
      object-position:center;
    }
    .products .product-card-link .body-card{
      display:flex;
      flex-direction:column;
      flex:1 1 auto;
      min-height:0;
    }
    .products .product-card-link .row{
      min-height:58px;
    }
    .products .product-card-link .row h3{
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-line-clamp:2;
      overflow:hidden;
    }
    .products .product-card-link .desc{
      min-height:3.9em;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-line-clamp:3;
      overflow:hidden;
    }
    .products .product-card-link .tags{
      min-height:34px;
      align-content:flex-start;
    }
    .products .product-card-link .product-wa{
      margin-top:auto!important;
    }
    @media(max-width:650px){
      .products .product-card-link .row{min-height:auto}
      .products .product-card-link .desc{min-height:auto}
      .products .product-card-link .tags{min-height:auto}
    }
  `;
  document.head.appendChild(style);
});

/* Categorías con imagen: foto a sangre completa, sin marco blanco ni título repetido. */
document.addEventListener('DOMContentLoaded',()=>{
  const grid=document.getElementById('categoriesGrid');
  if(!grid) return;

  const style=document.createElement('style');
  style.textContent=`
    .categories-grid .category-card.has-category-image{
      padding:0!important;
      overflow:hidden!important;
      aspect-ratio:1.45/1;
      background:#111!important;
    }
    .categories-grid .category-card.has-category-image .category-art{
      width:100%!important;
      height:100%!important;
      min-height:0!important;
      margin:0!important;
      padding:0!important;
      border-radius:0!important;
      background:#111!important;
      overflow:hidden!important;
    }
    .categories-grid .category-card.has-category-image .category-art img{
      width:100%!important;
      height:100%!important;
      max-width:none!important;
      max-height:none!important;
      display:block!important;
      object-fit:cover!important;
      object-position:center!important;
    }
    .categories-grid .category-card.has-category-image .category-name{
      display:none!important;
    }
  `;
  document.head.appendChild(style);

  const markImageCards=()=>{
    grid.querySelectorAll('.category-card').forEach(card=>{
      const hasImage=!!card.querySelector('.category-art img');
      card.classList.toggle('has-category-image',hasImage);
    });
  };

  const observer=new MutationObserver(()=>requestAnimationFrame(markImageCards));
  observer.observe(grid,{childList:true,subtree:true});
  markImageCards();
});

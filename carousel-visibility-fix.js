/*
 * Corrección de prioridad CSS para los carruseles.
 * Mantiene ocultas las tarjetas fuera de la ventana y normaliza únicamente
 * las miniaturas de Categorías, sin tocar Promos, Productos ni Combos.
 */
document.addEventListener('DOMContentLoaded',()=>{
  const style=document.createElement('style');
  style.textContent=`
    .products .product-card-link.of-carousel-hidden{
      display:none!important;
    }
    #categorias .categories-grid .category-card.of-carousel-hidden{
      display:none!important;
    }

    /* Categorías: marco uniforme y foto contenida. */
    #categorias .categories-grid .category-card:not(.of-carousel-hidden){
      display:grid!important;
      grid-template-rows:132px 40px!important;
      align-items:center!important;
      padding:12px 14px!important;
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
      #categorias .categories-grid .category-card:not(.of-carousel-hidden){
        grid-template-rows:112px 38px!important;
        padding:10px 12px!important;
      }
      #categorias .categories-grid .category-card .category-art{
        height:112px!important;
        min-height:112px!important;
        max-height:112px!important;
        padding:16px!important;
      }
      #categorias .categories-grid .category-card .category-art img{
        max-width:88px!important;
        max-height:82px!important;
      }
      #categorias .categories-grid .category-card .category-name{
        min-height:38px!important;
        font-size:.94rem!important;
      }
    }
  `;
  document.head.appendChild(style);
});

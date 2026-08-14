/*
 * Corrección de prioridad CSS para los carruseles.
 * Las tarjetas de producto usan display:flex!important para mantener su contenido alineado.
 * Esta regla, más específica, garantiza que las tarjetas fuera de la ventana del carrusel
 * sigan realmente ocultas.
 */
document.addEventListener('DOMContentLoaded',()=>{
  const style=document.createElement('style');
  style.textContent=`
    .products .product-card-link.of-carousel-hidden{
      display:none!important;
    }
    .categories-grid .category-card.of-carousel-hidden{
      display:none!important;
    }
  `;
  document.head.appendChild(style);
});

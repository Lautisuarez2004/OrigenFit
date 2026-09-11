/* Origen Fit · orden comercial de secciones.
 * Mueve secciones completas; nunca separa el grid de Productos de su contenedor.
 * Flujo: Hero → Combos → Categorías → Productos → Marcas → Promos → cierre.
 */
document.addEventListener('DOMContentLoaded',()=>{
  const style=document.createElement('style');
  style.id='of-section-order-style';
  style.textContent=`
    /* Productos vuelve a la estructura blanca original: fichas directas, sin cabecera roja. */
    #productos.products-section{background:#fff!important;padding:0 0 74px!important}
    #productos .section-head,#productos #pagination,#productos #resultsMeta{display:none!important}
    #productos>.c{padding-top:0!important}
    #productos .of-product-carousel{margin-top:0!important}
    #productos #loading{color:#555!important;background:#f7f7f8!important;border:1px solid #e7e7e9!important}
    @media(max-width:650px){#productos.products-section{padding:0 0 54px!important}}
  `;
  document.head.appendChild(style);

  const reorder=()=>{
    const hero=document.querySelector('.hero');
    const combos=document.getElementById('combos');
    const categories=document.getElementById('categorias');
    const productsSection=document.getElementById('productos');
    const brands=document.getElementById('marcas');
    const promos=document.getElementById('promos');

    if(!hero||!combos||!categories||!productsSection)return;

    /* Se mueven contenedores completos para preservar carrusel, anclas y filtros. */
    hero.after(combos);
    combos.after(categories);
    categories.after(productsSection);

    let tail=productsSection;
    if(brands){tail.after(brands);tail=brands;}
    if(promos){tail.after(promos);tail=promos;}
  };

  requestAnimationFrame(reorder);
  setTimeout(reorder,150);
  setTimeout(reorder,650);
});

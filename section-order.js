/* Origen Fit · orden comercial de secciones.
 * Mantiene intactos diseño y contenido; sólo cambia la posición en la home.
 * Flujo principal: Hero → Combos → Categorías → Productos → Marcas/Promos → Suplementación.
 */
document.addEventListener('DOMContentLoaded',()=>{
  const reorder=()=>{
    const hero=document.querySelector('.hero');
    const combos=document.querySelector('.combos-section');
    const categories=document.querySelector('.categories-section');
    const products=document.querySelector('.products');
    const brands=document.getElementById('marcas');
    const promos=document.querySelector('.promos');
    const footer=document.querySelector('footer');

    const supplementHeading=[...document.querySelectorAll('h2,h3')].find(el=>/suplement/i.test(el.textContent||''));
    const supplement=supplementHeading?.closest('section');

    if(!hero||!combos||!categories||!products)return;

    /* Recorrido de venta pedido: propuesta → oferta → exploración → catálogo. */
    hero.after(combos);
    combos.after(categories);
    categories.after(products);

    /* Elementos secundarios quedan después del catálogo, sin cortar el recorrido principal. */
    let tail=products;
    if(brands&&brands!==supplement){tail.after(brands);tail=brands;}
    if(promos&&promos!==supplement){tail.after(promos);tail=promos;}

    /* La sección educativa queda última antes del footer. */
    if(supplement){
      if(footer)footer.before(supplement);
      else tail.after(supplement);
    }
  };

  requestAnimationFrame(reorder);
  setTimeout(reorder,150);
  setTimeout(reorder,650);
});

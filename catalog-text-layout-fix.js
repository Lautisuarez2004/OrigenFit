/* Origen Fit · corrección final de títulos y textos promo en tarjetas */
document.addEventListener('DOMContentLoaded',()=>{
  const style=document.createElement('style');
  style.textContent=`
    /* Título y precio comparten espacio sin pisarse. */
    .products #grid .product-card-link .row,
    .combos-grid .combo-card .combo-price-row{
      display:grid!important;
      grid-template-columns:minmax(0,1fr) minmax(105px,46%)!important;
      column-gap:10px!important;
      align-items:start!important;
      min-width:0!important;
      overflow:visible!important;
    }

    /* Nombres un poco más chicos y con aire para letras como g, p, y. */
    .products #grid .product-card-link .row h3,
    .combos-grid .combo-card .combo-price-row h3{
      min-width:0!important;
      width:auto!important;
      max-width:100%!important;
      height:auto!important;
      max-height:none!important;
      margin:0!important;
      padding:0 0 4px!important;
      font-size:1.08rem!important;
      line-height:1.28!important;
      letter-spacing:-.02em!important;
      white-space:normal!important;
      overflow:visible!important;
      text-overflow:clip!important;
      overflow-wrap:anywhere!important;
      word-break:normal!important;
    }

    /* El bloque de precio ya no fuerza un ancho gigante. */
    .of-price-stack,
    .of-combo-payment-stack{
      min-width:0!important;
      width:100%!important;
      max-width:100%!important;
      overflow:visible!important;
      align-items:flex-end!important;
    }

    /* Textos tipo "Efectivo/transferencia $20000" pueden usar dos líneas. */
    .of-payment-label{
      display:block!important;
      width:100%!important;
      max-width:100%!important;
      min-width:0!important;
      margin-top:4px!important;
      font-size:.74rem!important;
      line-height:1.22!important;
      white-space:normal!important;
      overflow:visible!important;
      text-overflow:clip!important;
      overflow-wrap:anywhere!important;
      word-break:break-word!important;
      text-align:right!important;
    }

    @media(max-width:650px){
      .products #grid .product-card-link .row,
      .combos-grid .combo-card .combo-price-row{
        grid-template-columns:minmax(0,1fr) minmax(90px,45%)!important;
        column-gap:8px!important;
      }
      .products #grid .product-card-link .row h3,
      .combos-grid .combo-card .combo-price-row h3{
        font-size:.98rem!important;
        line-height:1.3!important;
      }
      .of-payment-label{font-size:.67rem!important;line-height:1.22!important}
    }
  `;
  document.head.appendChild(style);
});

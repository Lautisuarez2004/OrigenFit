/* Origen Fit · corrección final de títulos y textos promo en tarjetas */
document.addEventListener('DOMContentLoaded',()=>{
  const style=document.createElement('style');
  style.textContent=`
    /*
     * Título + precio comparten solamente la fila superior.
     * El texto de transferencia se posiciona en una línea completa debajo,
     * sin robarle ancho al nombre del producto/combo.
     */
    .products #grid .product-card-link .row,
    .combos-grid .combo-card .combo-price-row{
      position:relative!important;
      display:grid!important;
      grid-template-columns:minmax(0,1fr) auto!important;
      column-gap:10px!important;
      align-items:start!important;
      min-width:0!important;
      min-height:92px!important;
      padding-bottom:31px!important;
      overflow:visible!important;
    }

    /* Nombres compactos, legibles y sin recorte de descendentes (g, p, y). */
    .products #grid .product-card-link .row h3,
    .combos-grid .combo-card .combo-price-row h3{
      min-width:0!important;
      width:auto!important;
      max-width:100%!important;
      height:auto!important;
      max-height:none!important;
      margin:0!important;
      padding:1px 0 5px!important;
      font-size:1rem!important;
      line-height:1.28!important;
      letter-spacing:-.018em!important;
      white-space:normal!important;
      overflow:visible!important;
      text-overflow:clip!important;
      overflow-wrap:break-word!important;
      word-break:normal!important;
    }

    /* El precio ocupa sólo lo que necesita; no puede comerse la columna del título. */
    .of-price-stack,
    .of-combo-payment-stack,
    .combo-price-row>div:last-child{
      min-width:0!important;
      width:auto!important;
      max-width:none!important;
      overflow:visible!important;
      align-items:flex-end!important;
      justify-self:end!important;
    }

    .of-price-stack .price,
    .of-combo-payment-stack .combo-price,
    .of-old-price,
    .combo-old-price{
      white-space:nowrap!important;
    }

    /*
     * Aunque .of-payment-label viva dentro del stack de precio,
     * se posiciona respecto de la fila completa y usa todo el ancho disponible.
     */
    .products #grid .product-card-link .row .of-payment-label,
    .combos-grid .combo-card .combo-price-row .of-payment-label{
      position:absolute!important;
      left:0!important;
      right:0!important;
      bottom:3px!important;
      display:block!important;
      width:auto!important;
      max-width:none!important;
      min-width:0!important;
      margin:0!important;
      padding:0!important;
      font-size:.7rem!important;
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
        column-gap:7px!important;
        min-height:88px!important;
        padding-bottom:30px!important;
      }
      .products #grid .product-card-link .row h3,
      .combos-grid .combo-card .combo-price-row h3{
        font-size:.94rem!important;
        line-height:1.3!important;
      }
      .products #grid .product-card-link .row .of-payment-label,
      .combos-grid .combo-card .combo-price-row .of-payment-label{
        font-size:.65rem!important;
        line-height:1.2!important;
      }
    }
  `;
  document.head.appendChild(style);
});

/* Origen Fit · layout final uniforme de títulos, precios y texto de transferencia */
document.addEventListener('DOMContentLoaded',()=>{
  /*
   * Se inyecta un frame después del resto de los módulos para que estas reglas
   * sean realmente las últimas. Así evitamos que config.js vuelva a pisar
   * tamaños/alineaciones con estilos cargados en DOMContentLoaded.
   */
  requestAnimationFrame(()=>{
    const style=document.createElement('style');
    style.id='of-final-card-layout';
    style.textContent=`
      /*
       * Productos y combos usan exactamente la misma caja para nombre + precio.
       * La segunda franja queda reservada siempre para "Efectivo/transferencia",
       * exista o no el texto, de modo que ninguna tarjeta salte de altura.
       */
      #productos #grid.products .product-card-link .body-card .row,
      #combos #comboGrid.combos-grid .combo-card .combo-price-row{
        position:relative!important;
        display:grid!important;
        grid-template-columns:minmax(0,1fr) max-content!important;
        grid-template-rows:60px 32px!important;
        column-gap:10px!important;
        row-gap:0!important;
        align-items:start!important;
        width:100%!important;
        min-width:0!important;
        height:92px!important;
        min-height:92px!important;
        max-height:92px!important;
        margin:0!important;
        padding:0!important;
        overflow:visible!important;
      }

      /*
       * Títulos más chicos, iguales en ambas secciones y con altura reservada.
       * Hasta tres renglones sin que una g/p/y quede cortada por line-height.
       */
      #productos #grid.products .product-card-link .body-card .row h3,
      #combos #comboGrid.combos-grid .combo-card .combo-price-row h3{
        grid-column:1!important;
        grid-row:1!important;
        align-self:start!important;
        min-width:0!important;
        width:100%!important;
        max-width:100%!important;
        height:58px!important;
        min-height:58px!important;
        max-height:58px!important;
        margin:0!important;
        padding:2px 0 3px!important;
        font-size:.92rem!important;
        line-height:1.22!important;
        letter-spacing:-.012em!important;
        white-space:normal!important;
        overflow:hidden!important;
        text-overflow:clip!important;
        overflow-wrap:break-word!important;
        word-break:normal!important;
        display:-webkit-box!important;
        -webkit-box-orient:vertical!important;
        -webkit-line-clamp:3!important;
      }

      /* El precio queda siempre arriba a la derecha y no invade el título. */
      #productos #grid.products .product-card-link .body-card .row > .of-price-stack,
      #combos #comboGrid.combos-grid .combo-card .combo-price-row > .of-combo-payment-stack,
      #combos #comboGrid.combos-grid .combo-card .combo-price-row > div:last-child{
        grid-column:2!important;
        grid-row:1!important;
        align-self:start!important;
        justify-self:end!important;
        display:flex!important;
        flex-direction:column!important;
        align-items:flex-end!important;
        gap:3px!important;
        min-width:0!important;
        width:auto!important;
        max-width:none!important;
        margin:0!important;
        padding:0!important;
        overflow:visible!important;
      }

      #productos #grid.products .product-card-link .price,
      #combos #comboGrid.combos-grid .combo-card .combo-price,
      #productos #grid.products .product-card-link .of-old-price,
      #combos #comboGrid.combos-grid .combo-card .combo-old-price,
      #combos #comboGrid.combos-grid .combo-card .of-old-price{
        position:static!important;
        transform:none!important;
        margin:0!important;
        white-space:nowrap!important;
        line-height:1.15!important;
      }

      /*
       * El texto promo arranca SIEMPRE en el mismo lugar: segunda franja,
       * independientemente de cuántos renglones tenga el nombre o de si hay
       * precio original tachado.
       */
      #productos #grid.products .product-card-link .body-card .row .of-payment-label,
      #combos #comboGrid.combos-grid .combo-card .combo-price-row .of-payment-label{
        position:absolute!important;
        left:0!important;
        right:0!important;
        top:63px!important;
        bottom:auto!important;
        display:-webkit-box!important;
        width:100%!important;
        min-width:0!important;
        max-width:100%!important;
        height:28px!important;
        max-height:28px!important;
        margin:0!important;
        padding:0!important;
        color:var(--red,#e30613)!important;
        font-size:.68rem!important;
        line-height:1.15!important;
        font-weight:950!important;
        text-align:right!important;
        white-space:normal!important;
        overflow:hidden!important;
        text-overflow:clip!important;
        overflow-wrap:anywhere!important;
        word-break:break-word!important;
        -webkit-box-orient:vertical!important;
        -webkit-line-clamp:2!important;
      }

      /* El resto de la tarjeta empieza siempre después de la misma altura. */
      #productos #grid.products .product-card-link .body-card .tags,
      #combos #comboGrid.combos-grid .combo-card .tags{
        margin-top:6px!important;
      }

      @media(max-width:650px){
        #productos #grid.products .product-card-link .body-card .row,
        #combos #comboGrid.combos-grid .combo-card .combo-price-row{
          grid-template-rows:58px 32px!important;
          column-gap:7px!important;
          height:90px!important;
          min-height:90px!important;
          max-height:90px!important;
        }
        #productos #grid.products .product-card-link .body-card .row h3,
        #combos #comboGrid.combos-grid .combo-card .combo-price-row h3{
          height:56px!important;
          min-height:56px!important;
          max-height:56px!important;
          font-size:.88rem!important;
          line-height:1.24!important;
          padding-top:2px!important;
        }
        #productos #grid.products .product-card-link .body-card .row > .of-price-stack,
        #combos #comboGrid.combos-grid .combo-card .combo-price-row > .of-combo-payment-stack,
        #combos #comboGrid.combos-grid .combo-card .combo-price-row > div:last-child{
          align-items:flex-end!important;
        }
        #productos #grid.products .product-card-link .body-card .row .of-payment-label,
        #combos #comboGrid.combos-grid .combo-card .combo-price-row .of-payment-label{
          top:61px!important;
          height:27px!important;
          max-height:27px!important;
          font-size:.63rem!important;
          line-height:1.14!important;
        }
      }
    `;
    document.getElementById('of-final-card-layout')?.remove();
    document.head.appendChild(style);
  });
});

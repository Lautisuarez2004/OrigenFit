window.ORIGENFIT_CONFIG={
  supabaseUrl:"https://bxnvquawhukqsmeqlfwa.supabase.co",
  supabaseKey:"sb_publishable_htQd5YCWT6cGgzicfKg-Ww_QsSin_Xz"
};
/* Carga sincrónica de las mejoras acumuladas + extensiones especiales. */
document.write('<script src="config-core.js?v=20260814-1"><\/script>');
document.write('<script src="todos-special.js?v=20260814-1"><\/script>');
document.write('<script src="promo-overlay.js?v=20260814-1"><\/script>');
document.write('<script src="carousel-visibility-fix.js?v=20260814-2"><\/script>');
document.write('<script src="admin-product-enhancements.js?v=20260817-1"><\/script>');
document.write('<script src="admin-combo-enhancements.js?v=20260817-1"><\/script>');
document.write('<script src="product-experience.js?v=20260817-3"><\/script>');
document.write('<script src="combo-experience.js?v=20260817-1"><\/script>');
document.write('<script src="promo-price-fix.js?v=20260816-1"><\/script>');
document.write('<script src="cart-rescue.js?v=20260817-1"><\/script>');
document.write('<script src="product-cart-fix.js?v=20260817-4"><\/script>');
document.write('<script src="catalog-status-badges.js?v=20260817-3"><\/script>');
document.write('<script src="catalog-card-uniformity.js?v=20260817-2"><\/script>');
document.write('<script src="catalog-text-layout-fix.js?v=20260817-2"><\/script>');

/* Promociones: navegación manual y corrección de imagen en móvil. */
document.addEventListener('DOMContentLoaded',()=>{
  const style=document.createElement('style');
  style.textContent=`
    /* Las descripciones largas viven sólo en las fichas individuales. */
    .products .product-card-link .desc,.combos-grid .combo-card .combo-desc{display:none!important}

    /* Precios promocionales: siempre apilados, nunca superpuestos. */
    #priceBox{display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:5px!important;margin:22px 0 5px!important;min-width:0!important}
    #priceBox .price{display:block!important;position:static!important;transform:none!important;margin:0!important;line-height:1.15!important}
    #priceBox .old{display:block!important;position:static!important;transform:none!important;margin:0!important;line-height:1.2!important}
    #priceBox .promo-label{display:block!important;position:static!important;transform:none!important;margin:2px 0 0!important;line-height:1.25!important}
    .combo-price-row>div:last-child,.of-price-stack{display:flex!important;flex-direction:column!important;align-items:flex-end!important;gap:4px!important;min-width:max-content!important}
    .combo-price,.combo-old-price,.of-price-stack .price,.of-old-price{position:static!important;transform:none!important;line-height:1.15!important;margin:0!important}
    .combo-old-price,.of-old-price{display:block!important;color:#8b8d93!important;font-size:.82rem!important;font-weight:700!important;text-decoration:line-through!important;white-space:nowrap!important}
    @media(max-width:650px){.of-price-stack{align-items:flex-start!important}}

    @media(max-width:650px){
      .promos{padding:18px 0!important}
      .promo-shell{width:100%!important;margin:0 auto!important}
      .promo-track{height:auto!important;border-radius:20px!important;overflow:hidden!important}
      .promo-slide{width:100%!important;height:auto!important;min-height:0!important;border-radius:20px!important}
      .promo-slide.active{display:block!important}
      .promo-slide>a{display:block!important;width:100%!important;height:auto!important}
      .promo-image{display:block!important;width:100%!important;height:auto!important;min-height:0!important;padding:0!important;overflow:hidden!important;background:#111!important}
      .promo-image img{display:block!important;width:100%!important;min-width:100%!important;height:auto!important;max-width:100%!important;max-height:none!important;object-fit:contain!important;object-position:center!important;opacity:1!important;visibility:visible!important}
      .promo-image.no-image{min-height:180px!important}
      .promo-arrow{width:40px!important;height:40px!important}
      .promo-arrow.left{left:10px!important}.promo-arrow.right{right:10px!important}
    }
  `;
  document.head.appendChild(style);

  try{
    clearInterval(promoTimer);
    promoTimer=null;
    resetPromoTimer=function(){
      clearInterval(promoTimer);
      promoTimer=null;
    };
  }catch(err){
    console.warn('Autoplay de promociones:',err?.message||err);
  }

  const track=document.getElementById('promoTrack');
  if(track){
    track.addEventListener('load',e=>{
      if(e.target?.tagName==='IMG'){
        e.target.style.display='block';
        e.target.style.width='100%';
        e.target.style.height='auto';
      }
    },true);
  }
});
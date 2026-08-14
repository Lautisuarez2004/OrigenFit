window.ORIGENFIT_CONFIG={
  supabaseUrl:"https://bxnvquawhukqsmeqlfwa.supabase.co",
  supabaseKey:"sb_publishable_htQd5YCWT6cGgzicfKg-Ww_QsSin_Xz"
};
/* Carga sincrónica de las mejoras acumuladas + extensiones especiales. */
document.write('<script src="config-core.js?v=20260814-1"><\/script>');
document.write('<script src="todos-special.js?v=20260814-1"><\/script>');
document.write('<script src="promo-overlay.js?v=20260814-1"><\/script>');
document.write('<script src="carousel-visibility-fix.js?v=20260814-2"><\/script>');

/* Promociones: navegación manual y corrección de imagen en móvil. */
document.addEventListener('DOMContentLoaded',()=>{
  const style=document.createElement('style');
  style.textContent=`
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

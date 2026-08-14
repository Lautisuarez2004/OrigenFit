/*
 * Control de texto superpuesto en promociones.
 * Requiere la columna public.promotions.show_overlay (upgrade_v22_promo_overlay.sql).
 * - true / null: comportamiento tradicional con título, badge, subtítulo y sticker.
 * - false: se muestra solamente la imagen (el link de la promoción sigue funcionando).
 */
document.addEventListener('DOMContentLoaded',()=>{
  const isStore=!!document.getElementById('promoRoot');
  const isAdmin=!!document.getElementById('promotionsPanel');

  if(isStore){
    const track=document.getElementById('promoTrack');
    if(track){
      const applyPromoOverlayVisibility=()=>{
        let items=[];
        try{ items=Array.isArray(promos)?promos:[]; }catch(_){ items=[]; }

        [...track.querySelectorAll('.promo-slide')].forEach((slide,i)=>{
          const promo=items[i];
          const show=promo?.show_overlay!==false;
          slide.classList.toggle('promo-no-overlay',!show);

          const overlay=slide.querySelector('.promo-overlay');
          const sticker=slide.querySelector('.promo-sticker');
          if(overlay) overlay.style.display=show?'':'none';
          if(sticker) sticker.style.display=show?'':'none';
        });
      };

      new MutationObserver(()=>requestAnimationFrame(applyPromoOverlayVisibility))
        .observe(track,{childList:true,subtree:true});

      const style=document.createElement('style');
      style.textContent=`
        .promo-slide.promo-no-overlay .promo-overlay,
        .promo-slide.promo-no-overlay .promo-sticker{display:none!important}
      `;
      document.head.appendChild(style);

      applyPromoOverlayVisibility();
    }
  }

  if(isAdmin){
    const active=document.getElementById('prActive');
    const checks=active?.closest('.checks');
    if(!checks || document.getElementById('prShowOverlay')) return;

    const label=document.createElement('label');
    label.title='Desactivá esta opción cuando la imagen ya tenga su propio texto o diseño.';
    label.innerHTML='<input id="prShowOverlay" type="checkbox" checked> Mostrar texto sobre la imagen';
    checks.insertBefore(label,active.closest('label')||null);

    const showInput=document.getElementById('prShowOverlay');

    try{
      const originalFillPromo=fillPromo;
      fillPromo=function(p){
        originalFillPromo(p);
        showInput.checked=p?.show_overlay!==false;
      };

      const originalClearPromo=clearPromo;
      clearPromo=function(){
        originalClearPromo();
        showInput.checked=true;
      };

      const originalReadPromoForm=readPromoForm;
      readPromoForm=function(){
        const payload=originalReadPromoForm();
        payload.show_overlay=!!showInput.checked;
        return payload;
      };
    }catch(err){
      console.warn('Control de texto de promociones:',err?.message||err);
    }
  }
});

/* Origen Fit · carrusel estable de Combos.
 * Mantiene colores y contenido de las fichas.
 * Desktop/tablet/móvil: 3 combos visibles.
 * Cada toque mueve 1 posición; taps rápidos se acumulan sin activar zoom.
 */
document.addEventListener('DOMContentLoaded',()=>{
  const hero=document.querySelector('.hero');
  const duplicateHeroLogo=hero?.querySelector('.hero-logo-wrap');
  if(duplicateHeroLogo){
    duplicateHeroLogo.remove();
    hero?.querySelector('.hero-grid')?.classList.add('of-hero-no-duplicate-logo');
  }

  const grid=document.getElementById('comboGrid');
  if(!grid) return;

  const existing=grid.closest('.of-combo-carousel');
  let shell=existing;
  let prev=existing?.querySelector('.of-carousel-arrow.prev')||null;
  let next=existing?.querySelector('.of-carousel-arrow.next')||null;

  if(!shell){
    shell=document.createElement('div');
    shell.className='of-carousel-shell of-combo-carousel';
    prev=document.createElement('button');
    prev.type='button';
    prev.className='of-carousel-arrow prev';
    prev.innerHTML='‹';
    prev.setAttribute('aria-label','Combos anteriores');
    next=document.createElement('button');
    next.type='button';
    next.className='of-carousel-arrow next';
    next.innerHTML='›';
    next.setAttribute('aria-label','Combos siguientes');
    grid.parentNode.insertBefore(shell,grid);
    shell.appendChild(prev);
    shell.appendChild(grid);
    shell.appendChild(next);
  }

  grid.dataset.ofComboCarouselReady='1';
  grid.classList.add('of-combo-grid');

  const oldStyle=document.getElementById('of-combo-carousel-style');
  if(oldStyle) oldStyle.remove();
  const style=document.createElement('style');
  style.id='of-combo-carousel-style';
  style.textContent=`
    .hero .hero-grid.of-hero-no-duplicate-logo{
      grid-template-columns:minmax(0,780px)!important;
      justify-content:flex-start!important;
    }
    .of-combo-carousel{position:relative;padding:0 58px}
    .of-combo-carousel .of-carousel-arrow{
      background:#fff!important;color:#e30613!important;
      touch-action:manipulation!important;-webkit-user-select:none!important;user-select:none!important;
      -webkit-touch-callout:none!important;-webkit-tap-highlight-color:transparent!important;
    }
    .combos-grid.of-combo-grid{
      display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;
      gap:20px!important;overflow:visible!important;
    }
    .combos-grid.of-combo-grid > .combo-card{min-width:0!important;width:auto!important}
    .combos-grid.of-combo-grid > .combo-card.of-combo-hidden{display:none!important}
    .combos-grid.of-combo-grid .combo-art{position:relative!important}
    .of-combo-highlight{
      position:static!important;width:100%!important;min-height:34px;display:flex!important;align-items:center!important;justify-content:center!important;
      padding:8px 12px!important;margin:0!important;border:0!important;border-radius:0!important;background:#e30613!important;color:#fff!important;
      box-shadow:none!important;font-size:.74rem;line-height:1;font-weight:1000;letter-spacing:.065em;text-transform:uppercase;pointer-events:none;order:-1;
    }
    .of-combo-highlight::before{content:'★';margin-right:6px;font-size:.72rem}
    @media(max-width:900px){
      .of-combo-carousel{padding:0 42px}
      .combos-grid.of-combo-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:10px!important}
    }
    @media(max-width:650px){
      .hero .hero-grid.of-hero-no-duplicate-logo{grid-template-columns:1fr!important}
      .of-combo-carousel{padding:0 32px!important}
      .combos-grid.of-combo-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important}
      .of-combo-carousel .of-carousel-arrow{width:28px!important;height:42px!important;border-radius:0!important;background:transparent!important;color:#fff!important;box-shadow:none!important;font-size:1.8rem!important}
      .of-combo-carousel .of-carousel-arrow.prev{left:0!important}.of-combo-carousel .of-carousel-arrow.next{right:0!important}
      .combos-grid.of-combo-grid > .combo-card{border-radius:12px!important}
      .combos-grid.of-combo-grid .combo-art{height:112px!important;padding:5px!important}
      .combos-grid.of-combo-grid .combo-body{padding:8px!important}
      .combos-grid.of-combo-grid .combo-price-row{display:block!important;min-height:72px!important}
      .combos-grid.of-combo-grid .combo-price-row h3{font-size:.72rem!important;line-height:1.05!important;min-height:30px!important;margin-bottom:4px!important;display:-webkit-box!important;-webkit-line-clamp:3!important;-webkit-box-orient:vertical!important;overflow:hidden!important}
      .combos-grid.of-combo-grid .combo-price-row>div:last-child{min-width:0!important;align-items:flex-start!important}
      .combos-grid.of-combo-grid .combo-price{font-size:.76rem!important;white-space:normal!important}
      .combos-grid.of-combo-grid .combo-old-price{font-size:.61rem!important}
      .combos-grid.of-combo-grid .tags,.combos-grid.of-combo-grid .combo-wa{display:none!important}
      .combos-grid.of-combo-grid .of-combo-add-cart,.combos-grid.of-combo-grid .of-add-cart{min-height:31px!important;padding:6px 4px!important;font-size:.62rem!important;margin-top:6px!important}
      .of-combo-highlight{min-height:25px!important;padding:5px 3px!important;font-size:.49rem!important;letter-spacing:.02em!important}
      .of-combo-highlight::before{margin-right:3px!important;font-size:.47rem!important}
    }
  `;
  document.head.appendChild(style);

  const cards=()=>Array.from(grid.children).filter(el=>el.classList?.contains('combo-card'));
  const visibleCount=()=>3;
  let offset=0;

  const decorateBadges=()=>{
    cards().forEach(card=>{
      const art=card.querySelector('.combo-art');
      if(!art) return;
      card.querySelectorAll('.of-combo-highlight').forEach(b=>b.remove());
      const badge=document.createElement('div');
      badge.className='of-combo-highlight';
      badge.textContent='Combo especial';
      card.insertBefore(badge,art);
    });
  };

  const render=()=>{
    const list=cards();
    const count=visibleCount();
    const maxStart=Math.max(0,list.length-count);
    offset=Math.max(0,Math.min(offset,maxStart));
    decorateBadges();
    list.forEach((card,i)=>card.classList.toggle('of-combo-hidden',i<offset||i>=offset+count));
    prev.disabled=offset<=0;
    next.disabled=offset>=maxStart;
    shell.style.display=list.length?'block':'none';
  };

  const goPrev=e=>{e?.preventDefault();e?.stopPropagation();if(offset>0){offset--;render();}};
  const goNext=e=>{e?.preventDefault();e?.stopPropagation();const maxStart=Math.max(0,cards().length-visibleCount());if(offset<maxStart){offset++;render();}};

  prev.onclick=null;next.onclick=null;
  prev.addEventListener('click',goPrev);
  next.addEventListener('click',goNext);

  document.addEventListener('dblclick',e=>{
    if(e.target.closest?.('.of-combo-carousel .of-carousel-arrow')) e.preventDefault();
  },{passive:false});

  let queued=false;
  new MutationObserver(()=>{
    if(queued) return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;render();});
  }).observe(grid,{childList:true});

  window.addEventListener('resize',()=>requestAnimationFrame(render));
  requestAnimationFrame(render);
  setTimeout(render,250);
  setTimeout(render,900);
});

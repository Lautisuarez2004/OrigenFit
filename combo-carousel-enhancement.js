/* Origen Fit · carrusel de Combos.
 * Mantiene intactas las fichas y sus colores.
 * Desktop: 3 visibles. Tablet: 2. Móvil: 1.
 * Cada toque desplaza exactamente 1 combo; dos toques rápidos desplazan 2.
 */
document.addEventListener('DOMContentLoaded',()=>{
  const grid=document.getElementById('comboGrid');
  if(!grid||grid.dataset.ofComboCarouselReady==='1') return;
  grid.dataset.ofComboCarouselReady='1';

  const style=document.createElement('style');
  style.id='of-combo-carousel-style';
  style.textContent=`
    .of-combo-carousel{position:relative;padding:0 58px}
    .of-combo-carousel .of-carousel-arrow{
      background:#fff!important;
      color:#e30613!important;
      touch-action:manipulation!important;
      -webkit-user-select:none!important;
      user-select:none!important;
      -webkit-touch-callout:none!important;
      -webkit-tap-highlight-color:transparent!important;
    }
    .combos-grid.of-combo-grid{
      display:grid!important;
      grid-template-columns:repeat(3,minmax(0,1fr))!important;
      gap:20px!important;
      overflow:visible!important;
    }
    .combos-grid.of-combo-grid .combo-card{
      min-width:0!important;
      width:auto!important;
    }
    .combos-grid .combo-card .combo-art{position:relative!important}
    .of-combo-highlight{
      position:absolute;
      top:13px;
      left:13px;
      z-index:7;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      min-height:31px;
      padding:7px 12px;
      border-radius:999px;
      background:#e30613;
      color:#fff;
      border:1px solid rgba(255,255,255,.35);
      box-shadow:0 8px 18px rgba(0,0,0,.18);
      font-size:.72rem;
      line-height:1;
      font-weight:1000;
      letter-spacing:.055em;
      text-transform:uppercase;
      pointer-events:none;
    }
    .of-combo-highlight::before{
      content:'★';
      margin-right:6px;
      font-size:.72rem;
    }
    @media(max-width:900px){
      .combos-grid.of-combo-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
    }
    @media(max-width:650px){
      .of-combo-carousel{padding:0 48px}
      .combos-grid.of-combo-grid{grid-template-columns:1fr!important}
      .of-combo-highlight{top:11px;left:11px;min-height:29px;padding:7px 11px;font-size:.68rem}
    }
  `;
  document.head.appendChild(style);

  const shell=document.createElement('div');
  shell.className='of-carousel-shell of-combo-carousel';

  const prev=document.createElement('button');
  prev.type='button';
  prev.className='of-carousel-arrow prev';
  prev.innerHTML='‹';
  prev.setAttribute('aria-label','Combos anteriores');

  const next=document.createElement('button');
  next.type='button';
  next.className='of-carousel-arrow next';
  next.innerHTML='›';
  next.setAttribute('aria-label','Combos siguientes');

  grid.parentNode.insertBefore(shell,grid);
  shell.appendChild(prev);
  shell.appendChild(grid);
  shell.appendChild(next);
  grid.classList.add('of-combo-grid');

  const slots=()=>{
    if(window.matchMedia('(max-width:650px)').matches) return 1;
    if(window.matchMedia('(max-width:900px)').matches) return 2;
    return 3;
  };

  const cards=()=>[...grid.querySelectorAll(':scope > .combo-card')];
  let offset=0;

  const decorateBadges=()=>{
    cards().forEach(card=>{
      if(card.querySelector('.of-combo-highlight')) return;
      const art=card.querySelector('.combo-art');
      if(!art) return;
      const badge=document.createElement('div');
      badge.className='of-combo-highlight';
      badge.textContent='Combo especial';
      art.appendChild(badge);
    });
  };

  const render=()=>{
    const list=cards();
    const visible=slots();
    const maxStart=Math.max(0,list.length-visible);
    offset=Math.max(0,Math.min(offset,maxStart));

    decorateBadges();
    list.forEach((card,i)=>{
      card.classList.toggle('of-carousel-hidden',i<offset||i>=offset+visible);
    });

    prev.disabled=offset<=0;
    next.disabled=offset>=maxStart;
    shell.style.display=list.length?'block':'none';
  };

  prev.onclick=()=>{
    if(offset<=0) return;
    offset-=1;
    render();
  };

  next.onclick=()=>{
    const maxStart=Math.max(0,cards().length-slots());
    if(offset>=maxStart) return;
    offset+=1;
    render();
  };

  let queued=false;
  const scheduleRender=()=>{
    if(queued) return;
    queued=true;
    requestAnimationFrame(()=>{
      queued=false;
      const maxStart=Math.max(0,cards().length-slots());
      offset=Math.min(offset,maxStart);
      render();
    });
  };

  new MutationObserver(scheduleRender).observe(grid,{childList:true});

  document.addEventListener('dblclick',e=>{
    if(e.target.closest?.('.of-combo-carousel .of-carousel-arrow')) e.preventDefault();
  },{passive:false});

  window.addEventListener('resize',()=>{
    offset=0;
    requestAnimationFrame(render);
  });

  render();
});

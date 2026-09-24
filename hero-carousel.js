/* Origen Fit · carrusel principal de portada, alimentado por promotions */
document.addEventListener('DOMContentLoaded',()=>{
  const hero=document.querySelector('.hero');
  if(!hero)return;

  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const style=document.createElement('style');
  style.id='of-hero-carousel-style';
  style.textContent=`
    .hero.of-hero-carousel{
      width:100%!important;
      padding:0!important;
      margin:0!important;
      min-height:0!important;
      background:#f7f7f8!important;
      overflow:hidden!important;
      position:relative!important;
    }
    #promos{display:none!important}

    .of-hero-viewport{
      position:relative;
      width:100%;
      height:clamp(500px,calc(100svh - 180px),690px);
      min-height:500px;
      background:#f7f7f8;
      overflow:hidden;
    }
    .of-hero-slide{
      position:absolute;
      inset:0;
      opacity:0;
      visibility:hidden;
      pointer-events:none;
      transition:opacity .42s ease,visibility .42s ease;
      background:#fff;
    }
    .of-hero-slide.active{
      opacity:1;
      visibility:visible;
      pointer-events:auto;
      z-index:2;
    }

    /* Slides de imagen: se ven limpios. Sólo se oscurecen si el admin lo pide. */
    .of-hero-image-slide>img{
      position:absolute;
      inset:0;
      width:100%;
      height:100%;
      display:block;
      object-fit:cover;
      object-position:center;
    }
    .of-hero-fallback{
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at 78% 30%,rgba(227,6,19,.28),transparent 28%),
        linear-gradient(135deg,#fff 0%,#fff7f8 65%,#f2f2f3 100%);
    }
    .of-hero-overlay{
      position:absolute;
      inset:0;
      z-index:1;
      background:linear-gradient(90deg,rgba(0,0,0,.58) 0%,rgba(0,0,0,.24) 42%,rgba(0,0,0,0) 78%);
      pointer-events:none;
    }
    .of-hero-copy-wrap{
      position:absolute;
      inset:0;
      z-index:3;
      width:min(1160px,calc(100% - 44px));
      margin:auto;
      display:flex;
      align-items:center;
      justify-content:flex-start;
      padding:44px 0 54px;
      pointer-events:none;
    }
    .of-hero-copy{
      width:min(620px,82%);
      color:#fff;
      pointer-events:auto;
      text-shadow:0 2px 18px rgba(0,0,0,.20);
    }
    .of-hero-badge{
      display:inline-flex;
      align-items:center;
      padding:7px 12px;
      border-radius:999px;
      background:var(--red,#e30613);
      color:#fff;
      font-size:.74rem;
      font-weight:950;
      letter-spacing:.08em;
      text-transform:uppercase;
      box-shadow:0 8px 18px rgba(0,0,0,.15);
    }
    .of-hero-title{
      margin:13px 0 8px;
      font-size:clamp(2.6rem,6vw,5.7rem);
      line-height:.9;
      letter-spacing:-.065em;
      font-weight:1000;
      text-wrap:balance;
    }
    .of-hero-sub{
      margin:0;
      max-width:590px;
      font-size:clamp(1rem,1.7vw,1.22rem);
      line-height:1.38;
      font-weight:650;
    }
    .of-hero-cta{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      min-height:46px;
      margin-top:18px;
      padding:0 20px;
      border-radius:999px;
      background:var(--red,#e30613);
      color:#fff;
      font-size:.84rem;
      font-weight:950;
      letter-spacing:.035em;
      text-transform:uppercase;
      box-shadow:0 9px 22px rgba(0,0,0,.16);
    }

    /* Oferta producto: recrea la promo como diseño responsive, sin overlay oscuro. */
    .of-hero-offer-slide{
      background:
        linear-gradient(120deg,transparent 0 74%,rgba(227,6,19,.06) 74% 76%,transparent 76%),
        radial-gradient(circle at 87% 18%,rgba(227,6,19,.08),transparent 28%),
        linear-gradient(180deg,#fff 0%,#f8f8f9 100%);
      color:#171719;
    }
    .of-offer-decor{
      position:absolute;
      inset:0;
      pointer-events:none;
      overflow:hidden;
    }
    .of-offer-decor:before{
      content:"";
      position:absolute;
      right:-70px;
      top:-110px;
      width:430px;
      height:430px;
      border:54px solid rgba(227,6,19,.08);
      transform:rotate(28deg);
    }
    .of-offer-decor:after{
      content:"";
      position:absolute;
      left:-80px;
      top:-70px;
      width:330px;
      height:260px;
      opacity:.52;
      background-image:
        linear-gradient(30deg,rgba(227,6,19,.10) 12%,transparent 12.5%,transparent 87%,rgba(227,6,19,.10) 87.5%),
        linear-gradient(150deg,rgba(227,6,19,.10) 12%,transparent 12.5%,transparent 87%,rgba(227,6,19,.10) 87.5%);
      background-size:90px 52px;
    }
    .of-offer-shell{
      position:relative;
      z-index:2;
      width:min(1180px,calc(100% - 44px));
      height:100%;
      margin:auto;
      display:grid;
      grid-template-columns:minmax(0,.92fr) minmax(360px,1.08fr);
      gap:34px;
      align-items:center;
      padding:34px 0 42px;
    }
    .of-offer-copy{
      align-self:center;
      padding-left:8px;
    }
    .of-offer-badge{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      min-height:38px;
      padding:0 22px;
      border-radius:10px;
      background:linear-gradient(180deg,#d10a14,#b90009);
      color:#fff;
      font-size:.95rem;
      font-weight:1000;
      letter-spacing:.12em;
      text-transform:uppercase;
      box-shadow:0 8px 22px rgba(181,0,8,.16);
    }
    .of-offer-title{
      margin:18px 0 4px;
      font-size:clamp(3rem,5.6vw,5.7rem);
      line-height:.84;
      letter-spacing:-.07em;
      font-weight:1000;
      text-transform:uppercase;
      color:#232427;
    }
    .of-offer-title span{
      display:block;
      color:#c4000b;
    }
    .of-offer-sub{
      margin:14px 0 0;
      color:#404248;
      font-size:clamp(1rem,1.6vw,1.28rem);
      font-weight:650;
    }
    .of-offer-price{
      display:inline-flex;
      align-items:center;
      min-height:82px;
      margin-top:18px;
      padding:0 30px;
      border-radius:18px;
      background:linear-gradient(180deg,#d10a14,#b90009);
      color:#fff;
      font-size:clamp(2.6rem,5vw,4.7rem);
      line-height:1;
      font-weight:1000;
      letter-spacing:-.045em;
      box-shadow:0 12px 28px rgba(181,0,8,.18);
    }
    .of-offer-points{
      display:flex;
      flex-wrap:wrap;
      gap:10px 22px;
      margin-top:18px;
      color:#32343a;
      font-size:.82rem;
      font-weight:900;
      text-transform:uppercase;
    }
    .of-offer-points span{
      display:inline-flex;
      align-items:center;
      gap:7px;
    }
    .of-offer-points span:before{
      content:"";
      width:8px;
      height:8px;
      border-radius:50%;
      background:#e30613;
      box-shadow:0 0 0 4px rgba(227,6,19,.10);
    }
    .of-offer-actions{
      display:flex;
      align-items:center;
      flex-wrap:wrap;
      gap:12px;
      margin-top:17px;
    }
    .of-offer-link{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      min-height:44px;
      padding:0 18px;
      border-radius:999px;
      background:#111;
      color:#fff;
      font-size:.8rem;
      font-weight:950;
      letter-spacing:.035em;
      text-transform:uppercase;
    }
    .of-offer-shipping{
      font-size:.78rem;
      color:#4b4d52;
      font-weight:800;
    }
    .of-offer-shipping strong{color:#e30613}
    .of-offer-product{
      position:relative;
      height:100%;
      min-height:430px;
      display:flex;
      align-items:center;
      justify-content:center;
    }
    .of-offer-product:before{
      content:"";
      position:absolute;
      width:72%;
      aspect-ratio:1;
      border-radius:50%;
      background:radial-gradient(circle,rgba(227,6,19,.10),rgba(227,6,19,0) 68%);
      filter:blur(2px);
    }
    .of-offer-product img{
      position:relative!important;
      inset:auto!important;
      z-index:2;
      display:block!important;
      width:min(76%,500px)!important;
      height:min(82%,500px)!important;
      object-fit:contain!important;
      object-position:center!important;
      filter:drop-shadow(0 22px 24px rgba(0,0,0,.18));
      background:transparent!important;
    }

    .of-hero-sticker{
      position:absolute;
      top:25px;
      right:-54px;
      z-index:6;
      min-width:225px;
      padding:10px 58px;
      background:var(--red,#e30613);
      color:#fff;
      text-align:center;
      font-size:.75rem;
      font-weight:1000;
      letter-spacing:.07em;
      text-transform:uppercase;
      transform:rotate(35deg);
      box-shadow:0 8px 20px rgba(0,0,0,.20);
    }
    .of-hero-arrow{
      position:absolute;
      top:50%;
      z-index:10;
      width:46px;
      height:56px;
      margin-top:-28px;
      border:0;
      border-radius:14px;
      display:grid;
      place-items:center;
      background:rgba(255,255,255,.94);
      color:#111;
      box-shadow:0 9px 24px rgba(0,0,0,.14);
      font-size:2rem;
      font-weight:800;
      cursor:pointer;
      touch-action:manipulation;
    }
    .of-hero-arrow.prev{left:16px}
    .of-hero-arrow.next{right:16px}
    .of-hero-dots{
      position:absolute;
      left:50%;
      bottom:14px;
      z-index:12;
      transform:translateX(-50%);
      display:flex;
      gap:8px;
      padding:7px 10px;
      border-radius:999px;
      background:rgba(0,0,0,.14);
      backdrop-filter:blur(7px);
    }
    .of-hero-dot{
      width:9px;height:9px;padding:0;border:0;border-radius:50%;
      background:rgba(255,255,255,.72);transition:width .18s ease,background .18s ease;cursor:pointer;
      box-shadow:0 0 0 1px rgba(0,0,0,.08);
    }
    .of-hero-dot.active{width:27px;border-radius:999px;background:#e30613}
    .of-hero-loading{
      height:100%;display:grid;place-items:center;color:#333;font-weight:900;letter-spacing:.08em;text-transform:uppercase;
      background:linear-gradient(135deg,#fff,#f5f5f6);
    }

    @media(max-width:900px){
      .of-hero-viewport{height:clamp(500px,72svh,650px);min-height:500px}
      .of-hero-copy-wrap{width:min(100% - 32px,760px);padding:34px 0 48px}
      .of-hero-copy{width:min(590px,92%)}
      .of-hero-title{font-size:clamp(2.5rem,9vw,4.8rem)}
      .of-offer-shell{width:calc(100% - 34px);grid-template-columns:1fr 1fr;gap:18px}
      .of-offer-title{font-size:clamp(2.35rem,7vw,4rem)}
      .of-offer-price{min-height:68px;padding:0 22px}
      .of-offer-product{min-height:380px}
      .of-offer-product img{width:min(86%,430px)!important;height:min(82%,430px)!important}
      .of-hero-arrow{width:40px;height:50px;border-radius:12px}
      .of-hero-arrow.prev{left:8px}.of-hero-arrow.next{right:8px}
    }

    @media(max-width:650px){
      /* Formato móvil tipo banner: franja promocional + puntos debajo. */
      .hero.of-hero-carousel{
        background:#fff!important;
        overflow:hidden!important;
      }
      .of-hero-viewport{
        height:calc((100vw / 2.35) + 42px);
        min-height:205px;
        max-height:225px;
        background:#fff;
        overflow:hidden;
      }
      .of-hero-slide{
        bottom:42px;
        background:#fff;
      }

      /* Slides de imagen: se comportan como banner panorámico. */
      .of-hero-image-slide>img{
        object-fit:cover;
        object-position:center;
      }
      .of-hero-copy-wrap{
        width:calc(100% - 58px);
        padding:12px 0;
      }
      .of-hero-copy{width:76%}
      .of-hero-title{
        margin:6px 0 3px;
        font-size:clamp(1.35rem,7vw,1.9rem);
        line-height:.92;
      }
      .of-hero-sub{
        font-size:.66rem;
        line-height:1.2;
      }
      .of-hero-badge{
        font-size:.52rem;
        padding:4px 7px;
      }
      .of-hero-cta{
        min-height:28px;
        margin-top:7px;
        padding:0 10px;
        font-size:.55rem;
      }

      /* Oferta de producto: misma composición, comprimida a banner. */
      .of-offer-shell{
        width:calc(100% - 54px);
        grid-template-columns:minmax(0,1.05fr) minmax(118px,.95fr);
        grid-template-rows:1fr;
        gap:8px;
        align-items:center;
        padding:9px 0 8px;
      }
      .of-offer-copy{
        align-self:center;
        padding:0;
        text-align:left;
        min-width:0;
      }
      .of-offer-badge{
        min-height:20px;
        padding:0 8px;
        border-radius:6px;
        font-size:.48rem;
        letter-spacing:.08em;
      }
      .of-offer-title{
        margin:5px 0 0;
        font-size:clamp(1.18rem,6.5vw,1.55rem);
        line-height:.86;
        letter-spacing:-.055em;
      }
      .of-offer-sub{
        margin-top:4px;
        font-size:.58rem;
        line-height:1.12;
      }
      .of-offer-price{
        min-height:34px;
        margin-top:6px;
        padding:0 10px;
        border-radius:8px;
        font-size:1.5rem;
        box-shadow:0 6px 14px rgba(181,0,8,.14);
      }
      .of-offer-points{display:none!important}
      .of-offer-actions{
        margin-top:5px;
        gap:6px;
      }
      .of-offer-link{
        min-height:25px;
        padding:0 9px;
        font-size:.48rem;
      }
      .of-offer-shipping{display:none!important}
      .of-offer-product{
        min-height:0;
        height:100%;
        margin:0;
      }
      .of-offer-product:before{width:92%}
      .of-offer-product img{
        width:96%!important;
        height:96%!important;
        max-width:180px!important;
        max-height:150px!important;
        object-fit:contain!important;
        filter:drop-shadow(0 8px 9px rgba(0,0,0,.16));
      }
      .of-offer-decor:before{
        right:-105px;
        top:-160px;
        width:300px;
        height:300px;
        border-width:34px;
      }
      .of-offer-decor:after{
        left:-95px;
        top:-105px;
        transform:scale(.62);
        transform-origin:top left;
      }

      .of-hero-sticker{
        top:8px;
        right:-78px;
        min-width:205px;
        padding:5px 58px;
        font-size:.48rem;
      }

      /* Flechas dentro del banner; dots sobre blanco, como la referencia. */
      .of-hero-arrow{
        top:calc((100% - 42px)/2);
        width:28px;
        height:38px;
        margin-top:-19px;
        border-radius:8px;
        background:rgba(255,255,255,.82);
        color:#111;
        box-shadow:0 4px 12px rgba(0,0,0,.10);
        font-size:1.35rem;
      }
      .of-hero-arrow.prev{left:4px}
      .of-hero-arrow.next{right:4px}
      .of-hero-dots{
        bottom:11px;
        padding:0;
        gap:8px;
        background:transparent;
        backdrop-filter:none;
      }
      .of-hero-dot{
        width:7px;
        height:7px;
        background:#d6d6d8;
        box-shadow:none;
      }
      .of-hero-dot.active{
        width:7px;
        border-radius:50%;
        background:#343438;
      }
    }
    @media(prefers-reduced-motion:reduce){.of-hero-slide{transition:none}}
  `;
  document.head.appendChild(style);

  hero.classList.add('of-hero-carousel');
  hero.innerHTML='<div id="ofHeroViewport" class="of-hero-viewport"><div class="of-hero-loading">Cargando portada…</div></div>';
  const viewport=document.getElementById('ofHeroViewport');

  let slides=[];
  let index=0;
  let timer=null;
  let paused=false;
  let x0=0,y0=0;

  function offerHtml(s,i){
    const button=esc(s.button_text||'Ver producto');
    const link=s.link_url?'<a class="of-offer-link" href="'+esc(s.link_url)+'">'+button+'</a>':'';
    const price=s.price_text?'<div class="of-offer-price">'+esc(s.price_text)+'</div>':'';
    const media=s.image_url?'<img src="'+esc(s.image_url)+'" alt="'+esc(s.title||'Producto en oferta')+'" loading="'+(i===0?'eager':'lazy')+'">':'';
    return '<div class="of-hero-slide of-hero-offer-slide '+(i===0?'active':'')+'" data-index="'+i+'" aria-hidden="'+(i===0?'false':'true')+'">'
      +'<div class="of-offer-decor"></div>'
      +'<div class="of-offer-shell">'
      +'<div class="of-offer-copy">'
      +(s.badge?'<span class="of-offer-badge">'+esc(s.badge)+'</span>':'')
      +'<div class="of-offer-title">'+esc(s.title||'OFERTA').replace(/ ONE FIT$/i,'<span>ONE FIT</span>')+'</div>'
      +(s.subtitle?'<p class="of-offer-sub">'+esc(s.subtitle)+'</p>':'')
      +price
      +'<div class="of-offer-points"><span>Más potencia</span><span>Más fuerza</span><span>Recuperación</span></div>'
      +'<div class="of-offer-actions">'+link+'<div class="of-offer-shipping"><strong>Envíos gratis</strong> en compras seleccionadas</div></div>'
      +'</div>'
      +'<div class="of-offer-product">'+media+'</div>'
      +'</div>'
      +'</div>';
  }

  function imageHtml(s,i){
    const hasText=!!(s.title||s.subtitle||s.badge||s.link_url);
    const media=s.image_url
      ? '<img src="'+esc(s.image_url)+'" alt="" loading="'+(i===0?'eager':'lazy')+'">'
      : '<div class="of-hero-fallback"></div>';
    const cta=s.link_url?'<a class="of-hero-cta" href="'+esc(s.link_url)+'">'+esc(s.button_text||'Ver promoción')+'</a>':'';
    const overlay=hasText && s.show_overlay!==false?'<div class="of-hero-overlay"></div>':'';
    return '<div class="of-hero-slide of-hero-image-slide '+(i===0?'active':'')+'" data-index="'+i+'" aria-hidden="'+(i===0?'false':'true')+'">'
      +media
      +overlay
      +(s.sticker_text?'<div class="of-hero-sticker">'+esc(s.sticker_text)+'</div>':'')
      +(hasText?'<div class="of-hero-copy-wrap"><div class="of-hero-copy">'
        +(s.badge?'<span class="of-hero-badge">'+esc(s.badge)+'</span>':'')
        +(s.title?'<div class="of-hero-title">'+esc(s.title)+'</div>':'')
        +(s.subtitle?'<p class="of-hero-sub">'+esc(s.subtitle)+'</p>':'')
        +cta+'</div></div>':'')
      +'</div>';
  }

  function slideHtml(s,i){
    return s.display_mode==='offer'?offerHtml(s,i):imageHtml(s,i);
  }

  function render(){
    if(!slides.length){
      viewport.innerHTML='<div class="of-hero-slide of-hero-image-slide active"><div class="of-hero-fallback"></div><div class="of-hero-copy-wrap"><div class="of-hero-copy" style="color:#111;text-shadow:none"><span class="of-hero-badge">Origen Fit</span><div class="of-hero-title">ENERGÍA.<br>FUERZA.<br>ENFOQUE.</div><p class="of-hero-sub">Suplementos deportivos en La Plata.</p><a class="of-hero-cta" href="#productos">Ver productos</a></div></div></div>';
      return;
    }
    viewport.innerHTML=slides.map(slideHtml).join('')+(slides.length>1
      ?'<button class="of-hero-arrow prev" type="button" aria-label="Anterior">‹</button><button class="of-hero-arrow next" type="button" aria-label="Siguiente">›</button><div class="of-hero-dots">'+slides.map((_,i)=>'<button class="of-hero-dot '+(i===0?'active':'')+'" type="button" data-i="'+i+'" aria-label="Ir a imagen '+(i+1)+'"></button>').join('')+'</div>'
      :'');
    viewport.querySelector('.of-hero-arrow.prev')?.addEventListener('click',()=>show(index-1));
    viewport.querySelector('.of-hero-arrow.next')?.addEventListener('click',()=>show(index+1));
    viewport.querySelectorAll('.of-hero-dot').forEach(b=>b.addEventListener('click',()=>show(Number(b.dataset.i))));
  }

  function schedule(){
    clearTimeout(timer);
    if(paused||slides.length<2)return;
    timer=setTimeout(()=>show(index+1),5000);
  }

  function show(next){
    if(!slides.length)return;
    index=(next+slides.length)%slides.length;
    viewport.querySelectorAll('.of-hero-slide').forEach((el,i)=>{
      const on=i===index;
      el.classList.toggle('active',on);
      el.setAttribute('aria-hidden',on?'false':'true');
    });
    viewport.querySelectorAll('.of-hero-dot').forEach((d,i)=>d.classList.toggle('active',i===index));
    schedule();
  }

  viewport.addEventListener('mouseenter',()=>{paused=true;clearTimeout(timer)});
  viewport.addEventListener('mouseleave',()=>{paused=false;schedule()});
  viewport.addEventListener('touchstart',e=>{const t=e.touches?.[0];if(!t)return;x0=t.clientX;y0=t.clientY;},{passive:true});
  viewport.addEventListener('touchend',e=>{const t=e.changedTouches?.[0];if(!t)return;const dx=t.clientX-x0,dy=t.clientY-y0;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.2)show(index+(dx<0?1:-1));},{passive:true});
  document.addEventListener('visibilitychange',()=>{paused=document.hidden;if(paused)clearTimeout(timer);else schedule()});

  (async()=>{
    try{
      if(typeof db==='undefined')throw new Error('Supabase no disponible');
      const {data,error}=await db.from('promotions').select('*').eq('active',true).order('sort_order').order('created_at');
      if(error)throw error;
      slides=(data||[]).filter(x=>x.image_url||x.title||x.subtitle||x.badge);
    }catch(err){
      console.warn('Portada:',err?.message||err);
      slides=[];
    }
    render();
    schedule();
  })();
});

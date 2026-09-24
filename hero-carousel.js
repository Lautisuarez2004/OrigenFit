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
      background:#111!important;
      overflow:hidden!important;
      position:relative!important;
    }
    #promos{display:none!important}
    .of-hero-viewport{
      position:relative;
      width:100%;
      height:clamp(520px,calc(100svh - 170px),760px);
      min-height:520px;
      background:#111;
      overflow:hidden;
    }
    .of-hero-slide{
      position:absolute;
      inset:0;
      opacity:0;
      visibility:hidden;
      pointer-events:none;
      transition:opacity .48s ease,visibility .48s ease;
      background:#111;
    }
    .of-hero-slide.active{
      opacity:1;
      visibility:visible;
      pointer-events:auto;
      z-index:2;
    }
    .of-hero-slide img{
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
        radial-gradient(circle at 78% 30%,rgba(227,6,19,.62),transparent 25%),
        linear-gradient(135deg,#0e0e0f 0%,#171719 58%,#260305 100%);
    }
    .of-hero-overlay{
      position:absolute;
      inset:0;
      z-index:1;
      background:linear-gradient(90deg,rgba(0,0,0,.68) 0%,rgba(0,0,0,.34) 42%,rgba(0,0,0,0) 78%);
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
      box-shadow:0 8px 18px rgba(0,0,0,.18);
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
      min-height:48px;
      margin-top:20px;
      padding:0 21px;
      border-radius:999px;
      background:var(--red,#e30613);
      color:#fff;
      font-size:.86rem;
      font-weight:950;
      letter-spacing:.035em;
      text-transform:uppercase;
      box-shadow:0 10px 24px rgba(0,0,0,.18);
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
      width:48px;
      height:58px;
      margin-top:-29px;
      border:0;
      border-radius:14px;
      display:grid;
      place-items:center;
      background:rgba(255,255,255,.91);
      color:#111;
      box-shadow:0 9px 24px rgba(0,0,0,.14);
      font-size:2rem;
      font-weight:800;
      cursor:pointer;
      touch-action:manipulation;
    }
    .of-hero-arrow.prev{left:18px}
    .of-hero-arrow.next{right:18px}
    .of-hero-dots{
      position:absolute;
      left:50%;
      bottom:17px;
      z-index:12;
      transform:translateX(-50%);
      display:flex;
      gap:8px;
      padding:7px 10px;
      border-radius:999px;
      background:rgba(0,0,0,.20);
      backdrop-filter:blur(7px);
    }
    .of-hero-dot{
      width:9px;
      height:9px;
      padding:0;
      border:0;
      border-radius:50%;
      background:rgba(255,255,255,.60);
      transition:width .18s ease,background .18s ease;
      cursor:pointer;
    }
    .of-hero-dot.active{width:27px;border-radius:999px;background:#fff}
    .of-hero-loading{
      height:100%;
      display:grid;
      place-items:center;
      color:#fff;
      font-weight:900;
      letter-spacing:.08em;
      text-transform:uppercase;
      background:linear-gradient(135deg,#111,#270306);
    }
    @media(max-width:900px){
      .of-hero-viewport{height:clamp(470px,74svh,650px);min-height:470px}
      .of-hero-copy-wrap{width:min(100% - 32px,760px);padding:34px 0 48px}
      .of-hero-copy{width:min(590px,92%)}
      .of-hero-title{font-size:clamp(2.5rem,9vw,4.8rem)}
      .of-hero-arrow{width:42px;height:52px;border-radius:12px}
      .of-hero-arrow.prev{left:10px}.of-hero-arrow.next{right:10px}
    }
    @media(max-width:650px){
      .of-hero-viewport{height:clamp(430px,68svh,590px);min-height:430px}
      .of-hero-copy-wrap{width:calc(100% - 28px);padding:30px 0 48px}
      .of-hero-copy{width:92%}
      .of-hero-title{font-size:clamp(2.05rem,11vw,3.8rem);line-height:.92}
      .of-hero-sub{font-size:.95rem}
      .of-hero-badge{font-size:.68rem;padding:6px 10px}
      .of-hero-cta{min-height:44px;margin-top:16px;padding:0 17px;font-size:.78rem}
      .of-hero-sticker{top:18px;right:-64px;min-width:235px;padding:9px 65px;font-size:.68rem}
      .of-hero-arrow{width:36px;height:46px;border-radius:10px;background:rgba(17,17,17,.60);color:#fff;box-shadow:none}
      .of-hero-arrow.prev{left:5px}.of-hero-arrow.next{right:5px}
      .of-hero-dots{bottom:11px;padding:6px 8px}
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

  function slideHtml(s,i){
    const hasText=!!(s.title||s.subtitle||s.badge||s.link_url);
    const media=s.image_url
      ? '<img src="'+esc(s.image_url)+'" alt="" loading="'+(i===0?'eager':'lazy')+'">'
      : '<div class="of-hero-fallback"></div>';
    const cta=s.link_url?'<a class="of-hero-cta" href="'+esc(s.link_url)+'">Ver promoción</a>':'';
    return '<div class="of-hero-slide '+(i===0?'active':'')+'" data-index="'+i+'" aria-hidden="'+(i===0?'false':'true')+'">'
      +media
      +(hasText?'<div class="of-hero-overlay"></div>':'')
      +(s.sticker_text?'<div class="of-hero-sticker">'+esc(s.sticker_text)+'</div>':'')
      +(hasText?'<div class="of-hero-copy-wrap"><div class="of-hero-copy">'
        +(s.badge?'<span class="of-hero-badge">'+esc(s.badge)+'</span>':'')
        +(s.title?'<div class="of-hero-title">'+esc(s.title)+'</div>':'')
        +(s.subtitle?'<p class="of-hero-sub">'+esc(s.subtitle)+'</p>':'')
        +cta+'</div></div>':'')
      +'</div>';
  }

  function render(){
    if(!slides.length){
      viewport.innerHTML='<div class="of-hero-slide active"><div class="of-hero-fallback"></div><div class="of-hero-overlay"></div><div class="of-hero-copy-wrap"><div class="of-hero-copy"><span class="of-hero-badge">Origen Fit</span><div class="of-hero-title">ENERGÍA.<br>FUERZA.<br>ENFOQUE.</div><p class="of-hero-sub">Suplementos deportivos en La Plata.</p><a class="of-hero-cta" href="#productos">Ver productos</a></div></div></div>';
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

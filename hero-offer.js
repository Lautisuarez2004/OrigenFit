/* Origen Fit · oferta destacada integrada al hero. */
document.addEventListener('DOMContentLoaded',()=>{
  const slot=document.querySelector('.hero-logo-wrap');
  if(!slot)return;

  const money=n=>'$'+Number(n).toLocaleString('es-AR');
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const style=document.createElement('style');
  style.id='of-hero-offer-style';
  style.textContent=`
    @media(min-width:901px){
      .hero-grid{align-items:start!important}
      .hero-logo-wrap.hero-offer-slot{
        align-items:flex-start!important;
        justify-content:flex-end!important;
        padding-top:26px!important;
      }
    }

    .hero-logo-wrap.hero-offer-slot{
      min-height:0!important;
      display:flex!important;
      justify-content:flex-end!important;
    }

    .of-hero-deal{
      position:relative;
      width:min(100%,540px);
      color:#111;
      background:transparent;
      border:0;
      border-radius:0;
      box-shadow:none;
      overflow:visible;
      display:block;
    }

    .of-hero-deal-top{
      margin:0 0 8px;
      padding:0;
      background:transparent;
      color:var(--red,#e30613);
      font-size:clamp(1.45rem,2.2vw,2rem);
      line-height:.95;
      font-weight:1000;
      letter-spacing:-.035em;
      text-transform:uppercase;
    }

    .of-hero-deal-discount{
      position:absolute;
      top:52px;
      right:10px;
      width:78px;
      height:78px;
      border-radius:50%;
      background:var(--red,#e30613);
      color:#fff;
      display:grid;
      place-items:center;
      font-size:1.35rem;
      font-weight:1000;
      line-height:1;
      box-shadow:0 10px 24px rgba(227,6,19,.22);
      z-index:3;
    }

    .of-hero-deal-art{
      height:345px;
      background:transparent;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:0;
      overflow:visible;
    }

    .of-hero-deal-art img{
      display:block;
      width:94%;
      height:94%;
      object-fit:contain;
      object-position:center;
      filter:drop-shadow(0 20px 22px rgba(0,0,0,.16));
      mix-blend-mode:multiply;
    }

    .of-hero-deal-copy{
      padding:0 6px 0;
      text-align:left;
    }

    .of-hero-deal-meta{
      display:flex;
      align-items:center;
      flex-wrap:wrap;
      gap:8px 12px;
      margin:0 0 7px;
      color:#555;
      font-size:.8rem;
      font-weight:900;
      text-transform:uppercase;
      letter-spacing:.035em;
    }

    .of-hero-deal-meta .ship{color:#158a38}
    .of-hero-deal-meta .sale{color:var(--red,#e30613)}
    .of-hero-deal-meta span+span:before{
      content:"•";
      margin-right:12px;
      color:#a5a5aa;
    }

    .of-hero-deal h2{
      margin:0 0 10px;
      max-width:500px;
      color:#111;
      font-size:clamp(1.35rem,2.25vw,1.85rem);
      line-height:1.03;
      letter-spacing:-.045em;
    }

    .of-hero-price-row{
      display:flex;
      align-items:end;
      gap:12px;
      flex-wrap:wrap;
      margin:0 0 5px;
    }

    .of-hero-price{
      color:var(--red,#e30613);
      font-size:clamp(2.15rem,4vw,2.85rem);
      line-height:.9;
      font-weight:1000;
      letter-spacing:-.055em;
    }

    .of-hero-old{
      color:#84868c;
      font-size:1rem;
      font-weight:850;
      text-decoration:line-through;
      padding-bottom:3px;
    }

    .of-hero-saving{
      margin:8px 0 14px;
      color:#4f5157;
      font-size:.9rem;
      font-weight:750;
    }

    .of-hero-saving strong{color:#111}

    .of-hero-deal-cta{
      width:max-content;
      min-height:48px;
      padding:0 20px;
      border-radius:999px;
      background:#111;
      color:#fff;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      gap:14px;
      font-size:.82rem;
      font-weight:1000;
      letter-spacing:.04em;
      text-transform:uppercase;
      transition:transform .16s ease,background .16s ease;
    }

    .of-hero-deal:hover .of-hero-deal-cta{
      transform:translateY(-1px);
      background:var(--red,#e30613);
    }

    .of-hero-deal-cta span:last-child{font-size:1.3rem}

    .of-hero-offer-loading{
      width:min(100%,540px);
      min-height:420px;
      display:grid;
      place-items:center;
      color:#777;
      font-size:.8rem;
      font-weight:900;
      letter-spacing:.08em;
      text-transform:uppercase;
      background:transparent;
      border:0;
    }

    @media(max-width:900px){
      .hero-logo-wrap.hero-offer-slot{
        justify-content:center!important;
        align-items:flex-start!important;
        padding-top:0!important;
      }
      .of-hero-deal{width:min(100%,570px)}
      .of-hero-deal-art{height:320px}
      .of-hero-deal-art img{width:96%;height:96%}
    }

    @media(max-width:650px){
      .hero{padding-bottom:26px!important}
      .hero-grid{gap:24px!important}
      .hero-logo-wrap.hero-offer-slot{min-height:0!important}

      .of-hero-deal-top{
        font-size:1.35rem;
        margin-bottom:5px;
      }

      .of-hero-deal-discount{
        width:66px;
        height:66px;
        top:42px;
        right:2px;
        font-size:1.12rem;
      }

      .of-hero-deal-art{
        height:285px;
        margin:0 -4px;
      }

      .of-hero-deal-art img{
        width:100%;
        height:100%;
        filter:drop-shadow(0 16px 18px rgba(0,0,0,.14));
      }

      .of-hero-deal-copy{padding:0}
      .of-hero-deal-meta{font-size:.72rem;gap:6px 9px}
      .of-hero-deal-meta span+span:before{margin-right:9px}
      .of-hero-deal h2{font-size:1.28rem;margin-bottom:9px}
      .of-hero-price{font-size:2.1rem}
      .of-hero-old{font-size:.9rem}
      .of-hero-saving{margin:7px 0 12px;font-size:.84rem}
      .of-hero-deal-cta{min-height:46px;padding:0 18px}
      .of-hero-offer-loading{min-height:350px}
    }
  `;
  document.head.appendChild(style);

  slot.classList.add('hero-offer-slot');
  slot.innerHTML='<div class="of-hero-offer-loading">Buscando la mejor oferta…</div>';

  const render=async()=>{
    try{
      if(typeof db==='undefined')throw new Error('Catálogo todavía no disponible');

      const {data,error}=await db
        .from('products')
        .select('id,name,brand,category,price,promo_price,stock,image_url,free_shipping,promo_label,featured')
        .eq('visible',true)
        .gt('stock',0)
        .not('promo_price','is',null)
        .limit(80);

      if(error)throw error;

      const candidates=(data||[])
        .filter(p=>Number(p.promo_price)>0&&Number(p.price)>Number(p.promo_price)&&p.image_url);

      if(!candidates.length)throw new Error('No hay productos en oferta');

      const categoryScore=c=>{
        const s=String(c||'').toLowerCase();
        if(s.includes('prote'))return 100;
        if(s.includes('creatina'))return 90;
        return 0;
      };

      candidates.sort((a,b)=>{
        const da=(Number(a.price)-Number(a.promo_price))/Number(a.price)*100;
        const dbb=(Number(b.price)-Number(b.promo_price))/Number(b.price)*100;
        return (categoryScore(b.category)+(b.featured?30:0)+dbb)-
               (categoryScore(a.category)+(a.featured?30:0)+da);
      });

      const p=candidates[0];
      const regular=Number(p.price);
      const promo=Number(p.promo_price);
      const saving=regular-promo;
      const discount=Math.max(1,Math.round((saving/regular)*100));
      const message='Hola! Quiero aprovechar la oferta de '+p.name+' ('+money(promo)+'). ¿Hay stock disponible?';
      const wa='https://wa.me/542216187020?text='+encodeURIComponent(message);

      slot.innerHTML=`
        <a class="of-hero-deal" href="${wa}" target="_blank" rel="noopener" aria-label="Consultar oferta de ${esc(p.name)} por WhatsApp">
          <div class="of-hero-deal-top">🔥 OFERTA DESTACADA</div>
          <div class="of-hero-deal-discount">-${discount}%</div>
          <div class="of-hero-deal-art">
            <img src="${esc(p.image_url)}" alt="${esc(p.name)}">
          </div>
          <div class="of-hero-deal-copy">
            <div class="of-hero-deal-meta">
              <span class="sale">Precio especial</span>
              ${p.free_shipping?'<span class="ship">Envío gratis</span>':''}
              <span>Stock: ${Number(p.stock)}</span>
            </div>
            <h2>${esc(p.name)}</h2>
            <div class="of-hero-price-row">
              <span class="of-hero-price">${money(promo)}</span>
              <span class="of-hero-old">${money(regular)}</span>
            </div>
            <div class="of-hero-saving">Ahorrás <strong>${money(saving)}</strong> · ${esc(p.promo_label||'Oferta vigente')}</div>
            <div class="of-hero-deal-cta"><span>Quiero esta oferta</span><span>→</span></div>
          </div>
        </a>
      `;
    }catch(err){
      console.warn('Oferta del hero:',err?.message||err);
      slot.innerHTML='<img class="hero-logo" src="logo-principal.png" alt="Origen Fit">';
    }
  };

  render();
});

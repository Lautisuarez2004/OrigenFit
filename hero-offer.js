/* Origen Fit · oferta destacada en el hero.
 * Usa un producto real con promo/stock desde Supabase y no altera el catálogo.
 */
document.addEventListener('DOMContentLoaded',()=>{
  const slot=document.querySelector('.hero-logo-wrap');
  if(!slot)return;

  const money=n=>'$'+Number(n).toLocaleString('es-AR');
  const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const style=document.createElement('style');
  style.id='of-hero-offer-style';
  style.textContent=`
    .hero-logo-wrap.hero-offer-slot{
      min-height:0!important;
      display:flex!important;
      align-items:center!important;
      justify-content:flex-end!important;
    }
    .of-hero-deal{
      position:relative;
      width:min(100%,480px);
      background:#111;
      color:#fff;
      border-radius:30px;
      overflow:hidden;
      box-shadow:0 28px 58px rgba(17,17,17,.24);
      border:1px solid rgba(0,0,0,.08);
      isolation:isolate;
    }
    .of-hero-deal:before{
      content:"";
      position:absolute;
      width:220px;height:220px;
      right:-90px;bottom:-110px;
      border-radius:50%;
      background:rgba(227,6,19,.28);
      z-index:-1;
    }
    .of-hero-deal-top{
      min-height:46px;
      padding:0 86px 0 18px;
      background:var(--red,#e30613);
      display:flex;
      align-items:center;
      font-size:.76rem;
      font-weight:950;
      letter-spacing:.11em;
      text-transform:uppercase;
    }
    .of-hero-deal-discount{
      position:absolute;
      top:10px;right:12px;
      min-width:62px;height:62px;
      padding:0 8px;
      border-radius:50%;
      background:#fff;
      color:#111;
      display:grid;
      place-items:center;
      font-size:1.12rem;
      font-weight:1000;
      line-height:1;
      box-shadow:0 8px 20px rgba(0,0,0,.18);
      z-index:3;
    }
    .of-hero-deal-art{
      height:255px;
      background:#fff;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:18px 26px 12px;
    }
    .of-hero-deal-art img{
      display:block;
      width:100%;height:100%;
      object-fit:contain;
      object-position:center;
      filter:drop-shadow(0 14px 15px rgba(0,0,0,.12));
    }
    .of-hero-deal-copy{padding:20px 22px 22px}
    .of-hero-deal-alert{
      display:flex;
      align-items:center;
      flex-wrap:wrap;
      gap:7px;
      margin-bottom:10px;
    }
    .of-hero-chip{
      display:inline-flex;
      align-items:center;
      min-height:27px;
      padding:5px 9px;
      border-radius:999px;
      font-size:.69rem;
      line-height:1;
      font-weight:950;
      letter-spacing:.04em;
      text-transform:uppercase;
    }
    .of-hero-chip.sale{background:#ffe5e7;color:#c4000b}
    .of-hero-chip.ship{background:#27aa4b;color:#fff}
    .of-hero-chip.stock{background:#2b2b2e;color:#fff;border:1px solid #3c3c40}
    .of-hero-deal h2{
      margin:0 0 13px;
      font-size:clamp(1.35rem,2.3vw,1.85rem);
      line-height:1.02;
      letter-spacing:-.045em;
      color:#fff;
    }
    .of-hero-price-row{
      display:flex;
      align-items:end;
      gap:11px;
      flex-wrap:wrap;
      margin-bottom:5px;
    }
    .of-hero-price{
      color:#ff202d;
      font-size:clamp(2rem,4vw,2.65rem);
      line-height:.9;
      font-weight:1000;
      letter-spacing:-.05em;
    }
    .of-hero-old{
      color:#a7a7ad;
      font-size:1rem;
      font-weight:800;
      text-decoration:line-through;
      padding-bottom:3px;
    }
    .of-hero-saving{
      margin:8px 0 16px;
      color:#ddd;
      font-size:.87rem;
      font-weight:750;
    }
    .of-hero-saving strong{color:#fff}
    .of-hero-deal-cta{
      width:100%;
      min-height:48px;
      padding:0 16px;
      border-radius:14px;
      background:#fff;
      color:#111;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      font-size:.82rem;
      font-weight:1000;
      letter-spacing:.04em;
      text-transform:uppercase;
      transition:transform .16s ease,background .16s ease;
    }
    .of-hero-deal:hover .of-hero-deal-cta{transform:translateY(-1px);background:#f3f3f4}
    .of-hero-deal-cta span:last-child{font-size:1.35rem}
    .of-hero-offer-loading{
      width:min(100%,480px);
      min-height:390px;
      border-radius:30px;
      border:1px solid #eee;
      background:rgba(255,255,255,.72);
      display:grid;
      place-items:center;
      color:#777;
      font-size:.8rem;
      font-weight:900;
      letter-spacing:.08em;
      text-transform:uppercase;
    }
    @media(max-width:900px){
      .hero-logo-wrap.hero-offer-slot{justify-content:center!important}
      .of-hero-deal{width:min(100%,540px)}
    }
    @media(max-width:650px){
      .hero{padding-bottom:30px!important}
      .hero-grid{gap:26px!important}
      .hero-logo-wrap.hero-offer-slot{min-height:0!important}
      .of-hero-deal{border-radius:24px}
      .of-hero-deal-top{min-height:42px;padding-left:15px;font-size:.7rem}
      .of-hero-deal-discount{width:56px;height:56px;min-width:56px;top:8px;right:10px;font-size:1rem}
      .of-hero-deal-art{height:215px;padding:14px 18px 10px}
      .of-hero-deal-copy{padding:17px}
      .of-hero-deal h2{font-size:1.28rem;margin-bottom:11px}
      .of-hero-price{font-size:2rem}
      .of-hero-old{font-size:.9rem}
      .of-hero-saving{margin:7px 0 13px}
      .of-hero-deal-cta{min-height:46px}
      .of-hero-offer-loading{min-height:330px;border-radius:24px}
    }
  `;
  document.head.appendChild(style);

  slot.classList.add('hero-offer-slot');
  slot.innerHTML='<div class="of-hero-offer-loading">Buscando la mejor oferta…</div>';

  const render=async()=>{
    try{
      if(typeof db==='undefined') throw new Error('Catálogo todavía no disponible');

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
        const sa=categoryScore(a.category)+(a.featured?30:0)+da;
        const sb=categoryScore(b.category)+(b.featured?30:0)+dbb;
        return sb-sa;
      });

      const p=candidates[0];
      const regular=Number(p.price);
      const promo=Number(p.promo_price);
      const saving=regular-promo;
      const discount=Math.max(1,Math.round((saving/regular)*100));
      const message='Hola! Quiero aprovechar la oferta de '+p.name+' ('+money(promo)+'). ¿Hay stock disponible?';
      const wa='https://wa.me/542216187020?text='+encodeURIComponent(message);

      slot.innerHTML=`
        <a class="of-hero-deal" href="${wa}" target="_blank" rel="noopener" aria-label="Consultar oferta de ${escapeHtml(p.name)} por WhatsApp">
          <div class="of-hero-deal-top">🔥 OFERTA DESTACADA</div>
          <div class="of-hero-deal-discount">-${discount}%</div>
          <div class="of-hero-deal-art">
            <img src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.name)}">
          </div>
          <div class="of-hero-deal-copy">
            <div class="of-hero-deal-alert">
              <span class="of-hero-chip sale">Precio especial</span>
              ${p.free_shipping?'<span class="of-hero-chip ship">Envío gratis</span>':''}
              <span class="of-hero-chip stock">Stock: ${Number(p.stock)}</span>
            </div>
            <h2>${escapeHtml(p.name)}</h2>
            <div class="of-hero-price-row">
              <span class="of-hero-price">${money(promo)}</span>
              <span class="of-hero-old">${money(regular)}</span>
            </div>
            <div class="of-hero-saving">Ahorrás <strong>${money(saving)}</strong> · ${escapeHtml(p.promo_label||'Oferta vigente')}</div>
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

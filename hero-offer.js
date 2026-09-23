/* Origen Fit · oferta destacada configurable desde Admin. */
document.addEventListener('DOMContentLoaded',()=>{
  const slot=document.querySelector('.hero-logo-wrap');
  if(!slot)return;

  const money=n=>'$'+Number(n).toLocaleString('es-AR');
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const hex=(v,fallback)=>/^#[0-9a-f]{6}$/i.test(String(v||''))?String(v):fallback;

  const defaults={
    enabled:true,
    product_id:null,
    headline:'🔥 OFERTA DESTACADA',
    sale_text:'Precio especial',
    cta_text:'Quiero esta oferta',
    image_url:null,
    headline_color:'#e30613',
    title_color:'#111111',
    price_color:'#e30613',
    old_price_color:'#84868c',
    sale_color:'#e30613',
    shipping_color:'#158a38',
    meta_color:'#555555',
    saving_color:'#4f5157',
    discount_bg:'#e30613',
    discount_text_color:'#ffffff',
    button_bg:'#111111',
    button_text_color:'#ffffff',
    desktop_top:18,
    image_height_desktop:340,
    image_height_mobile:265,
    show_discount:true,
    show_stock:true,
    show_shipping:true,
    show_saving:true
  };

  const style=document.createElement('style');
  style.id='of-hero-offer-style';
  style.textContent=`
    .hero-grid{
      align-items:start!important;
      position:relative!important;
    }

    .hero-logo-wrap.hero-offer-slot{
      min-height:0!important;
      display:flex!important;
      align-items:flex-start!important;
      justify-content:flex-end!important;
      padding-top:0!important;
      position:relative!important;
      z-index:8!important;
    }

    .of-hero-deal{
      position:relative;
      width:min(100%,560px);
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
      color:var(--of-headline,#e30613);
      font-size:clamp(1.28rem,1.9vw,1.75rem);
      line-height:.95;
      font-weight:1000;
      letter-spacing:-.04em;
      text-transform:uppercase;
    }

    .of-hero-deal-discount{
      position:absolute;
      top:54px;
      right:4px;
      width:66px;
      height:66px;
      border-radius:50%;
      background:var(--of-discount-bg,#e30613);
      color:var(--of-discount-text,#fff);
      display:grid;
      place-items:center;
      font-size:1.1rem;
      font-weight:1000;
      line-height:1;
      box-shadow:0 10px 24px rgba(0,0,0,.10);
      z-index:15;
    }

    .of-hero-deal-art{
      height:var(--of-img-desktop,340px);
      background:transparent!important;
      border:0!important;
      box-shadow:none!important;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:0;
      overflow:visible;
      position:relative;
      isolation:isolate;
      z-index:10;
    }

    /* Imagen normal. Para verla sin fondo, subir PNG transparente desde Admin. */
    .of-hero-deal-art img{
      position:relative;
      z-index:12;
      display:block;
      width:100%;
      height:100%;
      object-fit:contain;
      object-position:center;
      background:transparent!important;
      mix-blend-mode:normal!important;
      filter:drop-shadow(0 18px 18px rgba(0,0,0,.13));
    }

    .of-hero-deal-copy{padding:0;text-align:left}

    .of-hero-deal-meta{
      display:flex;
      align-items:center;
      flex-wrap:wrap;
      gap:8px 12px;
      margin:0 0 7px;
      color:var(--of-meta,#555);
      font-size:.76rem;
      font-weight:900;
      text-transform:uppercase;
      letter-spacing:.035em;
    }
    .of-hero-deal-meta .ship{color:var(--of-shipping,#158a38)}
    .of-hero-deal-meta .sale{color:var(--of-sale,#e30613)}
    .of-hero-deal-meta span+span:before{
      content:"•";
      margin-right:12px;
      color:#a5a5aa;
    }

    .of-hero-deal h2{
      margin:0 0 10px;
      max-width:520px;
      color:var(--of-title,#111);
      font-size:clamp(1.18rem,1.85vw,1.58rem);
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
      color:var(--of-price,#e30613);
      font-size:clamp(1.85rem,3.2vw,2.45rem);
      line-height:.9;
      font-weight:1000;
      letter-spacing:-.055em;
    }
    .of-hero-old{
      color:var(--of-old,#84868c);
      font-size:.92rem;
      font-weight:850;
      text-decoration:line-through;
      padding-bottom:3px;
    }
    .of-hero-saving{
      margin:8px 0 14px;
      color:var(--of-saving,#4f5157);
      font-size:.84rem;
      font-weight:750;
    }
    .of-hero-saving strong{color:var(--of-title,#111)}

    .of-hero-deal-cta{
      width:max-content;
      min-height:40px;
      padding:0 16px;
      border-radius:999px;
      background:var(--of-button-bg,#111);
      color:var(--of-button-text,#fff);
      display:inline-flex;
      align-items:center;
      justify-content:center;
      gap:14px;
      font-size:.76rem;
      font-weight:1000;
      letter-spacing:.04em;
      text-transform:uppercase;
      transition:transform .16s ease,opacity .16s ease;
    }
    .of-hero-deal:hover .of-hero-deal-cta{transform:translateY(-1px);opacity:.9}
    .of-hero-deal-cta span:last-child{font-size:1.3rem}

    .of-hero-offer-loading{
      width:min(100%,560px);
      min-height:440px;
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

    @media(min-width:901px){
      .hero-grid{min-height:505px!important}
      .hero-logo-wrap.hero-offer-slot{
        position:absolute!important;
        top:var(--of-top,18px)!important;
        right:0!important;
        width:calc((100% - 44px)/2)!important;
        margin:0!important;
        padding:0!important;
        transform:none!important;
        z-index:12!important;
      }
      .of-hero-deal{
        width:100%!important;
        max-width:560px!important;
        margin-left:auto!important;
      }
    }

    @media(max-width:900px){
      .hero-grid{min-height:0!important}
      .hero-logo-wrap.hero-offer-slot{
        position:relative!important;
        top:auto!important;
        right:auto!important;
        width:auto!important;
        margin:0!important;
        justify-content:center!important;
        padding-top:0!important;
      }
      .of-hero-deal{width:min(100%,590px)}
      .of-hero-deal-art{height:var(--of-img-mobile,265px)}
    }

    @media(max-width:650px){
      .hero{padding-bottom:28px!important}
      .hero-grid{gap:23px!important}
      .hero-logo-wrap.hero-offer-slot{min-height:0!important}
      .of-hero-deal-top{font-size:1.2rem;margin-bottom:4px}
      .of-hero-deal-discount{
        width:56px;height:56px;top:40px;right:0;font-size:.96rem
      }
      .of-hero-deal-art{height:var(--of-img-mobile,265px);margin:0 -6px}
      .of-hero-deal-copy{padding:0}
      .of-hero-deal-meta{font-size:.72rem;gap:6px 9px}
      .of-hero-deal-meta span+span:before{margin-right:9px}
      .of-hero-deal h2{font-size:1.08rem;margin-bottom:7px}
      .of-hero-price{font-size:1.8rem}
      .of-hero-old{font-size:.84rem}
      .of-hero-saving{margin:6px 0 10px;font-size:.78rem}
      .of-hero-deal-cta{min-height:39px;padding:0 15px}
      .of-hero-offer-loading{min-height:365px}
    }
  `;
  document.head.appendChild(style);

  slot.classList.add('hero-offer-slot');
  slot.innerHTML='<div class="of-hero-offer-loading">Cargando oferta…</div>';

  const getSettings=async()=>{
    try{
      const {data,error}=await db.from('hero_offer_settings').select('*').eq('id',1).maybeSingle();
      if(error)throw error;
      return {...defaults,...(data||{})};
    }catch(err){
      console.warn('Configuración oferta:',err?.message||err);
      return {...defaults};
    }
  };

  const chooseProduct=async settings=>{
    let query=db.from('products')
      .select('id,name,brand,category,price,promo_price,stock,image_url,free_shipping,promo_label,featured')
      .eq('visible',true)
      .gt('stock',0);

    if(settings.product_id){
      const {data,error}=await query.eq('id',settings.product_id).maybeSingle();
      if(!error&&data)return data;
    }

    const {data,error}=await db.from('products')
      .select('id,name,brand,category,price,promo_price,stock,image_url,free_shipping,promo_label,featured')
      .eq('visible',true)
      .gt('stock',0)
      .not('promo_price','is',null)
      .limit(80);
    if(error)throw error;

    const candidates=(data||[]).filter(p=>Number(p.promo_price)>0&&Number(p.price)>Number(p.promo_price));
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
    return candidates[0];
  };

  const render=async()=>{
    try{
      if(typeof db==='undefined')throw new Error('Catálogo todavía no disponible');

      const settings=await getSettings();
      if(settings.enabled===false){
        slot.innerHTML='<img class="hero-logo" src="logo-principal.png" alt="Origen Fit">';
        return;
      }

      const p=await chooseProduct(settings);
      const regular=Number(p.price);
      const promo=Number(p.promo_price)>0?Number(p.promo_price):regular;
      const saving=Math.max(0,regular-promo);
      const discount=regular>0?Math.max(0,Math.round((saving/regular)*100)):0;
      const image=settings.image_url||p.image_url||'';
      const message='Hola! Quiero aprovechar la oferta de '+p.name+' ('+money(promo)+'). ¿Hay stock disponible?';
      const wa='https://wa.me/542216187020?text='+encodeURIComponent(message);

      slot.style.setProperty('--of-top',Math.max(-20,Math.min(120,Number(settings.desktop_top)||18))+'px');
      slot.style.setProperty('--of-img-desktop',Math.max(220,Math.min(650,Number(settings.image_height_desktop)||340))+'px');
      slot.style.setProperty('--of-img-mobile',Math.max(200,Math.min(520,Number(settings.image_height_mobile)||265))+'px');

      slot.innerHTML=`
        <a class="of-hero-deal" href="${wa}" target="_blank" rel="noopener" aria-label="Consultar oferta de ${esc(p.name)} por WhatsApp">
          <div class="of-hero-deal-top">${esc(settings.headline||defaults.headline)}</div>
          ${settings.show_discount&&discount>0?'<div class="of-hero-deal-discount">-'+discount+'%</div>':''}
          <div class="of-hero-deal-art">
            ${image?'<img src="'+esc(image)+'" alt="'+esc(p.name)+'">':''}
          </div>
          <div class="of-hero-deal-copy">
            <div class="of-hero-deal-meta">
              <span class="sale">${esc(settings.sale_text||defaults.sale_text)}</span>
              ${settings.show_shipping&&p.free_shipping?'<span class="ship">Envío gratis</span>':''}
              ${settings.show_stock?'<span>Stock: '+Number(p.stock)+'</span>':''}
            </div>
            <h2>${esc(p.name)}</h2>
            <div class="of-hero-price-row">
              <span class="of-hero-price">${money(promo)}</span>
              ${promo<regular?'<span class="of-hero-old">'+money(regular)+'</span>':''}
            </div>
            ${settings.show_saving&&saving>0?'<div class="of-hero-saving">Ahorrás <strong>'+money(saving)+'</strong> · '+esc(p.promo_label||'Efectivo/Transferencia')+'</div>':''}
            <div class="of-hero-deal-cta"><span>${esc(settings.cta_text||defaults.cta_text)}</span><span>→</span></div>
          </div>
        </a>
      `;

      const deal=slot.querySelector('.of-hero-deal');
      if(deal){
        deal.style.setProperty('--of-headline',hex(settings.headline_color,defaults.headline_color));
        deal.style.setProperty('--of-title',hex(settings.title_color,defaults.title_color));
        deal.style.setProperty('--of-price',hex(settings.price_color,defaults.price_color));
        deal.style.setProperty('--of-old',hex(settings.old_price_color,defaults.old_price_color));
        deal.style.setProperty('--of-sale',hex(settings.sale_color,defaults.sale_color));
        deal.style.setProperty('--of-shipping',hex(settings.shipping_color,defaults.shipping_color));
        deal.style.setProperty('--of-meta',hex(settings.meta_color,defaults.meta_color));
        deal.style.setProperty('--of-saving',hex(settings.saving_color,defaults.saving_color));
        deal.style.setProperty('--of-discount-bg',hex(settings.discount_bg,defaults.discount_bg));
        deal.style.setProperty('--of-discount-text',hex(settings.discount_text_color,defaults.discount_text_color));
        deal.style.setProperty('--of-button-bg',hex(settings.button_bg,defaults.button_bg));
        deal.style.setProperty('--of-button-text',hex(settings.button_text_color,defaults.button_text_color));
      }
    }catch(err){
      console.warn('Oferta del hero:',err?.message||err);
      slot.innerHTML='<img class="hero-logo" src="logo-principal.png" alt="Origen Fit">';
    }
  };

  render();
});

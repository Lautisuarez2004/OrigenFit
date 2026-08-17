/* Origen Fit · carrito compartido de productos y combos + sabores de producto */
document.addEventListener('DOMContentLoaded',async()=>{
  if(typeof db==='undefined')return;
  const isStore=!!document.getElementById('grid')||!!document.getElementById('comboGrid');
  const isDetail=document.body?.dataset?.productDetail==='1'||document.body?.dataset?.comboDetail==='1';
  if(!isStore&&!isDetail)return;

  const CART_KEY='origenfit-cart-v1';
  const fmt=n=>'$'+Number(n||0).toLocaleString('es-AR',{maximumFractionDigits:2});
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
  const baseKey=(type,id)=>`${type}:${id}`;
  const lineKey=x=>`${x.type}:${x.id}:${encodeURIComponent(x.flavor||'')}`;
  const normalizeFlavor=s=>String(s||'').trim();
  let products=[],combos=[],itemsByKey=new Map(),cart=[];

  try{
    const [{data:pd,error:pe},{data:cd,error:ce}]=await Promise.all([
      db.from('products').select('id,name,brand,category,price,promo_price,promo_label,stock,image_url,free_shipping,flavors_enabled,flavors,visible').eq('visible',true),
      db.from('combos').select('id,name,price,promo_price,promo_label,stock,image_url,free_shipping,visible').eq('visible',true)
    ]);
    if(pe)throw pe;if(ce)throw ce;
    products=(pd||[]).map(x=>({...x,type:'product'}));
    combos=(cd||[]).map(x=>({...x,type:'combo'}));
    itemsByKey=new Map([...products,...combos].map(x=>[baseKey(x.type,x.id),x]));
  }catch(err){console.warn('Carrito Origen Fit:',err?.message||err);return;}

  const itemFor=x=>itemsByKey.get(baseKey(x.type,x.id));
  const validFlavors=p=>Array.isArray(p?.flavors)?p.flavors.map(normalizeFlavor).filter(Boolean):[];
  const needsFlavor=p=>p?.type==='product'&&!!p.flavors_enabled&&validFlavors(p).length>0;
  const isPromo=p=>p?.promo_price!=null&&Number(p.promo_price)>0&&(p.price==null||Number(p.promo_price)<Number(p.price));
  const priceOf=p=>isPromo(p)?Number(p.promo_price):Number(p.price||0);

  try{
    const saved=JSON.parse(localStorage.getItem(CART_KEY)||'[]');
    if(Array.isArray(saved))cart=saved.map(x=>({type:x.type==='combo'?'combo':'product',id:String(x.id||''),quantity:Number(x.quantity),flavor:normalizeFlavor(x.flavor)})).filter(x=>x.id&&itemsByKey.has(baseKey(x.type,x.id))&&Number.isFinite(x.quantity)&&x.quantity>0);
  }catch(_){cart=[];}

  const save=()=>localStorage.setItem(CART_KEY,JSON.stringify(cart));
  const totalForBase=(type,id)=>cart.filter(x=>x.type===type&&x.id===id).reduce((s,x)=>s+Number(x.quantity||0),0);
  const prune=()=>{
    const used=new Map(),next=[];
    for(const x of cart){
      const p=itemFor(x);if(!p||Number(p.stock)<=0)continue;
      x.flavor=normalizeFlavor(x.flavor);
      if(needsFlavor(p)&&!validFlavors(p).includes(x.flavor))continue;
      if(!needsFlavor(p))x.flavor='';
      const k=baseKey(x.type,x.id),available=Number(p.stock)-(used.get(k)||0);
      if(available<=0)continue;
      x.quantity=Math.max(1,Math.min(Number(x.quantity)||1,available));
      used.set(k,(used.get(k)||0)+x.quantity);next.push(x);
    }
    cart=next;save();
  };
  const count=()=>cart.reduce((s,x)=>s+x.quantity,0);
  const total=()=>cart.reduce((s,x)=>{const p=itemFor(x);return s+(p?priceOf(p)*x.quantity:0);},0);
  prune();

  const style=document.createElement('style');
  style.textContent=`
    .products .product-card-link .desc,.combos-grid .combo-card .combo-desc{display:none!important}
    .of-stock-badge,.of-free-shipping{display:inline-flex;align-items:center;border-radius:999px;padding:6px 10px;font-size:.73rem;font-weight:950}.of-stock-badge{background:#111;color:#fff}.of-stock-badge.out{background:#f3dfe1;color:#9b2028}.of-free-shipping{background:#e9f7ef;color:#14743a}.of-card-flags{display:flex;gap:7px;flex-wrap:wrap;margin:10px 0}.of-promo-label{font-size:.72rem;line-height:1.2;color:#666971;font-weight:850;margin:6px 0 0;text-align:right}.products .product-card-link .tags{margin-top:14px}
    .of-add-cart{width:100%;border:0;border-radius:999px;padding:11px 14px;background:#111;color:#fff;font-weight:950;margin-top:12px}.of-add-cart:disabled{background:#d9d9dd;color:#777;cursor:not-allowed}
    .of-cart-fab{position:fixed;right:20px;bottom:20px;z-index:120;border:0;border-radius:999px;background:var(--red,#e30613);color:#fff;padding:14px 18px;font-weight:950;box-shadow:0 14px 32px rgba(0,0,0,.26);display:flex;gap:8px;align-items:center}.of-cart-count{min-width:24px;height:24px;border-radius:99px;background:#fff;color:var(--red,#e30613);display:grid;place-items:center;font-size:.78rem}
    .of-cart-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:125;opacity:0;visibility:hidden;transition:.2s}.of-cart-backdrop.open{opacity:1;visibility:visible}.of-cart{position:fixed;right:0;top:0;bottom:0;width:min(430px,94vw);background:#fff;z-index:130;transform:translateX(102%);transition:.23s;display:flex;flex-direction:column;box-shadow:-18px 0 45px rgba(0,0,0,.24)}.of-cart.open{transform:none}
    .of-cart-head{background:#111;color:#fff;padding:20px;display:flex;justify-content:space-between;align-items:center}.of-cart-head h3{margin:0}.of-cart-close{border:0;background:rgba(255,255,255,.12);color:#fff;border-radius:50%;width:40px;height:40px;font-size:1.3rem}.of-cart-body{padding:16px;overflow:auto;flex:1}.of-cart-empty{text-align:center;color:#777;padding:30px 10px}
    .of-cart-item{display:grid;grid-template-columns:58px 1fr auto;gap:10px;align-items:center;padding:12px 0;border-bottom:1px solid #e7e7e9}.of-cart-item img{width:58px;height:58px;object-fit:contain;border-radius:10px;background:#fafafa}.of-cart-item h4{margin:0 0 3px;font-size:.92rem}.of-cart-type{font-size:.68rem;text-transform:uppercase;letter-spacing:.08em;font-weight:900;color:#777;margin-bottom:4px}.of-cart-variant{font-size:.78rem;font-weight:850;color:#555;margin:1px 0 4px}.of-cart-price{font-weight:950;color:var(--red,#e30613)}.of-cart-qty{display:flex;align-items:center;gap:7px;margin-top:7px}.of-cart-qty button{width:29px;height:29px;border:1px solid #ddd;border-radius:8px;background:#fff;font-weight:900}.of-cart-remove{border:0;background:none;color:#9b2028;font-size:.8rem}
    .of-cart-foot{border-top:1px solid #e7e7e9;padding:16px}.of-cart-total{display:flex;justify-content:space-between;font-size:1.18rem;font-weight:950;margin-bottom:12px}.of-cart-checkout{width:100%;border:0;border-radius:999px;padding:13px;background:#111;color:#fff;font-weight:950}.of-cart-note{font-size:.78rem;color:#777;line-height:1.35;margin:10px 3px 0}@media(max-width:650px){.of-cart-fab{right:13px;bottom:13px}.of-promo-label{text-align:left}}
  `;document.head.appendChild(style);

  if(!document.getElementById('ofCartFab'))document.body.insertAdjacentHTML('beforeend',`<button class="of-cart-fab" id="ofCartFab" type="button">Carrito <span class="of-cart-count" id="ofCartCount">0</span></button><div class="of-cart-backdrop" id="ofCartBackdrop"></div><aside class="of-cart" id="ofCart"><div class="of-cart-head"><h3>Tu carrito</h3><button class="of-cart-close" id="ofCartClose" type="button">×</button></div><div class="of-cart-body" id="ofCartBody"></div><div class="of-cart-foot"><div class="of-cart-total"><span>Total</span><span id="ofCartTotal">${fmt(0)}</span></div><button class="of-cart-checkout" id="ofCartCheckout" type="button">Continuar por WhatsApp</button><div class="of-cart-note">Agregar al carrito no reserva unidades.</div></div></aside>`);

  const $=id=>document.getElementById(id),drawer=$('ofCart'),backdrop=$('ofCartBackdrop');
  const open=()=>{drawer?.classList.add('open');backdrop?.classList.add('open');document.body.style.overflow='hidden';};
  const close=()=>{drawer?.classList.remove('open');backdrop?.classList.remove('open');document.body.style.overflow='';};
  if($('ofCartFab'))$('ofCartFab').onclick=open;if($('ofCartClose'))$('ofCartClose').onclick=close;if(backdrop)backdrop.onclick=close;

  function renderCart(){
    prune();if($('ofCartCount'))$('ofCartCount').textContent=String(count());if($('ofCartTotal'))$('ofCartTotal').textContent=fmt(total());
    const body=$('ofCartBody');if(!body)return;
    if(!cart.length){body.innerHTML='<div class="of-cart-empty">Todavía no agregaste productos o combos.</div>';return;}
    body.innerHTML=cart.map(x=>{const p=itemFor(x),key=lineKey(x);return `<div class="of-cart-item" data-key="${esc(key)}">${p.image_url?`<img src="${esc(p.image_url)}" alt="">`:'<div></div>'}<div><div class="of-cart-type">${x.type==='combo'?'Combo':'Producto'}</div><h4>${esc(p.name)}</h4>${x.flavor?`<div class="of-cart-variant">Sabor: ${esc(x.flavor)}</div>`:''}<div class="of-cart-price">${fmt(priceOf(p)*x.quantity)}</div><div class="of-cart-qty"><button data-act="minus" type="button">−</button><b>${x.quantity}</b><button data-act="plus" type="button">+</button></div></div><button class="of-cart-remove" data-act="remove" type="button">Quitar</button></div>`;}).join('');
    body.querySelectorAll('.of-cart-item').forEach(row=>row.onclick=e=>{
      const act=e.target?.dataset?.act;if(!act)return;
      const x=cart.find(i=>lineKey(i)===row.dataset.key),p=x&&itemFor(x);if(!x||!p)return;
      if(act==='plus'&&totalForBase(x.type,x.id)<Number(p.stock))x.quantity++;
      if(act==='minus')x.quantity--;
      if(act==='remove'||x.quantity<=0)cart=cart.filter(i=>lineKey(i)!==row.dataset.key);
      save();renderCart();
    });
  }

  function add(type,id,flavor=''){
    const p=itemsByKey.get(baseKey(type,id));if(!p||Number(p.stock)<=0)return false;
    let chosen=normalizeFlavor(flavor);
    if(needsFlavor(p)){if(!validFlavors(p).includes(chosen))return false;}else chosen='';
    if(totalForBase(type,id)>=Number(p.stock))return false;
    const wanted={type,id:String(id),flavor:chosen},key=lineKey(wanted);
    const x=cart.find(i=>lineKey(i)===key);
    if(x)x.quantity++;else cart.push({...wanted,quantity:1});
    save();renderCart();open();return true;
  }
  window.ORIGENFIT_CART={add:(id,flavor='')=>add('product',id,flavor),addProduct:(id,flavor='')=>add('product',id,flavor),addCombo:id=>add('combo',id,''),open,render:renderCart};

  if($('ofCartCheckout'))$('ofCartCheckout').onclick=()=>{
    if(!cart.length)return;
    const lines=cart.map(x=>{const p=itemFor(x),variant=x.flavor?` · Sabor: ${x.flavor}`:'';return `• ${x.type==='combo'?'Combo ':''}${p.name}${variant} x${x.quantity} — ${fmt(priceOf(p)*x.quantity)}`;});
    const text=`Hola! Quiero hacer este pedido:\n\n${lines.join('\n')}\n\nTotal: ${fmt(total())}`;
    window.open(`https://wa.me/5492216187020?text=${encodeURIComponent(text)}`,'_blank','noopener');
  };

  if(document.getElementById('grid')){
    const identifyCard=card=>{const byId=products.find(p=>String(p.id)===String(card.dataset.productId||''));if(byId)return byId;const name=card.querySelector('h3')?.textContent?.trim()||'';const candidates=products.filter(p=>p.name===name);return candidates[0]||null;};
    const decorate=()=>document.querySelectorAll('.product-card-link').forEach(card=>{
      const p=identifyCard(card);if(!p)return;
      card.href=`producto.html?id=${encodeURIComponent(p.id)}`;card.target='_blank';card.rel='noopener';card.dataset.productId=p.id;card.setAttribute('aria-label',`Ver ${p.name}`);card.querySelector('.desc')?.remove();
      const price=card.querySelector('.price');if(price&&isPromo(p)&&p.promo_label&&!card.querySelector('.of-promo-label')){const label=document.createElement('div');label.className='of-promo-label';label.textContent=p.promo_label;(price.closest('.row')||price).insertAdjacentElement('afterend',label);}
      const tags=card.querySelector('.tags');if(tags&&!card.querySelector('.of-card-flags')){const flags=document.createElement('div');flags.className='of-card-flags';flags.innerHTML=`<span class="of-stock-badge ${Number(p.stock)<=0?'out':''}">${Number(p.stock)>0?`Stock: ${p.stock}`:'SIN STOCK'}</span>${p.free_shipping?'<span class="of-free-shipping">Envío gratis</span>':''}`;tags.insertAdjacentElement('afterend',flags);}
      const oldStock=[...card.querySelectorAll('.tags .tag')].find(x=>/^Stock:|^Sin stock$/i.test(x.textContent.trim()));if(oldStock)oldStock.style.display='none';
      const wa=card.querySelector('.product-wa');if(wa)wa.innerHTML='<span>Ver producto</span><span>→</span>';
      let btn=card.querySelector('.of-add-cart');if(!btn){btn=document.createElement('button');btn.type='button';btn.className='of-add-cart';(wa||card.querySelector('.body-card'))?.insertAdjacentElement('beforebegin',btn);}
      const flavorRequired=needsFlavor(p);btn.disabled=Number(p.stock)<=0;btn.textContent=Number(p.stock)<=0?'Sin stock':'Agregar al carrito';
      btn.onclick=e=>{e.preventDefault();e.stopPropagation();if(Number(p.stock)<=0)return;if(flavorRequired)window.open(card.href,'_blank','noopener');else add('product',String(p.id),'');};
    });
    const grid=document.getElementById('grid');new MutationObserver(()=>requestAnimationFrame(decorate)).observe(grid,{childList:true,subtree:true});decorate();
  }

  renderCart();
});
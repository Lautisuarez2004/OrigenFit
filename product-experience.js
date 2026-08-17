/* Origen Fit · ficha de producto + carrito previo a checkout */
document.addEventListener('DOMContentLoaded',async()=>{
  if(typeof db==='undefined') return;
  const isStore=!!document.getElementById('grid');
  const isDetail=document.body?.dataset?.productDetail==='1';
  if(!isStore && !isDetail) return;

  const CART_KEY='origenfit-cart-v1';
  const fmt=n=>'$'+Number(n||0).toLocaleString('es-AR',{maximumFractionDigits:2});
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let products=[];
  let byId=new Map();
  let cart=[];

  try{
    const {data,error}=await db.from('products')
      .select('id,name,brand,category,price,promo_price,promo_label,stock,image_url,free_shipping,visible')
      .eq('visible',true);
    if(error) throw error;
    products=data||[];
    byId=new Map(products.map(p=>[p.id,p]));
  }catch(err){
    console.warn('Carrito Origen Fit:',err?.message||err);
    return;
  }

  try{
    const saved=JSON.parse(localStorage.getItem(CART_KEY)||'[]');
    if(Array.isArray(saved)) cart=saved.filter(x=>x&&byId.has(x.id)&&Number(x.quantity)>0).map(x=>({id:x.id,quantity:Number(x.quantity)}));
  }catch(_){cart=[];}

  const isPromo=p=>{
    const normal=p.price==null?null:Number(p.price);
    const promo=p.promo_price==null?null:Number(p.promo_price);
    return promo!=null&&promo>0&&(normal==null||promo<normal);
  };
  const priceOf=p=>isPromo(p)?Number(p.promo_price):Number(p.price||0);
  const save=()=>localStorage.setItem(CART_KEY,JSON.stringify(cart));
  const prune=()=>{
    cart=cart.filter(x=>{
      const p=byId.get(x.id);
      if(!p||Number(p.stock)<=0) return false;
      x.quantity=Math.max(1,Math.min(Number(x.quantity),Number(p.stock)));
      return true;
    });
    save();
  };
  const count=()=>cart.reduce((s,x)=>s+x.quantity,0);
  const total=()=>cart.reduce((s,x)=>s+(priceOf(byId.get(x.id))||0)*x.quantity,0);
  prune();

  const style=document.createElement('style');
  style.textContent=`
    .of-stock-badge,.of-free-shipping{display:inline-flex;align-items:center;border-radius:999px;padding:6px 10px;font-size:.73rem;font-weight:950}
    .of-stock-badge{background:#111;color:#fff}.of-stock-badge.out{background:#f3dfe1;color:#9b2028}
    .of-free-shipping{background:#e9f7ef;color:#14743a}
    .of-card-flags{display:flex;gap:7px;flex-wrap:wrap;margin:10px 0}
    .of-promo-label{font-size:.72rem;line-height:1.2;color:#666971;font-weight:850;margin:6px 0 0;text-align:right}
    .products .product-card-link .desc{display:none!important}
    .products .product-card-link .tags{margin-top:14px}
    .of-add-cart{width:100%;border:0;border-radius:999px;padding:11px 14px;background:#111;color:#fff;font-weight:950;margin-top:12px}
    .of-add-cart:disabled{background:#d9d9dd;color:#777;cursor:not-allowed}
    .of-cart-fab{position:fixed;right:20px;bottom:20px;z-index:120;border:0;border-radius:999px;background:var(--red,#e30613);color:#fff;padding:14px 18px;font-weight:950;box-shadow:0 14px 32px rgba(0,0,0,.26);display:flex;gap:8px;align-items:center}
    .of-cart-count{min-width:24px;height:24px;border-radius:99px;background:#fff;color:var(--red,#e30613);display:grid;place-items:center;font-size:.78rem}
    .of-cart-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:125;opacity:0;visibility:hidden;transition:.2s}.of-cart-backdrop.open{opacity:1;visibility:visible}
    .of-cart{position:fixed;right:0;top:0;bottom:0;width:min(430px,94vw);background:#fff;z-index:130;transform:translateX(102%);transition:.23s;display:flex;flex-direction:column;box-shadow:-18px 0 45px rgba(0,0,0,.24)}.of-cart.open{transform:none}
    .of-cart-head{background:#111;color:#fff;padding:20px;display:flex;justify-content:space-between;align-items:center}.of-cart-head h3{margin:0}.of-cart-close{border:0;background:rgba(255,255,255,.12);color:#fff;border-radius:50%;width:40px;height:40px;font-size:1.3rem}
    .of-cart-body{padding:16px;overflow:auto;flex:1}.of-cart-empty{text-align:center;color:#777;padding:30px 10px}
    .of-cart-item{display:grid;grid-template-columns:58px 1fr auto;gap:10px;align-items:center;padding:12px 0;border-bottom:1px solid #e7e7e9}.of-cart-item img{width:58px;height:58px;object-fit:contain;border-radius:10px;background:#fafafa}
    .of-cart-item h4{margin:0 0 5px;font-size:.92rem}.of-cart-price{font-weight:950;color:var(--red,#e30613)}.of-cart-qty{display:flex;align-items:center;gap:7px;margin-top:7px}.of-cart-qty button{width:29px;height:29px;border:1px solid #ddd;border-radius:8px;background:#fff;font-weight:900}.of-cart-remove{border:0;background:none;color:#9b2028;font-size:.8rem}
    .of-cart-foot{border-top:1px solid #e7e7e9;padding:16px}.of-cart-total{display:flex;justify-content:space-between;font-size:1.18rem;font-weight:950;margin-bottom:12px}.of-cart-checkout{width:100%;border:0;border-radius:999px;padding:13px;background:#111;color:#fff;font-weight:950}.of-cart-note{font-size:.78rem;color:#777;line-height:1.35;margin:10px 3px 0}
    @media(max-width:650px){.of-cart-fab{right:13px;bottom:13px}.of-promo-label{text-align:left}}
  `;
  document.head.appendChild(style);

  document.body.insertAdjacentHTML('beforeend',`
    <button class="of-cart-fab" id="ofCartFab" type="button">Carrito <span class="of-cart-count" id="ofCartCount">0</span></button>
    <div class="of-cart-backdrop" id="ofCartBackdrop"></div>
    <aside class="of-cart" id="ofCart">
      <div class="of-cart-head"><h3>Tu carrito</h3><button class="of-cart-close" id="ofCartClose" type="button">×</button></div>
      <div class="of-cart-body" id="ofCartBody"></div>
      <div class="of-cart-foot">
        <div class="of-cart-total"><span>Total</span><span id="ofCartTotal">${fmt(0)}</span></div>
        <button class="of-cart-checkout" id="ofCartCheckout" type="button">Continuar por WhatsApp</button>
        <div class="of-cart-note">El stock definitivo se descontará cuando implementemos la confirmación de pago. Agregar al carrito no reserva unidades.</div>
      </div>
    </aside>`);

  const $=id=>document.getElementById(id);
  const drawer=$('ofCart'),backdrop=$('ofCartBackdrop');
  const open=()=>{drawer.classList.add('open');backdrop.classList.add('open');document.body.style.overflow='hidden';};
  const close=()=>{drawer.classList.remove('open');backdrop.classList.remove('open');document.body.style.overflow='';};
  $('ofCartFab').onclick=open;$('ofCartClose').onclick=close;backdrop.onclick=close;

  function renderCart(){
    prune();
    $('ofCartCount').textContent=String(count());
    $('ofCartTotal').textContent=fmt(total());
    const body=$('ofCartBody');
    if(!cart.length){body.innerHTML='<div class="of-cart-empty">Todavía no agregaste productos.</div>';return;}
    body.innerHTML=cart.map(x=>{
      const p=byId.get(x.id);
      return `<div class="of-cart-item" data-id="${p.id}">
        ${p.image_url?`<img src="${esc(p.image_url)}" alt="">`:'<div></div>'}
        <div><h4>${esc(p.name)}</h4><div class="of-cart-price">${fmt((priceOf(p)||0)*x.quantity)}</div>
        <div class="of-cart-qty"><button data-act="minus" type="button">−</button><b>${x.quantity}</b><button data-act="plus" type="button">+</button></div></div>
        <button class="of-cart-remove" data-act="remove" type="button">Quitar</button>
      </div>`;
    }).join('');
    body.querySelectorAll('.of-cart-item').forEach(row=>row.onclick=e=>{
      const act=e.target?.dataset?.act;if(!act)return;
      const item=cart.find(x=>x.id===row.dataset.id),p=byId.get(row.dataset.id);if(!item||!p)return;
      if(act==='plus'&&item.quantity<Number(p.stock))item.quantity++;
      if(act==='minus')item.quantity--;
      if(act==='remove'||item.quantity<=0)cart=cart.filter(x=>x.id!==row.dataset.id);
      save();renderCart();
    });
  }

  function add(id){
    const p=byId.get(id);
    if(!p||Number(p.stock)<=0) return false;
    const item=cart.find(x=>x.id===id);
    if(item){if(item.quantity>=Number(p.stock))return false;item.quantity++;}
    else cart.push({id,quantity:1});
    save();renderCart();open();return true;
  }
  window.ORIGENFIT_CART={add,open,render:renderCart};

  $('ofCartCheckout').onclick=()=>{
    if(!cart.length) return;
    const lines=cart.map(x=>{const p=byId.get(x.id);return `• ${p.name} x${x.quantity} — ${fmt((priceOf(p)||0)*x.quantity)}`;});
    const text=`Hola! Quiero hacer este pedido:\n\n${lines.join('\n')}\n\nTotal: ${fmt(total())}`;
    window.open(`https://wa.me/5492216187020?text=${encodeURIComponent(text)}`,'_blank','noopener');
  };

  if(isStore){
    const identifyCard=card=>{
      const name=card.querySelector('h3')?.textContent?.trim()||'';
      const brand=card.querySelector('.tags .tag')?.textContent?.trim()||'';
      const candidates=products.filter(p=>p.name===name);
      return candidates.find(p=>(p.brand||'')===brand)||candidates[0]||null;
    };
    const decorate=()=>{
      document.querySelectorAll('.product-card-link').forEach(card=>{
        const p=identifyCard(card);if(!p)return;
        card.href=`producto.html?id=${encodeURIComponent(p.id)}`;
        card.target='_blank';
        card.rel='noopener';
        card.setAttribute('aria-label',`Ver ${p.name}`);
        card.dataset.productId=p.id;

        const desc=card.querySelector('.desc');
        if(desc) desc.remove();

        const price=card.querySelector('.price');
        if(price && isPromo(p) && p.promo_label && !card.querySelector('.of-promo-label')){
          const label=document.createElement('div');
          label.className='of-promo-label';
          label.textContent=p.promo_label;
          (price.closest('.row')||price).insertAdjacentElement('afterend',label);
        }

        const tags=card.querySelector('.tags');
        if(tags && !card.querySelector('.of-card-flags')){
          const flags=document.createElement('div');flags.className='of-card-flags';
          flags.innerHTML=`<span class="of-stock-badge ${Number(p.stock)<=0?'out':''}">${Number(p.stock)>0?`Stock: ${p.stock}`:'SIN STOCK'}</span>${p.free_shipping?'<span class="of-free-shipping">Envío gratis</span>':''}`;
          tags.insertAdjacentElement('afterend',flags);
        }
        const oldStock=[...card.querySelectorAll('.tags .tag')].find(x=>/^Stock:|^Sin stock$/i.test(x.textContent.trim()));
        if(oldStock) oldStock.style.display='none';
        const wa=card.querySelector('.product-wa');
        if(wa) wa.innerHTML='<span>Ver producto</span><span>→</span>';
        if(!card.querySelector('.of-add-cart')){
          const btn=document.createElement('button');
          btn.type='button';btn.className='of-add-cart';btn.disabled=Number(p.stock)<=0;
          btn.textContent=Number(p.stock)>0?'Agregar al carrito':'Sin stock';
          btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();add(p.id);});
          (wa||card.querySelector('.body-card'))?.insertAdjacentElement('beforebegin',btn);
        }
      });
    };
    const grid=document.getElementById('grid');
    if(grid)new MutationObserver(()=>requestAnimationFrame(decorate)).observe(grid,{childList:true,subtree:true});
    decorate();
  }

  renderCart();
});

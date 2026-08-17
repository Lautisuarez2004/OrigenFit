/* Origen Fit · badges limpios sobre imagen para productos y combos */
document.addEventListener('DOMContentLoaded',async()=>{
  if(typeof db==='undefined') return;
  const productGrid=document.getElementById('grid');
  const comboGrid=document.getElementById('comboGrid');
  if(!productGrid&&!comboGrid) return;

  const style=document.createElement('style');
  style.textContent=`
    .product-card-link .art,.combo-card .combo-art{position:relative!important}
    .product-card-link>.body-card>.of-card-flags,.combo-card .of-card-flags{display:none!important}
    .of-status-overlay{position:absolute;top:12px;left:12px;z-index:8;display:flex;flex-direction:column;align-items:flex-start;gap:7px;pointer-events:none}
    .of-status-overlay span{display:inline-flex;align-items:center;min-height:27px;padding:6px 10px;border-radius:5px;font-size:.72rem;line-height:1;font-weight:950;letter-spacing:.025em;text-transform:uppercase;box-shadow:0 2px 8px rgba(0,0,0,.12)}
    .of-status-overlay .shipping{background:#31a844;color:#fff}
    .of-status-overlay .out{background:#111;color:#fff}
    @media(max-width:650px){
      .of-status-overlay{top:9px;left:9px;gap:5px}
      .of-status-overlay span{min-height:24px;padding:5px 8px;font-size:.64rem;border-radius:4px}
    }
  `;
  document.head.appendChild(style);

  let products=[],combos=[];
  const [pr,cr]=await Promise.allSettled([
    db.from('products').select('id,name,brand,stock,free_shipping,visible').eq('visible',true),
    db.from('combos').select('id,name,stock,free_shipping,visible').eq('visible',true)
  ]);
  if(pr.status==='fulfilled'&&!pr.value.error) products=pr.value.data||[];
  if(cr.status==='fulfilled'&&!cr.value.error) combos=cr.value.data||[];

  const productById=new Map(products.map(p=>[String(p.id),p]));
  const comboById=new Map(combos.map(c=>[String(c.id),c]));

  function findProduct(card){
    const byId=productById.get(String(card.dataset.productId||''));
    if(byId)return byId;
    const name=card.querySelector('h3')?.textContent?.trim()||'';
    const brand=card.querySelector('.tags .tag')?.textContent?.trim()||'';
    const candidates=products.filter(p=>p.name===name);
    return candidates.find(p=>(p.brand||'')===brand)||candidates[0]||null;
  }
  function findCombo(card){
    const byId=comboById.get(String(card.dataset.comboId||''));
    if(byId)return byId;
    const name=card.querySelector('h3')?.textContent?.trim()||'';
    return combos.find(c=>c.name===name)||null;
  }

  function hideLegacyStock(card){
    card.querySelectorAll('.tags .tag').forEach(tag=>{
      if(/^Stock\s*:|^Sin stock$/i.test(tag.textContent.trim())) tag.style.display='none';
    });
  }

  function paint(card,item,artSelector){
    if(!item)return;
    hideLegacyStock(card);
    const art=card.querySelector(artSelector);
    if(!art)return;
    let overlay=art.querySelector(':scope > .of-status-overlay');
    if(!overlay){
      overlay=document.createElement('div');
      overlay.className='of-status-overlay';
      art.appendChild(overlay);
    }
    const badges=[];
    if(item.free_shipping) badges.push('<span class="shipping">Envío gratis</span>');
    if(Number(item.stock)<=0) badges.push('<span class="out">Sin stock</span>');
    overlay.innerHTML=badges.join('');
    overlay.style.display=badges.length?'flex':'none';
  }

  function decorate(){
    productGrid?.querySelectorAll('.product-card-link').forEach(card=>paint(card,findProduct(card),'.art'));
    comboGrid?.querySelectorAll('.combo-card').forEach(card=>paint(card,findCombo(card),'.combo-art'));
  }

  let queued=false;
  const schedule=()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;decorate();});
  };
  if(productGrid)new MutationObserver(schedule).observe(productGrid,{childList:true,subtree:true});
  if(comboGrid)new MutationObserver(schedule).observe(comboGrid,{childList:true,subtree:true});
  decorate();
});

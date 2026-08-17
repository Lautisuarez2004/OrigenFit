/* Origen Fit · precio promo consistente en tarjetas */
document.addEventListener('DOMContentLoaded',async()=>{
  const grid=document.getElementById('grid');
  if(!grid||typeof db==='undefined')return;
  let products=[];
  try{
    const {data,error}=await db.from('products').select('id,name,brand,price,promo_price,visible').eq('visible',true);
    if(error)throw error;
    products=data||[];
  }catch(err){
    console.warn('Precios promo:',err?.message||err);
    return;
  }
  const isPromo=p=>p.promo_price!=null&&Number(p.promo_price)>0&&(p.price==null||Number(p.promo_price)<Number(p.price));
  const money=n=>'$'+Number(n||0).toLocaleString('es-AR',{maximumFractionDigits:2});
  const identify=card=>{
    const name=card.querySelector('h3')?.textContent?.trim()||'';
    const brand=card.querySelector('.tags .tag')?.textContent?.trim()||'';
    const candidates=products.filter(p=>p.name===name);
    return candidates.find(p=>(p.brand||'')===brand)||candidates[0]||null;
  };
  const decorate=()=>{
    grid.querySelectorAll('.product-card-link').forEach(card=>{
      const p=identify(card);if(!p||!isPromo(p)||p.price==null)return;
      const price=card.querySelector('.price');if(!price||card.querySelector('.of-old-price'))return;
      let stack=price.parentElement?.classList?.contains('of-price-stack')?price.parentElement:null;
      if(!stack){
        stack=document.createElement('div');stack.className='of-price-stack';
        price.replaceWith(stack);stack.appendChild(price);
      }
      const old=document.createElement('div');old.className='of-old-price';old.textContent=money(p.price);stack.appendChild(old);
    });
  };
  new MutationObserver(()=>requestAnimationFrame(decorate)).observe(grid,{childList:true,subtree:true});
  decorate();
});

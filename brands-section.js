/* Origen Fit · sección "Nuestras marcas" inspirada en Panther.
 * Se inserta después de Categorías y usa las marcas reales del catálogo.
 * Swipe táctil nativo + flechas como apoyo. No toca Productos, Combos, Categorías ni Promos.
 */
document.addEventListener('DOMContentLoaded',async()=>{
  const categoryGrid=document.getElementById('categoriesGrid');
  const anchor=categoryGrid?.closest('section')||document.getElementById('categorias');
  if(!anchor||document.getElementById('marcas')) return;

  const style=document.createElement('style');
  style.id='of-brands-section-style';
  style.textContent=`
    #marcas{padding:48px 0 58px;background:#fff;color:#111}
    #marcas .of-brands-head{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin-bottom:22px}
    #marcas .of-brands-kicker{color:var(--red,#e30613);font-size:.76rem;font-weight:950;letter-spacing:.14em;text-transform:uppercase;margin-bottom:6px}
    #marcas h2{margin:0;font-size:clamp(2rem,4vw,3.1rem);line-height:.95;letter-spacing:-.045em;font-weight:950}
    #marcas .of-brands-shell{position:relative;padding:0 46px}
    #marcas .of-brands-track{display:flex;gap:14px;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x proximity;scroll-behavior:smooth;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:4px 2px 12px}
    #marcas .of-brands-track::-webkit-scrollbar{display:none}
    #marcas .of-brand-card{flex:0 0 calc((100% - 70px)/6);min-width:145px;height:108px;scroll-snap-align:start;border:1px solid var(--line,#e7e7e9);border-radius:18px;background:#fff;display:flex;align-items:center;justify-content:center;padding:14px;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,.055)}
    #marcas .of-brand-wordmark{font-size:1rem;line-height:1.05;font-weight:950;letter-spacing:-.025em;text-transform:uppercase;color:#171719}
    #marcas .of-brand-card:nth-child(3n+2) .of-brand-wordmark{font-style:italic;letter-spacing:-.045em}
    #marcas .of-brand-card:nth-child(4n) .of-brand-wordmark{letter-spacing:.02em}
    #marcas .of-brand-arrow{position:absolute;top:50%;transform:translateY(-50%);z-index:4;width:36px;height:48px;border:0;border-radius:12px;background:#111;color:#fff;display:grid;place-items:center;font-size:1.75rem;font-weight:900;box-shadow:0 7px 18px rgba(0,0,0,.16);touch-action:manipulation;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}
    #marcas .of-brand-arrow.prev{left:0}#marcas .of-brand-arrow.next{right:0}
    #marcas .of-brand-arrow:disabled{opacity:.2;cursor:default}
    @media(max-width:900px){#marcas .of-brand-card{flex-basis:calc((100% - 42px)/4)}}
    @media(max-width:650px){
      #marcas{padding:34px 0 42px}
      #marcas .of-brands-head{margin-bottom:16px}
      #marcas .of-brands-shell{padding:0}
      #marcas .of-brands-track{gap:9px;padding:3px 18px 10px;scroll-padding-inline:18px}
      #marcas .of-brand-card{flex:0 0 30%;min-width:104px;height:82px;border-radius:14px;padding:9px}
      #marcas .of-brand-wordmark{font-size:.77rem}
      #marcas .of-brand-arrow{width:31px;height:42px;border-radius:0;background:rgba(17,17,17,.72);box-shadow:none;font-size:1.6rem}
      #marcas .of-brand-arrow.prev{left:2px}#marcas .of-brand-arrow.next{right:2px}
    }
  `;
  document.head.appendChild(style);

  const section=document.createElement('section');
  section.id='marcas';
  section.innerHTML=`
    <div class="c">
      <div class="of-brands-head">
        <div>
          <div class="of-brands-kicker">Origen Fit</div>
          <h2>Nuestras marcas</h2>
        </div>
      </div>
      <div class="of-brands-shell">
        <button class="of-brand-arrow prev" type="button" aria-label="Marcas anteriores">‹</button>
        <div class="of-brands-track" id="brandsTrack" aria-label="Marcas disponibles"></div>
        <button class="of-brand-arrow next" type="button" aria-label="Marcas siguientes">›</button>
      </div>
    </div>`;
  anchor.insertAdjacentElement('afterend',section);

  const fallback=['Star Nutrition','One Fit','ENA Sport','Gold Nutrition','Body Advance','Gentech','Age Biologique','Gomex Nutrition','Granger Nutrition','Mervick'];
  const aliases={
    'star nurition':'Star Nutrition',
    'star nutrition':'Star Nutrition',
    'gold nutriton':'Gold Nutrition',
    'gold nutrition':'Gold Nutrition',
    'one fit':'One Fit',
    'ena sport':'ENA Sport',
    'body advance':'Body Advance',
    'gentech':'Gentech',
    'age biologique':'Age Biologique',
    'gomex nutrition':'Gomex Nutrition',
    'granger nutrition':'Granger Nutrition',
    'mervick':'Mervick'
  };
  const normalize=value=>{
    const clean=String(value||'').trim().replace(/\s+/g,' ');
    if(!clean)return'';
    return aliases[clean.toLowerCase()]||clean;
  };

  let brands=fallback;
  try{
    if(typeof db!=='undefined'){
      const{data,error}=await db.from('products').select('brand').eq('visible',true);
      if(!error&&Array.isArray(data)){
        const found=[...new Set(data.map(x=>normalize(x.brand)).filter(Boolean))];
        if(found.length) brands=found.sort((a,b)=>a.localeCompare(b,'es'));
      }
    }
  }catch(err){console.warn('Nuestras marcas:',err?.message||err);}

  const track=document.getElementById('brandsTrack');
  if(!track)return;
  track.innerHTML=brands.map(brand=>`<div class="of-brand-card"><span class="of-brand-wordmark">${brand.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</span></div>`).join('');

  const prev=section.querySelector('.of-brand-arrow.prev');
  const next=section.querySelector('.of-brand-arrow.next');
  const cards=()=>[...track.querySelectorAll('.of-brand-card')];
  const step=()=>{const list=cards();if(list.length<2)return list[0]?.getBoundingClientRect().width||140;return Math.abs(list[1].offsetLeft-list[0].offsetLeft)||140;};
  const sync=()=>{const max=Math.max(0,track.scrollWidth-track.clientWidth);prev.disabled=track.scrollLeft<=3;next.disabled=track.scrollLeft>=max-3;};
  prev.onclick=e=>{e.preventDefault();track.scrollBy({left:-step(),behavior:'smooth'});};
  next.onclick=e=>{e.preventDefault();track.scrollBy({left:step(),behavior:'smooth'});};
  let raf=0;track.addEventListener('scroll',()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(sync);},{passive:true});
  window.addEventListener('resize',()=>requestAnimationFrame(sync));
  document.addEventListener('dblclick',e=>{if(e.target.closest?.('#marcas .of-brand-arrow'))e.preventDefault();},{passive:false});
  requestAnimationFrame(sync);
});

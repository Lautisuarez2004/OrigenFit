/* Origen Fit · sección "Nuestras marcas".
 * Logos con fallback visual local, swipe táctil + flechas.
 * No modifica Productos, Combos, Categorías ni Promos.
 */
document.addEventListener('DOMContentLoaded',async()=>{
  /* Texto pedido para quitar del hero. */
  document.querySelector('.hero .lead')?.remove();

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
    #marcas .of-brand-card{flex:0 0 calc((100% - 70px)/6);min-width:145px;height:132px;scroll-snap-align:start;border:1px solid var(--line,#e7e7e9);border-radius:18px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;padding:13px;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,.055)}
    #marcas .of-brand-logo-wrap{width:100%;height:72px;display:flex;align-items:center;justify-content:center;overflow:hidden}
    #marcas .of-brand-logo{display:block;max-width:102px;max-height:66px;width:auto;height:auto;object-fit:contain}
    #marcas .of-brand-wordmark-logo{width:100%;height:66px;display:flex;align-items:center;justify-content:center;padding:5px 8px;border-radius:12px;background:#fff;color:#111;font-size:.92rem;line-height:.95;font-weight:950;letter-spacing:-.045em;text-transform:uppercase;text-align:center}
    #marcas .of-brand-wordmark-logo[data-brand="Star Nutrition"]{font-style:italic;color:#111;border-bottom:4px solid #e30613}
    #marcas .of-brand-wordmark-logo[data-brand="One Fit"]{font-style:italic;letter-spacing:.04em;border:2px solid #111}
    #marcas .of-brand-wordmark-logo[data-brand="ENA Sport"]{font-style:italic;color:#e30613;font-size:1.18rem}
    #marcas .of-brand-wordmark-logo[data-brand="Gold Nutrition"]{color:#a88418;font-family:Georgia,serif;letter-spacing:.02em}
    #marcas .of-brand-wordmark-logo[data-brand="Body Advance"]{border-left:5px solid #e30613}
    #marcas .of-brand-wordmark-logo[data-brand="Gentech"]{font-style:italic;font-size:1.08rem}
    #marcas .of-brand-wordmark-logo[data-brand="Age Biologique"]{font-family:Georgia,serif;font-weight:700;letter-spacing:.01em;text-transform:none}
    #marcas .of-brand-wordmark-logo[data-brand="Gomex Nutrition"]{background:#111;color:#fff;letter-spacing:.03em}
    #marcas .of-brand-wordmark-logo[data-brand="Granger Nutrition"]{border-bottom:4px solid #111;letter-spacing:.01em}
    #marcas .of-brand-wordmark-logo[data-brand="Mervick"]{font-style:italic;font-size:1.08rem;letter-spacing:.02em}
    #marcas .of-brand-name{font-size:.75rem;line-height:1.05;font-weight:850;color:#333;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
    #marcas .of-brand-arrow{position:absolute;top:50%;transform:translateY(-50%);z-index:4;width:36px;height:48px;border:0;border-radius:12px;background:#111;color:#fff;display:grid;place-items:center;font-size:1.75rem;font-weight:900;box-shadow:0 7px 18px rgba(0,0,0,.16);touch-action:manipulation;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}
    #marcas .of-brand-arrow.prev{left:0}#marcas .of-brand-arrow.next{right:0}
    #marcas .of-brand-arrow:disabled{opacity:.2;cursor:default}
    @media(max-width:900px){#marcas .of-brand-card{flex-basis:calc((100% - 42px)/4)}}
    @media(max-width:650px){
      #marcas{padding:34px 0 42px}
      #marcas .of-brands-head{margin-bottom:16px}
      #marcas .of-brands-shell{padding:0}
      #marcas .of-brands-track{gap:9px;padding:3px 18px 10px;scroll-padding-inline:18px}
      #marcas .of-brand-card{flex:0 0 31%;min-width:108px;height:108px;border-radius:14px;padding:8px;gap:5px}
      #marcas .of-brand-logo-wrap{height:62px}
      #marcas .of-brand-logo{max-width:82px;max-height:56px}
      #marcas .of-brand-wordmark-logo{height:56px;font-size:.72rem;padding:4px 6px}
      #marcas .of-brand-wordmark-logo[data-brand="ENA Sport"]{font-size:.92rem}
      #marcas .of-brand-name{font-size:.63rem}
      #marcas .of-brand-arrow{width:31px;height:42px;border-radius:0;background:rgba(17,17,17,.72);box-shadow:none;font-size:1.6rem}
      #marcas .of-brand-arrow.prev{left:2px}#marcas .of-brand-arrow.next{right:2px}
    }
  `;
  document.head.appendChild(style);

  const section=document.createElement('section');
  section.id='marcas';
  section.innerHTML=`<div class="c"><div class="of-brands-head"><div><div class="of-brands-kicker">Origen Fit</div><h2>Nuestras marcas</h2></div></div><div class="of-brands-shell"><button class="of-brand-arrow prev" type="button" aria-label="Marcas anteriores">‹</button><div class="of-brands-track" id="brandsTrack" aria-label="Marcas disponibles"></div><button class="of-brand-arrow next" type="button" aria-label="Marcas siguientes">›</button></div></div>`;
  anchor.insertAdjacentElement('afterend',section);

  const fallback=['Star Nutrition','One Fit','ENA Sport','Gold Nutrition','Body Advance','Gentech','Age Biologique','Gomex Nutrition','Granger Nutrition','Mervick'];
  const aliases={'star nurition':'Star Nutrition','star nutrition':'Star Nutrition','gold nutriton':'Gold Nutrition','gold nutrition':'Gold Nutrition','one fit':'One Fit','ena sport':'ENA Sport','body advance':'Body Advance','gentech':'Gentech','age biologique':'Age Biologique','gomex nutrition':'Gomex Nutrition','granger nutrition':'Granger Nutrition','mervick':'Mervick'};
  const normalize=value=>{const clean=String(value||'').trim().replace(/\s+/g,' ');return clean?(aliases[clean.toLowerCase()]||clean):'';};
  const esc=value=>String(value||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  const domains={
    'Star Nutrition':'starnutrition.com.ar',
    'ENA Sport':'enasport.com',
    'Gold Nutrition':'goldnutrition.com.ar',
    'Body Advance':'bodyadvancenutrition.com',
    'Gentech':'gentech.com.ar',
    'Age Biologique':'age-biologique.com',
    'Gomex Nutrition':'gomexargentina.com',
    'Granger Nutrition':'grangernutricion.com',
    'Mervick':'mervick.com.ar'
  };
  const sourcesFor=brand=>{
    const d=domains[brand];
    if(!d)return[];
    return[
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(d)}&sz=256`,
      `https://icons.duckduckgo.com/ip3/${encodeURIComponent(d)}.ico`
    ];
  };

  let brands=fallback;
  try{
    if(typeof db!=='undefined'){
      const{data,error}=await db.from('products').select('brand').eq('visible',true);
      if(!error&&Array.isArray(data)){
        const found=[...new Set(data.map(x=>normalize(x.brand)).filter(Boolean))];
        if(found.length)brands=found.sort((a,b)=>a.localeCompare(b,'es'));
      }
    }
  }catch(err){console.warn('Nuestras marcas:',err?.message||err);}

  const track=document.getElementById('brandsTrack');
  if(!track)return;
  track.innerHTML=brands.map(brand=>{
    const srcs=sourcesFor(brand);
    const img=srcs.length?`<img class="of-brand-logo" src="${esc(srcs[0])}" alt="Logo ${esc(brand)}" loading="lazy" referrerpolicy="no-referrer" data-sources='${esc(JSON.stringify(srcs))}'>`:'';
    return `<div class="of-brand-card" aria-label="${esc(brand)}"><div class="of-brand-logo-wrap">${img}<div class="of-brand-wordmark-logo" data-brand="${esc(brand)}"${img?' style="display:none"':''}>${esc(brand)}</div></div><div class="of-brand-name">${esc(brand)}</div></div>`;
  }).join('');

  track.querySelectorAll('.of-brand-logo').forEach(img=>{
    let sources=[];try{sources=JSON.parse(img.dataset.sources||'[]');}catch(_){}
    let i=0;
    const fallbackMark=img.nextElementSibling;
    const showFallback=()=>{img.style.display='none';if(fallbackMark)fallbackMark.style.display='flex';};
    img.addEventListener('error',()=>{i++;if(i<sources.length){img.src=sources[i];}else{showFallback();}});
    img.addEventListener('load',()=>{if(!img.naturalWidth||!img.naturalHeight)showFallback();});
  });

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

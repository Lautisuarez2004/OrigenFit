/* Panel Admin · Oferta destacada del hero. */
(()=>{
  if(!document.getElementById('app')||typeof db==='undefined')return;

  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const side=document.querySelector('.side');
  const main=document.querySelector('.main');
  if(!side||!main)return;

  const btn=document.createElement('button');
  btn.className='sidebtn';
  btn.dataset.heroOffer='1';
  btn.textContent='Oferta principal';
  const securityBtn=side.querySelector('[data-panel="security"]');
  side.insertBefore(btn,securityBtn||null);

  const guideStyle=document.createElement('style');
  guideStyle.textContent=`
    .ho-grid-preview{
      position:relative;
      width:min(100%,560px);
      aspect-ratio:560/490;
      overflow:hidden;
      border:2px solid #111;
      border-radius:14px;
      background-color:#fff;
      background-image:
        linear-gradient(rgba(0,102,255,.16) 1px,transparent 1px),
        linear-gradient(90deg,rgba(0,102,255,.16) 1px,transparent 1px),
        linear-gradient(rgba(0,102,255,.38) 1px,transparent 1px),
        linear-gradient(90deg,rgba(0,102,255,.38) 1px,transparent 1px);
      background-size:20px 20px,20px 20px,100px 100px,100px 100px;
      background-position:-1px -1px;
    }
    .ho-grid-preview:before{
      content:"Límite oferta · 560 × 490";
      position:absolute;left:8px;top:7px;z-index:20;
      padding:3px 7px;border-radius:7px;background:#111;color:#fff;
      font-size:10px;font-weight:900;letter-spacing:.04em
    }
    .ho-grid-offer{
      position:absolute;
      left:0;right:0;
      top:var(--ho-grid-top,18px);
      bottom:0;
      padding:22px 16px 10px;
      outline:2px dashed rgba(227,6,19,.85);
      outline-offset:-2px;
      pointer-events:none;
    }
    .ho-grid-headline{
      color:var(--ho-headline,#e30613);
      font-weight:1000;font-size:18px;line-height:1;
      text-transform:uppercase;
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
    }
    .ho-grid-image-zone{
      position:relative;
      height:var(--ho-grid-img,320px);
      margin-top:5px;
      outline:2px dashed rgba(0,145,90,.78);
      display:flex;align-items:center;justify-content:center;
      overflow:hidden;
    }
    .ho-grid-image-zone:after{
      content:"zona imagen";
      position:absolute;right:5px;top:5px;
      padding:2px 5px;border-radius:5px;background:rgba(0,145,90,.88);color:#fff;
      font-size:9px;font-weight:900;text-transform:uppercase
    }
    .ho-grid-image-zone img{
      width:100%;height:100%;object-fit:contain;display:block;
      filter:drop-shadow(0 8px 8px rgba(0,0,0,.12));
    }
    .ho-grid-copy{
      margin-top:5px;
      min-height:72px;
      outline:2px dashed rgba(120,0,220,.7);
      padding:5px 7px;
      font-size:10px;line-height:1.15;color:#333;
      background:rgba(255,255,255,.56)
    }
    .ho-grid-copy strong{display:block;font-size:13px;margin:2px 0}
    .ho-grid-copy .price{font-size:16px;font-weight:1000;color:var(--ho-price,#e30613)}
    .ho-grid-note{font-size:.78rem;margin-top:7px;color:#65676c}
    #hoImagePreview img{max-height:220px;object-fit:contain}
  `;
  document.head.appendChild(guideStyle);

  const panel=document.createElement('section');
  panel.id='heroOfferPanel';
  panel.className='hidden';
  panel.innerHTML=`
    <div class="panel" style="max-width:980px">
      <h3 style="margin-top:0">Oferta principal del inicio</h3>
      <p class="muted">Configurá el producto, textos, colores y tamaño del bloque que aparece junto a “ENERGÍA. FUERZA. ENFOQUE.”.</p>

      <div class="checks">
        <label><input id="hoEnabled" type="checkbox" checked> Mostrar oferta</label>
        <label><input id="hoShowDiscount" type="checkbox" checked> Mostrar descuento</label>
        <label><input id="hoShowShipping" type="checkbox" checked> Mostrar envío gratis</label>
        <label><input id="hoShowStock" type="checkbox" checked> Mostrar stock</label>
        <label><input id="hoShowSaving" type="checkbox" checked> Mostrar ahorro</label>
      </div>

      <div class="two">
        <div class="field">
          <label>Producto destacado</label>
          <select id="hoProduct" style="width:100%;padding:11px;border:1px solid #d8d8dc;border-radius:10px;background:#fff"></select>
        </div>
        <div class="field">
          <label>Posición vertical en computadora (px)</label>
          <input id="hoTop" type="number" min="-20" max="120" step="1" value="18">
        </div>
      </div>

      <div class="two">
        <div class="field"><label>Título superior</label><input id="hoHeadline" value="🔥 OFERTA DESTACADA"></div>
        <div class="field"><label>Texto “Precio especial”</label><input id="hoSaleText" value="Precio especial"></div>
      </div>
      <div class="field"><label>Texto del botón</label><input id="hoCta" value="Quiero esta oferta"></div>

      <div class="imagebox">
        <strong>Imagen exclusiva para la oferta</strong>
        <div class="field"><input id="hoImageFile" type="file" accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"></div>
        <div class="muted" style="font-size:.82rem"><strong>Podés subir PNG, JPG o WebP.</strong> El fondo uniforme se elimina automáticamente y la imagen se guarda como PNG transparente. Funciona mejor con fondos claros o lisos.</div>
        <div id="hoImagePreview" class="imagepreview"><span class="muted">Se usará la foto del producto hasta que cargues un PNG.</span></div>
        <div style="margin-top:10px"><button id="hoRemoveImage" type="button" class="btn light">Usar foto del producto</button></div>
      </div>

      <div class="field" style="margin-top:18px">
        <label>Vista previa de límites · computadora</label>
        <div id="hoGridPreview" class="ho-grid-preview">
          <div id="hoGridOffer" class="ho-grid-offer">
            <div id="hoGridHeadline" class="ho-grid-headline">🔥 OFERTA DESTACADA</div>
            <div id="hoGridImageZone" class="ho-grid-image-zone">
              <span class="muted">Imagen del producto</span>
            </div>
            <div class="ho-grid-copy">
              <span id="hoGridSale">PRECIO ESPECIAL · STOCK</span>
              <strong id="hoGridProduct">Producto destacado</strong>
              <span class="price">$00.000</span>
              <div id="hoGridCta" style="margin-top:3px;font-weight:900">QUIERO ESTA OFERTA →</div>
            </div>
          </div>
        </div>
        <div class="ho-grid-note">Azul: cuadrícula de referencia · rojo: límite total de la oferta · verde: zona de imagen · violeta: textos/precio/botón.</div>
      </div>

      <div class="two">
        <div class="field"><label>Alto imagen · computadora (px)</label><input id="hoImgDesktop" type="number" min="220" max="650" value="320"></div>
        <div class="field"><label>Alto imagen · celular (px)</label><input id="hoImgMobile" type="number" min="200" max="520" value="250"></div>
      </div>

      <h3 style="margin:28px 0 10px">Colores</h3>
      <div class="two">
        <div class="field"><label>Título “Oferta destacada”</label><input id="hoHeadlineColor" type="color" value="#e30613" style="height:44px;padding:4px"></div>
        <div class="field"><label>Nombre del producto</label><input id="hoTitleColor" type="color" value="#111111" style="height:44px;padding:4px"></div>
        <div class="field"><label>Precio actual</label><input id="hoPriceColor" type="color" value="#e30613" style="height:44px;padding:4px"></div>
        <div class="field"><label>Precio anterior</label><input id="hoOldColor" type="color" value="#84868c" style="height:44px;padding:4px"></div>
        <div class="field"><label>“Precio especial”</label><input id="hoSaleColor" type="color" value="#e30613" style="height:44px;padding:4px"></div>
        <div class="field"><label>“Envío gratis”</label><input id="hoShipColor" type="color" value="#158a38" style="height:44px;padding:4px"></div>
        <div class="field"><label>Texto secundario</label><input id="hoMetaColor" type="color" value="#555555" style="height:44px;padding:4px"></div>
        <div class="field"><label>Texto de ahorro</label><input id="hoSavingColor" type="color" value="#4f5157" style="height:44px;padding:4px"></div>
        <div class="field"><label>Fondo círculo descuento</label><input id="hoDiscountBg" type="color" value="#e30613" style="height:44px;padding:4px"></div>
        <div class="field"><label>Texto círculo descuento</label><input id="hoDiscountText" type="color" value="#ffffff" style="height:44px;padding:4px"></div>
        <div class="field"><label>Fondo botón</label><input id="hoButtonBg" type="color" value="#111111" style="height:44px;padding:4px"></div>
        <div class="field"><label>Texto botón</label><input id="hoButtonText" type="color" value="#ffffff" style="height:44px;padding:4px"></div>
      </div>

      <div class="toolbar" style="margin-top:18px">
        <button id="hoSave" class="btn red">Guardar oferta</button>
        <a class="btn light" href="index.html" target="_blank">Ver tienda ↗</a>
      </div>
      <p id="hoOk" class="ok"></p>
      <p id="hoErr" class="formerr"></p>
    </div>
  `;
  const securityPanel=document.getElementById('securityPanel');
  main.insertBefore(panel,securityPanel||null);

  const $=id=>document.getElementById(id);
  let currentImageUrl=null;
  let pendingPng=null;
  let previewObjectUrl=null;

  const colorFields={
    headline_color:'hoHeadlineColor',
    title_color:'hoTitleColor',
    price_color:'hoPriceColor',
    old_price_color:'hoOldColor',
    sale_color:'hoSaleColor',
    shipping_color:'hoShipColor',
    meta_color:'hoMetaColor',
    saving_color:'hoSavingColor',
    discount_bg:'hoDiscountBg',
    discount_text_color:'hoDiscountText',
    button_bg:'hoButtonBg',
    button_text_color:'hoButtonText'
  };

  const preview=url=>{
    const box=$('hoImagePreview');
    box.innerHTML=url?'<img src="'+esc(url)+'" alt="Preview oferta">':'<span class="muted">Se usará la foto del producto hasta que cargues una imagen.</span>';
    const zone=$('hoGridImageZone');
    if(zone)zone.innerHTML=url?'<img src="'+esc(url)+'" alt="Vista previa del producto">':'<span class="muted">Imagen del producto</span>';
    updateGridPreview();
  };

  function updateGridPreview(){
    const grid=$('hoGridOffer');
    if(!grid)return;
    const top=Math.max(-20,Math.min(120,Number($('hoTop')?.value)||0));
    const img=Math.max(220,Math.min(650,Number($('hoImgDesktop')?.value)||320));
    /* La maqueta mide 560×490. Escalamos el alto lógico de imagen para verla completa en el preview. */
    const previewHeight=$('hoGridPreview')?.clientHeight||490;
    const scale=previewHeight/490;
    grid.style.setProperty('--ho-grid-top',(top*scale)+'px');
    grid.style.setProperty('--ho-grid-img',(img*scale)+'px');
    grid.style.setProperty('--ho-headline',$('hoHeadlineColor')?.value||'#e30613');
    grid.style.setProperty('--ho-price',$('hoPriceColor')?.value||'#e30613');
    if($('hoGridHeadline'))$('hoGridHeadline').textContent=$('hoHeadline')?.value||'🔥 OFERTA DESTACADA';
    if($('hoGridSale'))$('hoGridSale').textContent=($('hoSaleText')?.value||'Precio especial').toUpperCase()+' · STOCK';
    if($('hoGridProduct'))$('hoGridProduct').textContent=$('hoProduct')?.selectedOptions?.[0]?.textContent||'Producto destacado';
    if($('hoGridCta'))$('hoGridCta').textContent=($('hoCta')?.value||'Quiero esta oferta').toUpperCase()+' →';
  }

  async function loadHeroAdmin(){
    $('hoErr').textContent='';
    const [{data:prods,error:pe},{data:s,error:se}]=await Promise.all([
      db.from('products').select('id,name,brand,visible').order('name'),
      db.from('hero_offer_settings').select('*').eq('id',1).maybeSingle()
    ]);
    if(pe||se){ $('hoErr').textContent=(pe||se).message; return; }

    $('hoProduct').innerHTML=(prods||[]).map(p=>'<option value="'+esc(p.id)+'">'+esc(p.name)+(p.visible?'':' · oculto')+'</option>').join('');

    const v=s||{};
    if(v.product_id)$('hoProduct').value=v.product_id;
    $('hoEnabled').checked=v.enabled!==false;
    $('hoShowDiscount').checked=v.show_discount!==false;
    $('hoShowShipping').checked=v.show_shipping!==false;
    $('hoShowStock').checked=v.show_stock!==false;
    $('hoShowSaving').checked=v.show_saving!==false;
    $('hoHeadline').value=v.headline||'🔥 OFERTA DESTACADA';
    $('hoSaleText').value=v.sale_text||'Precio especial';
    $('hoCta').value=v.cta_text||'Quiero esta oferta';
    $('hoTop').value=Number.isFinite(Number(v.desktop_top))?v.desktop_top:18;
    $('hoImgDesktop').value=Number.isFinite(Number(v.image_height_desktop))?v.image_height_desktop:320;
    $('hoImgMobile').value=Number.isFinite(Number(v.image_height_mobile))?v.image_height_mobile:250;
    Object.entries(colorFields).forEach(([col,id])=>{if(v[col])$(id).value=v[col]});
    currentImageUrl=v.image_url||null;
    pendingPng=null;
    $('hoImageFile').value='';
    preview(currentImageUrl);
    requestAnimationFrame(updateGridPreview);
  }

  async function processImage(file){
    if(!file)throw new Error('Elegí una imagen.');
    if(!/^image\/(png|jpeg|webp)$/.test(file.type)&&!(/\.(png|jpe?g|webp)$/i.test(file.name||''))){
      throw new Error('Usá PNG, JPG o WebP.');
    }
    if(file.size>8*1024*1024)throw new Error('La imagen supera 8 MB.');

    const objectUrl=URL.createObjectURL(file);
    const img=new Image();
    img.decoding='async';
    try{
      await new Promise((resolve,reject)=>{
        img.onload=resolve;
        img.onerror=()=>reject(new Error('No se pudo leer la imagen.'));
        img.src=objectUrl;
      });

      const maxDim=1400;
      const scale=Math.min(1,maxDim/Math.max(img.naturalWidth||img.width,img.naturalHeight||img.height));
      const w=Math.max(1,Math.round((img.naturalWidth||img.width)*scale));
      const h=Math.max(1,Math.round((img.naturalHeight||img.height)*scale));
      const canvas=document.createElement('canvas');
      canvas.width=w;canvas.height=h;
      const ctx=canvas.getContext('2d',{willReadFrequently:true});
      ctx.drawImage(img,0,0,w,h);

      const image=ctx.getImageData(0,0,w,h);
      const d=image.data;

      /* Color de fondo estimado desde las cuatro esquinas. */
      const samples=[];
      const pad=Math.max(2,Math.round(Math.min(w,h)*.025));
      const take=(x0,y0)=>{
        for(let y=y0;y<Math.min(h,y0+pad);y+=Math.max(1,Math.floor(pad/4))){
          for(let x=x0;x<Math.min(w,x0+pad);x+=Math.max(1,Math.floor(pad/4))){
            const i=(y*w+x)*4;
            if(d[i+3]>40)samples.push([d[i],d[i+1],d[i+2]]);
          }
        }
      };
      take(0,0);take(Math.max(0,w-pad),0);take(0,Math.max(0,h-pad));take(Math.max(0,w-pad),Math.max(0,h-pad));
      const bg=samples.length?samples.reduce((a,p)=>[a[0]+p[0],a[1]+p[1],a[2]+p[2]],[0,0,0]).map(v=>v/samples.length):[255,255,255];

      const maxDist=68;
      const maxDist2=maxDist*maxDist;
      const visited=new Uint8Array(w*h);
      const queue=new Int32Array(w*h);
      let qh=0,qt=0;
      const similar=idx=>{
        const i=idx*4;
        if(d[i+3]<=10)return true;
        const dr=d[i]-bg[0],dg=d[i+1]-bg[1],db=d[i+2]-bg[2];
        return dr*dr+dg*dg+db*db<=maxDist2;
      };
      const push=idx=>{
        if(idx<0||idx>=w*h||visited[idx]||!similar(idx))return;
        visited[idx]=1;queue[qt++]=idx;
      };
      for(let x=0;x<w;x++){push(x);push((h-1)*w+x);}
      for(let y=0;y<h;y++){push(y*w);push(y*w+w-1);}

      while(qh<qt){
        const idx=queue[qh++];
        const i=idx*4;
        d[i+3]=0;
        const x=idx%w,y=(idx/w)|0;
        if(x>0)push(idx-1);
        if(x<w-1)push(idx+1);
        if(y>0)push(idx-w);
        if(y<h-1)push(idx+w);
      }

      ctx.putImageData(image,0,0);
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
      if(!blob)throw new Error('No se pudo convertir la imagen a PNG transparente.');
      if(blob.size>8*1024*1024)throw new Error('La imagen procesada supera 8 MB. Probá con una imagen más chica.');
      return blob;
    }finally{
      URL.revokeObjectURL(objectUrl);
    }
  }

  async function uploadPng(){
    if(!pendingPng)return currentImageUrl;
    const uid=(crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2));
    const path='hero-offer/'+Date.now()+'-'+uid+'.png';
    const {error}=await db.storage.from('product-images').upload(path,pendingPng,{
      upsert:false,
      contentType:'image/png',
      cacheControl:'3600'
    });
    if(error)throw error;
    const {data}=db.storage.from('product-images').getPublicUrl(path);
    if(!data?.publicUrl)throw new Error('La imagen se subió pero no se pudo obtener su URL pública.');
    return data.publicUrl;
  }

  $('hoImageFile').addEventListener('change',async()=>{
    const file=$('hoImageFile').files?.[0]||null;
    $('hoErr').textContent='';
    if(!file){pendingPng=null;preview(currentImageUrl);return;}
    try{
      $('hoOk').textContent='Procesando imagen y quitando fondo…';
      pendingPng=await processImage(file);
      if(previewObjectUrl)URL.revokeObjectURL(previewObjectUrl);
      previewObjectUrl=URL.createObjectURL(pendingPng);
      preview(previewObjectUrl);
      $('hoOk').textContent='✓ Fondo procesado. Revisá la cuadrícula y guardá la oferta.';
    }catch(err){
      $('hoImageFile').value='';
      pendingPng=null;
      preview(currentImageUrl);
      $('hoOk').textContent='';
      $('hoErr').textContent=err?.message||String(err);
    }
  });

  $('hoRemoveImage').onclick=()=>{
    currentImageUrl=null;
    pendingPng=null;
    $('hoImageFile').value='';
    preview(null);
  };

  $('hoSave').onclick=async()=>{
    $('hoOk').textContent=''; $('hoErr').textContent='';
    try{
      const imageUrl=await uploadPng();
      const payload={
        id:1,
        enabled:$('hoEnabled').checked,
        product_id:$('hoProduct').value||null,
        headline:$('hoHeadline').value.trim()||'🔥 OFERTA DESTACADA',
        sale_text:$('hoSaleText').value.trim()||'Precio especial',
        cta_text:$('hoCta').value.trim()||'Quiero esta oferta',
        image_url:imageUrl||null,
        desktop_top:Number($('hoTop').value)||0,
        image_height_desktop:Number($('hoImgDesktop').value)||320,
        image_height_mobile:Number($('hoImgMobile').value)||250,
        show_discount:$('hoShowDiscount').checked,
        show_shipping:$('hoShowShipping').checked,
        show_stock:$('hoShowStock').checked,
        show_saving:$('hoShowSaving').checked,
        updated_at:new Date().toISOString()
      };
      Object.entries(colorFields).forEach(([col,id])=>payload[col]=$(id).value);
      const {error}=await db.from('hero_offer_settings').upsert(payload,{onConflict:'id'});
      if(error)throw error;
      currentImageUrl=imageUrl||null;
      pendingPng=null;
      $('hoImageFile').value='';
      preview(currentImageUrl);
      $('hoOk').textContent='✓ Oferta actualizada.';
    }catch(err){
      $('hoErr').textContent=err?.message||String(err);
    }
  };

  ['hoTop','hoImgDesktop','hoHeadline','hoSaleText','hoCta','hoProduct','hoHeadlineColor','hoPriceColor'].forEach(id=>{
    $(id)?.addEventListener('input',updateGridPreview);
    $(id)?.addEventListener('change',updateGridPreview);
  });
  window.addEventListener('resize',updateGridPreview);

  btn.addEventListener('click',async()=>{
    document.querySelectorAll('.sidebtn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    ['productsPanel','combosPanel','categoriesPanel','promotionsPanel','securityPanel'].forEach(id=>document.getElementById(id)?.classList.add('hidden'));
    panel.classList.remove('hidden');
    if($('pageTitle'))$('pageTitle').textContent='Oferta principal';
    if($('newAction'))$('newAction').classList.add('hidden');
    await loadHeroAdmin();
  });

  document.querySelectorAll('.sidebtn[data-panel]').forEach(existing=>{
    existing.addEventListener('click',()=>panel.classList.add('hidden'));
  });
})();

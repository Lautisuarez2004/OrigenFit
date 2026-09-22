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
        <div class="field"><input id="hoImageFile" type="file" accept="image/png,.png"></div>
        <div class="muted" style="font-size:.82rem"><strong>Usar únicamente PNG con fondo transparente.</strong> Así las nubes rojas quedan detrás del producto sin recuadros blancos.</div>
        <div id="hoImagePreview" class="imagepreview"><span class="muted">Se usará la foto del producto hasta que cargues un PNG.</span></div>
        <div style="margin-top:10px"><button id="hoRemoveImage" type="button" class="btn light">Usar foto del producto</button></div>
      </div>

      <div class="two">
        <div class="field"><label>Alto imagen · computadora (px)</label><input id="hoImgDesktop" type="number" min="220" max="650" value="365"></div>
        <div class="field"><label>Alto imagen · celular (px)</label><input id="hoImgMobile" type="number" min="200" max="520" value="285"></div>
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
    box.innerHTML=url?'<img src="'+esc(url)+'" alt="Preview oferta">':'<span class="muted">Se usará la foto del producto hasta que cargues un PNG.</span>';
  };

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
    $('hoImgDesktop').value=Number.isFinite(Number(v.image_height_desktop))?v.image_height_desktop:365;
    $('hoImgMobile').value=Number.isFinite(Number(v.image_height_mobile))?v.image_height_mobile:285;
    Object.entries(colorFields).forEach(([col,id])=>{if(v[col])$(id).value=v[col]});
    currentImageUrl=v.image_url||null;
    pendingPng=null;
    $('hoImageFile').value='';
    preview(currentImageUrl);
  }

  async function uploadPng(){
    if(!pendingPng)return currentImageUrl;
    if(pendingPng.type!=='image/png'&&!/\.png$/i.test(pendingPng.name||'')){
      throw new Error('La imagen de la oferta debe ser PNG.');
    }
    const path='hero-offer/'+Date.now()+'-'+Math.random().toString(36).slice(2,8)+'.png';
    const {error}=await db.storage.from('product-images').upload(path,pendingPng,{contentType:'image/png',upsert:false});
    if(error)throw error;
    const {data}=db.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  }

  $('hoImageFile').addEventListener('change',()=>{
    const file=$('hoImageFile').files?.[0]||null;
    $('hoErr').textContent='';
    if(!file){pendingPng=null;preview(currentImageUrl);return;}
    if(file.type!=='image/png'&&!/\.png$/i.test(file.name||'')){
      $('hoImageFile').value='';
      pendingPng=null;
      $('hoErr').textContent='Usá únicamente PNG con fondo transparente.';
      return;
    }
    pendingPng=file;
    preview(URL.createObjectURL(file));
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
        image_height_desktop:Number($('hoImgDesktop').value)||365,
        image_height_mobile:Number($('hoImgMobile').value)||285,
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

/* Origen Fit · mejoras de producto para admin: envío gratis + galería + texto promo */
document.addEventListener('DOMContentLoaded',()=>{
  const $=id=>document.getElementById(id);
  const panel=$('productFormPanel');
  if(!panel || typeof db==='undefined') return;

  const checks=panel.querySelector('.checks');
  if(checks && !$('pFreeShipping')){
    const label=document.createElement('label');
    label.innerHTML='<input id="pFreeShipping" type="checkbox"> Envío gratis';
    checks.appendChild(label);
  }

  const promoInput=$('pPromo');
  if(promoInput && !$('pPromoLabel')){
    const field=document.createElement('div');
    field.className='field';
    field.innerHTML='<label>Texto del precio promo <span class="muted" style="font-weight:600">(opcional)</span></label><input id="pPromoLabel" placeholder="Ej: Efectivo / transferencia">';
    const promoRow=promoInput.closest('.two');
    (promoRow||promoInput.closest('.field'))?.insertAdjacentElement('afterend',field);
  }

  const mainImageBox=panel.querySelector('.imagebox');
  if(mainImageBox && !$('pGalleryBox')){
    const box=document.createElement('div');
    box.className='imagebox';
    box.id='pGalleryBox';
    box.innerHTML=`
      <strong>Galería del producto</strong>
      <div class="field"><input id="pGalleryFiles" type="file" accept="image/jpeg,image/png,image/webp" multiple></div>
      <div class="muted" style="font-size:.82rem">Podés seleccionar varias fotos. La foto principal de arriba se muestra primero.</div>
      <div id="pGalleryPreview" class="of-gallery-admin"><span class="muted">Todavía no hay fotos adicionales.</span></div>
    `;
    mainImageBox.insertAdjacentElement('afterend',box);
    const style=document.createElement('style');
    style.textContent=`
      .of-gallery-admin{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:10px;margin-top:12px}
      .of-gallery-thumb{position:relative;border:1px solid var(--l);border-radius:12px;background:#fff;overflow:hidden;aspect-ratio:1}
      .of-gallery-thumb img{width:100%;height:100%;object-fit:contain;display:block;padding:6px}
      .of-gallery-thumb button{position:absolute;top:5px;right:5px;width:28px;height:28px;border:0;border-radius:50%;background:#111;color:#fff;font-weight:900;cursor:pointer}
      .of-gallery-pending{border-style:dashed;opacity:.72}
    `;
    document.head.appendChild(style);
  }

  let currentGallery=[];
  const galleryInput=$('pGalleryFiles');
  const galleryPreview=$('pGalleryPreview');
  const freeShipping=$('pFreeShipping');
  const promoLabel=$('pPromoLabel');

  const escapeHtml=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeName=name=>String(name||'foto').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/-+/g,'-').slice(-80);

  function renderGallery(){
    const pending=[...(galleryInput?.files||[])];
    const existing=currentGallery.map(row=>`
      <div class="of-gallery-thumb" data-gallery-id="${row.id}">
        <img src="${escapeHtml(row.image_url)}" alt="">
        <button type="button" data-delete-gallery="${row.id}" aria-label="Eliminar foto">×</button>
      </div>`).join('');
    const waiting=pending.map(file=>`
      <div class="of-gallery-thumb of-gallery-pending">
        <img src="${URL.createObjectURL(file)}" alt="">
      </div>`).join('');
    galleryPreview.innerHTML=existing+waiting || '<span class="muted">Todavía no hay fotos adicionales.</span>';
  }

  async function loadEnhancements(){
    const id=$('productId')?.value;
    if(!id){
      if(freeShipping) freeShipping.checked=false;
      if(promoLabel) promoLabel.value='';
      currentGallery=[];
      if(galleryInput) galleryInput.value='';
      renderGallery();
      return;
    }
    const [{data:p,error:pe},{data:g,error:ge}]=await Promise.all([
      db.from('products').select('free_shipping,promo_label').eq('id',id).single(),
      db.from('product_images').select('id,image_url,storage_path,sort_order').eq('product_id',id).order('sort_order').order('created_at')
    ]);
    if(!pe){
      if(freeShipping) freeShipping.checked=!!p?.free_shipping;
      if(promoLabel) promoLabel.value=p?.promo_label||'';
    }
    if(!ge) currentGallery=g||[];
    if(galleryInput) galleryInput.value='';
    renderGallery();
  }

  $('productList')?.addEventListener('click',()=>setTimeout(loadEnhancements,80));
  $('newAction')?.addEventListener('click',()=>setTimeout(loadEnhancements,30));
  $('pClear')?.addEventListener('click',()=>setTimeout(loadEnhancements,30));
  galleryInput?.addEventListener('change',renderGallery);

  galleryPreview?.addEventListener('click',async e=>{
    const id=e.target?.dataset?.deleteGallery;
    if(!id) return;
    const row=currentGallery.find(x=>x.id===id);
    if(!row) return;
    e.target.disabled=true;
    try{
      if(row.storage_path) await db.storage.from('product-images').remove([row.storage_path]);
      const {error}=await db.from('product_images').delete().eq('id',id);
      if(error) throw error;
      currentGallery=currentGallery.filter(x=>x.id!==id);
      renderGallery();
    }catch(err){
      e.target.disabled=false;
      alert('No se pudo eliminar la foto: '+(err.message||err));
    }
  });

  const waitForCoreSave=()=>new Promise(resolve=>{
    const started=Date.now();
    const tick=()=>{
      const ok=$('pOk')?.textContent||'';
      const err=$('pErr')?.textContent||'';
      if(/guardado correctamente/i.test(ok) || err || Date.now()-started>15000) resolve({ok,err});
      else setTimeout(tick,120);
    };
    setTimeout(tick,80);
  });

  $('pSave')?.addEventListener('click',async()=>{
    const desiredFreeShipping=!!freeShipping?.checked;
    const desiredPromoLabel=promoLabel?.value.trim()||'';
    const pending=[...(galleryInput?.files||[])];
    const outcome=await waitForCoreSave();
    if(outcome.err || !/guardado correctamente/i.test(outcome.ok)) return;
    const productId=$('productId')?.value;
    if(!productId) return;

    try{
      const {error:updateError}=await db.from('products').update({
        free_shipping:desiredFreeShipping,
        promo_label:desiredPromoLabel
      }).eq('id',productId);
      if(updateError) throw updateError;

      let sort=currentGallery.reduce((m,x)=>Math.max(m,Number(x.sort_order||0)),0)+1;
      for(const file of pending){
        if(!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error(`Formato no permitido: ${file.name}`);
        if(file.size>8*1024*1024) throw new Error(`${file.name} supera 8 MB`);
        const uid=(crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2));
        const path=`gallery/${productId}/${Date.now()}-${uid}-${safeName(file.name)}`;
        const {error:uploadError}=await db.storage.from('product-images').upload(path,file,{upsert:false,contentType:file.type});
        if(uploadError) throw uploadError;
        const {data:urlData}=db.storage.from('product-images').getPublicUrl(path);
        const imageUrl=urlData?.publicUrl;
        const {error:insertError}=await db.from('product_images').insert({
          product_id:productId,image_url:imageUrl,storage_path:path,sort_order:sort++
        });
        if(insertError){
          await db.storage.from('product-images').remove([path]);
          throw insertError;
        }
      }
      if($('pOk')) $('pOk').textContent='✓ Producto, opciones y galería guardados.';
      await loadEnhancements();
    }catch(err){
      if($('pErr')) $('pErr').textContent='Producto guardado, pero faltó completar opciones/galería: '+(err.message||err);
    }
  });

  $('pDelete')?.addEventListener('click',()=>{
    const paths=currentGallery.map(x=>x.storage_path).filter(Boolean);
    if(!paths.length) return;
    setTimeout(async()=>{
      if(!$('productId')?.value){
        try{ await db.storage.from('product-images').remove(paths); }catch(_){}
      }
    },500);
  });

  setTimeout(loadEnhancements,100);
});

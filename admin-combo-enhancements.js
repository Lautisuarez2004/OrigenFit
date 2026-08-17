/* Origen Fit · mejoras de combos para admin: envío gratis, texto promo y galería */
document.addEventListener('DOMContentLoaded',()=>{
  const $=id=>document.getElementById(id);
  const panel=$('comboFormPanel');
  if(!panel||typeof db==='undefined')return;

  const promo=$('coPromo');
  const priceRow=promo?.closest('.two');
  if(priceRow&&!$('coPromoLabel')){
    const field=document.createElement('div');field.className='field';field.innerHTML='<label>Texto del precio promo</label><input id="coPromoLabel" placeholder="Ej. Efectivo / transferencia">';priceRow.insertAdjacentElement('afterend',field);
  }

  const checks=panel.querySelector('.checks');
  if(checks&&!$('coFreeShipping')){
    const label=document.createElement('label');label.innerHTML='<input id="coFreeShipping" type="checkbox"> Envío gratis';checks.appendChild(label);
  }

  const mainImageBox=panel.querySelector('.imagebox');
  if(mainImageBox&&!$('coGalleryBox')){
    const box=document.createElement('div');box.className='imagebox';box.id='coGalleryBox';box.innerHTML=`
      <strong>Galería del combo</strong>
      <div class="field"><input id="coGalleryFiles" type="file" accept="image/jpeg,image/png,image/webp" multiple></div>
      <div class="muted" style="font-size:.82rem">Podés seleccionar varias fotos. La foto principal de arriba se muestra primero.</div>
      <div id="coGalleryPreview" class="of-gallery-admin"><span class="muted">Todavía no hay fotos adicionales.</span></div>`;
    mainImageBox.insertAdjacentElement('afterend',box);
    const style=document.createElement('style');style.textContent=`.of-gallery-admin{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:10px;margin-top:12px}.of-gallery-thumb{position:relative;border:1px solid var(--l);border-radius:12px;background:#fff;overflow:hidden;aspect-ratio:1}.of-gallery-thumb img{width:100%;height:100%;object-fit:contain;display:block;padding:6px}.of-gallery-thumb button{position:absolute;top:5px;right:5px;width:28px;height:28px;border:0;border-radius:50%;background:#111;color:#fff;font-weight:900;cursor:pointer}.of-gallery-pending{border-style:dashed;opacity:.72}`;document.head.appendChild(style);
  }

  let currentGallery=[];
  const galleryInput=$('coGalleryFiles'),galleryPreview=$('coGalleryPreview'),freeShipping=$('coFreeShipping'),promoLabel=$('coPromoLabel');
  const escapeHtml=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeName=name=>String(name||'foto').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/-+/g,'-').slice(-80);

  function renderGallery(){
    const pending=[...(galleryInput?.files||[])];
    const existing=currentGallery.map(row=>`<div class="of-gallery-thumb" data-gallery-id="${row.id}"><img src="${escapeHtml(row.image_url)}" alt=""><button type="button" data-delete-gallery="${row.id}" aria-label="Eliminar foto">×</button></div>`).join('');
    const waiting=pending.map(file=>`<div class="of-gallery-thumb of-gallery-pending"><img src="${URL.createObjectURL(file)}" alt=""></div>`).join('');
    galleryPreview.innerHTML=existing+waiting||'<span class="muted">Todavía no hay fotos adicionales.</span>';
  }

  async function loadEnhancements(){
    const id=$('comboId')?.value;
    if(!id){freeShipping.checked=false;promoLabel.value='';currentGallery=[];if(galleryInput)galleryInput.value='';renderGallery();return;}
    const [{data:c,error:ce},{data:g,error:ge}]=await Promise.all([
      db.from('combos').select('free_shipping,promo_label').eq('id',id).single(),
      db.from('combo_images').select('id,image_url,storage_path,sort_order').eq('combo_id',id).order('sort_order').order('created_at')
    ]);
    if(!ce){freeShipping.checked=!!c?.free_shipping;promoLabel.value=c?.promo_label||'';}
    if(!ge)currentGallery=g||[];
    if(galleryInput)galleryInput.value='';renderGallery();
  }

  $('comboList')?.addEventListener('click',()=>setTimeout(loadEnhancements,80));
  $('newAction')?.addEventListener('click',()=>setTimeout(()=>{if(!$('combosPanel')?.classList.contains('hidden'))loadEnhancements();},40));
  $('coClear')?.addEventListener('click',()=>setTimeout(loadEnhancements,30));
  galleryInput?.addEventListener('change',renderGallery);

  galleryPreview?.addEventListener('click',async e=>{
    const id=e.target?.dataset?.deleteGallery;if(!id)return;
    const row=currentGallery.find(x=>x.id===id);if(!row)return;e.target.disabled=true;
    try{if(row.storage_path)await db.storage.from('combo-images').remove([row.storage_path]);const {error}=await db.from('combo_images').delete().eq('id',id);if(error)throw error;currentGallery=currentGallery.filter(x=>x.id!==id);renderGallery();}catch(err){e.target.disabled=false;alert('No se pudo eliminar la foto: '+(err.message||err));}
  });

  const waitForCoreSave=()=>new Promise(resolve=>{
    const started=Date.now();
    const tick=()=>{const ok=$('coOk')?.textContent||'',err=$('coErr')?.textContent||'';if(/guardado/i.test(ok)||err||Date.now()-started>15000)resolve({ok,err});else setTimeout(tick,120);};setTimeout(tick,80);
  });

  $('coSave')?.addEventListener('click',async()=>{
    const desiredFreeShipping=!!freeShipping?.checked,desiredPromoLabel=promoLabel?.value.trim()||'',pending=[...(galleryInput?.files||[])];
    const outcome=await waitForCoreSave();if(outcome.err||!/guardado/i.test(outcome.ok))return;
    const comboId=$('comboId')?.value;if(!comboId)return;
    try{
      const {error:updateError}=await db.from('combos').update({free_shipping:desiredFreeShipping,promo_label:desiredPromoLabel}).eq('id',comboId);if(updateError)throw updateError;
      let sort=currentGallery.reduce((m,x)=>Math.max(m,Number(x.sort_order||0)),0)+1;
      for(const file of pending){
        if(!/^image\/(jpeg|png|webp)$/.test(file.type))throw new Error(`Formato no permitido: ${file.name}`);
        if(file.size>8*1024*1024)throw new Error(`${file.name} supera 8 MB`);
        const uid=(crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2));
        const path=`gallery/${comboId}/${Date.now()}-${uid}-${safeName(file.name)}`;
        const {error:uploadError}=await db.storage.from('combo-images').upload(path,file,{upsert:false,contentType:file.type});if(uploadError)throw uploadError;
        const {data:urlData}=db.storage.from('combo-images').getPublicUrl(path);const imageUrl=urlData?.publicUrl;
        const {error:insertError}=await db.from('combo_images').insert({combo_id:comboId,image_url:imageUrl,storage_path:path,sort_order:sort++});
        if(insertError){await db.storage.from('combo-images').remove([path]);throw insertError;}
      }
      if($('coOk'))$('coOk').textContent='✓ Combo, envío y galería guardados.';await loadEnhancements();
    }catch(err){if($('coErr'))$('coErr').textContent='Combo guardado, pero faltó completar envío/galería: '+(err.message||err);}
  });

  setTimeout(()=>{if(!$('combosPanel')?.classList.contains('hidden'))loadEnhancements();},120);
});

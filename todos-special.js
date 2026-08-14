/*
 * Categoría especial "Todos".
 * Se guarda como un registro normal en categories para poder editar su imagen,
 * pero en la tienda conserva data-category="" para mostrar el catálogo completo.
 */
document.addEventListener('DOMContentLoaded',()=>{
  const isAdmin=!!document.getElementById('categoriesPanel');
  const isStore=!!document.getElementById('categoriesGrid');

  const isTodosName=value=>String(value||'').trim().toLocaleLowerCase('es')==='todos';

  if(isStore){
    const grid=document.getElementById('categoriesGrid');
    const drawer=document.getElementById('drawerCategories');
    let todosImageUrl='';

    const escAttr=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

    const cleanAndDecorate=()=>{
      if(grid){
        [...grid.querySelectorAll('.category-card')].forEach(card=>{
          if(card.classList.contains('category-all')) return;
          if(isTodosName(card.dataset.category)) card.remove();
        });
        const allCard=grid.querySelector('.category-card.category-all[data-category=""]');
        if(allCard && todosImageUrl){
          const art=allCard.querySelector('.category-art');
          const current=art?.querySelector('img')?.getAttribute('src')||'';
          if(art && current!==todosImageUrl){
            art.innerHTML=`<img src="${escAttr(todosImageUrl)}" alt="Todos los productos">`;
          }
        }
      }

      if(drawer){
        [...drawer.querySelectorAll('.drawer-category')].forEach(btn=>{
          if((btn.dataset.category||'')==='' ) return;
          if(isTodosName(btn.dataset.category)) btn.remove();
        });
        const allBtn=drawer.querySelector('.drawer-category[data-category=""]');
        const thumb=allBtn?.querySelector('.drawer-thumb');
        if(thumb && todosImageUrl){
          const current=thumb.querySelector('img')?.getAttribute('src')||'';
          if(current!==todosImageUrl){
            thumb.innerHTML=`<img src="${escAttr(todosImageUrl)}" alt="Todos los productos">`;
          }
        }
      }
    };

    if(grid) new MutationObserver(()=>requestAnimationFrame(cleanAndDecorate)).observe(grid,{childList:true,subtree:true});
    if(drawer) new MutationObserver(()=>requestAnimationFrame(cleanAndDecorate)).observe(drawer,{childList:true,subtree:true});

    (async()=>{
      try{
        const {data,error}=await db.from('categories').select('id,name,image_url,visible').ilike('name','Todos').limit(1).maybeSingle();
        if(error) throw error;
        todosImageUrl=data?.image_url||'';
      }catch(err){
        console.warn('Imagen de categoría Todos:',err?.message||err);
      }
      cleanAndDecorate();
    })();
  }

  if(isAdmin){
    const list=document.getElementById('categoryList');
    const nameInput=document.getElementById('cName');
    const orderInput=document.getElementById('cOrd');
    const visibleInput=document.getElementById('cVisible');
    const deleteBtn=document.getElementById('cDelete');
    const title=document.getElementById('categoryTitle');
    const preview=document.getElementById('cImagePreview');
    const newAction=document.getElementById('newAction');
    const clearBtn=document.getElementById('cClear');
    const datalist=document.getElementById('categoryOptions');

    let syntheticActive=false;

    const unlockTodosForm=()=>{
      syntheticActive=false;
      if(nameInput) nameInput.disabled=false;
      if(visibleInput) visibleInput.disabled=false;
    };

    const protectTodosForm=()=>{
      if(nameInput){ nameInput.value='Todos'; nameInput.disabled=true; }
      if(orderInput && (orderInput.value==='' || Number(orderInput.value)>0)) orderInput.value='0';
      if(visibleInput){ visibleInput.checked=true; visibleInput.disabled=true; }
      if(deleteBtn) deleteBtn.classList.add('hidden');
      if(title) title.textContent='Editar categoría Todos';
    };

    const openSyntheticTodos=()=>{
      syntheticActive=true;
      try{
        categorySelected=null;
        currentCategoryImageUrl=null;
        newCategoryImageFile=null;
        removeCategoryImage=false;
      }catch(_){ }
      const id=document.getElementById('categoryId');
      const file=document.getElementById('cImageFile');
      const ok=document.getElementById('cOk');
      const err=document.getElementById('cErr');
      if(id) id.value='';
      if(file) file.value='';
      if(preview) preview.innerHTML='<span class="muted">Sin imagen seleccionada</span>';
      if(ok) ok.textContent='';
      if(err) err.textContent='';
      if(orderInput) orderInput.value='0';
      protectTodosForm();
      document.getElementById('categoryFormPanel')?.scrollIntoView({behavior:'smooth',block:'start'});
    };

    const scrubProductOptions=()=>{
      if(!datalist) return;
      [...datalist.querySelectorAll('option')].forEach(o=>{
        if(isTodosName(o.value)) o.remove();
      });
    };

    const decorateAdminList=()=>{
      if(!list) return;
      const buttons=[...list.querySelectorAll('button.item')];
      const existing=buttons.find(b=>/^todos(?:\s|$)/i.test((b.querySelector('b')?.textContent||'').trim()));

      if(existing){
        existing.dataset.specialTodos='1';
        existing.querySelector('small') && (existing.querySelector('small').textContent='Categoría especial · Imagen del filtro general');
      }else if(!list.querySelector('[data-synthetic-todos="1"]')){
        const b=document.createElement('button');
        b.type='button';
        b.className='item';
        b.dataset.syntheticTodos='1';
        b.innerHTML='<b>Todos</b><small>Categoría especial · Cargá acá la imagen general</small>';
        b.addEventListener('click',openSyntheticTodos);
        list.prepend(b);
      }
      scrubProductOptions();
    };

    if(list){
      new MutationObserver(()=>requestAnimationFrame(decorateAdminList)).observe(list,{childList:true,subtree:true});
      decorateAdminList();
    }
    if(datalist){
      new MutationObserver(()=>requestAnimationFrame(scrubProductOptions)).observe(datalist,{childList:true});
      scrubProductOptions();
    }

    document.addEventListener('click',e=>{
      const item=e.target.closest?.('#categoryList button.item');
      if(item?.dataset.specialTodos==='1'){
        syntheticActive=false;
        setTimeout(protectTodosForm,0);
        return;
      }
      if(item && item.dataset.syntheticTodos!=='1'){
        setTimeout(unlockTodosForm,0);
      }
    },true);

    newAction?.addEventListener('click',()=>{
      const active=document.querySelector('.sidebtn[data-panel="categories"].active');
      if(active) setTimeout(unlockTodosForm,0);
    },true);
    clearBtn?.addEventListener('click',()=>setTimeout(unlockTodosForm,0),true);

    const saveBtn=document.getElementById('cSave');
    saveBtn?.addEventListener('click',()=>{
      if(syntheticActive) protectTodosForm();
    },true);
  }
});

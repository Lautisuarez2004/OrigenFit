/* Origen Fit · selector de sabores dentro del carrito para Productos y Combos */
document.addEventListener('DOMContentLoaded',()=>{
  const normalize=s=>String(s||'').trim();
  const cleanFlavors=list=>Array.isArray(list)?[...new Set(list.map(normalize).filter(Boolean))]:[];
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const style=document.createElement('style');
  style.textContent=`
    .of-flavor-picker{padding:16px;border-bottom:1px solid #e7e7e9;background:#fafafa}
    .of-flavor-picker-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}
    .of-flavor-picker-kicker{font-size:.68rem;letter-spacing:.09em;text-transform:uppercase;font-weight:950;color:#777;margin-bottom:4px}
    .of-flavor-picker-title{font-size:1rem;font-weight:950;line-height:1.25;color:#111}
    .of-flavor-picker-sub{font-size:.82rem;color:#666;font-weight:750;margin-top:4px}
    .of-flavor-picker-close{border:0;background:#ececef;color:#111;width:32px;height:32px;border-radius:50%;font-size:1.15rem;line-height:1;cursor:pointer;flex:none}
    .of-flavor-options{display:flex;gap:8px;flex-wrap:wrap}
    .of-flavor-option{border:1px solid #d7d7dc;background:#fff;color:#111;border-radius:10px;padding:9px 12px;font-weight:900;cursor:pointer}
    .of-flavor-option:hover{border-color:var(--red,#e30613);color:var(--red,#e30613)}
  `;
  document.head.appendChild(style);

  function removePicker(){document.getElementById('ofFlavorPicker')?.remove();}

  function choose({type,id,name,flavors,flavorLabel}){
    const cart=window.ORIGENFIT_CART;
    if(!cart)return false;
    const options=cleanFlavors(flavors);
    if(!options.length){
      return type==='combo'?!!cart.addCombo?.(String(id),''):!!(cart.addProduct?.(String(id),'')||cart.add?.(String(id),''));
    }

    cart.open?.();
    removePicker();
    const drawer=document.getElementById('ofCart');
    const body=document.getElementById('ofCartBody');
    if(!drawer||!body)return false;

    const label=normalize(flavorLabel)||'Sabor';
    const panel=document.createElement('div');
    panel.id='ofFlavorPicker';panel.className='of-flavor-picker';
    panel.innerHTML=`
      <div class="of-flavor-picker-head">
        <div>
          <div class="of-flavor-picker-kicker">Elegí antes de agregar</div>
          <div class="of-flavor-picker-title">${esc(name||'Producto')}</div>
          <div class="of-flavor-picker-sub">${label==='Sabor'?'Sabor':`Sabor de ${esc(label)}`}</div>
        </div>
        <button class="of-flavor-picker-close" type="button" aria-label="Cancelar selección">×</button>
      </div>
      <div class="of-flavor-options">${options.map(f=>`<button class="of-flavor-option" type="button" data-flavor="${esc(f)}">${esc(f)}</button>`).join('')}</div>`;
    body.insertAdjacentElement('beforebegin',panel);
    panel.querySelector('.of-flavor-picker-close').onclick=removePicker;
    panel.querySelectorAll('.of-flavor-option').forEach(btn=>btn.onclick=()=>{
      const flavor=btn.dataset.flavor||'';
      removePicker();
      if(type==='combo')cart.addCombo?.(String(id),flavor);
      else if(cart.addProduct)cart.addProduct(String(id),flavor);
      else cart.add?.(String(id),flavor);
    });
    return true;
  }

  window.ORIGENFIT_FLAVOR_CART={choose,close:removePicker};
});

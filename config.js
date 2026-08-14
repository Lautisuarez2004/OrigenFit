window.ORIGENFIT_CONFIG={
  supabaseUrl:"https://bxnvquawhukqsmeqlfwa.supabase.co",
  supabaseKey:"sb_publishable_htQd5YCWT6cGgzicfKg-Ww_QsSin_Xz"
};

/*
 * Búsqueda global:
 * - Al escribir una búsqueda, se quita cualquier categoría activa para buscar
 *   en todo el catálogo.
 * - Al elegir una categoría, se limpia la búsqueda para volver al filtrado
 *   exclusivo por categoría.
 */
document.addEventListener('DOMContentLoaded',()=>{
  const searchInput=document.getElementById('productSearch');
  const searchButton=document.getElementById('searchBtn');
  if(!searchInput) return;

  const enableGlobalSearch=()=>{
    if(!searchInput.value.trim()) return;
    try{
      activeCategory='';
      syncCategorySelection();
    }catch(err){
      console.warn('No se pudo limpiar la categoría para la búsqueda global:',err);
    }
  };

  // Capture asegura que la categoría se limpie antes de ejecutar la búsqueda existente.
  searchInput.addEventListener('input',enableGlobalSearch,true);
  searchInput.addEventListener('keydown',e=>{
    if(e.key==='Enter') enableGlobalSearch();
  },true);
  if(searchButton){
    searchButton.addEventListener('click',enableGlobalSearch,true);
  }

  // Si el usuario vuelve a elegir una categoría, la búsqueda deja de aplicarse.
  document.addEventListener('click',e=>{
    const categoryButton=e.target.closest?.('.category-card, .drawer-category');
    if(!categoryButton) return;
    searchInput.value='';
    try{
      activeSearch='';
    }catch(err){
      console.warn('No se pudo limpiar la búsqueda al elegir categoría:',err);
    }
  },true);
});

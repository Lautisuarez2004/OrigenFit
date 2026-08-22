/* Origen Fit · categorías con miniaturas contenidas, centradas y simétricas */
document.addEventListener('DOMContentLoaded',()=>{
  const style=document.createElement('style');
  style.id='of-category-image-fit';
  style.textContent=`
    .categories-grid .category-card{
      display:grid!important;
      grid-template-rows:132px 40px!important;
      align-items:center!important;
      padding:12px 14px!important;
    }
    .categories-grid .category-card .category-art{
      width:100%!important;
      height:132px!important;
      min-height:132px!important;
      max-height:132px!important;
      margin:0!important;
      padding:18px!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      overflow:hidden!important;
      background:#fff!important;
      border-radius:14px!important;
    }
    .categories-grid .category-card .category-art img{
      display:block!important;
      width:auto!important;
      height:auto!important;
      max-width:112px!important;
      max-height:98px!important;
      object-fit:contain!important;
      object-position:center!important;
      margin:auto!important;
    }
    .categories-grid .category-card .category-name{
      min-height:40px!important;
      display:grid!important;
      place-items:center!important;
      padding-top:6px!important;
      line-height:1.15!important;
      text-align:center!important;
    }
    @media(max-width:650px){
      .categories-grid .category-card{
        grid-template-rows:112px 38px!important;
        padding:10px 12px!important;
      }
      .categories-grid .category-card .category-art{
        height:112px!important;
        min-height:112px!important;
        max-height:112px!important;
        padding:16px!important;
      }
      .categories-grid .category-card .category-art img{
        max-width:88px!important;
        max-height:82px!important;
      }
      .categories-grid .category-card .category-name{
        min-height:38px!important;
        font-size:.94rem!important;
      }
    }
  `;
  document.head.appendChild(style);
});

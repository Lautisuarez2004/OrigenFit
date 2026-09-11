/* Origen Fit · header aprobado: wordmark negro/rojo sobre fondo blanco. */
document.addEventListener('DOMContentLoaded',()=>{
  const oldLogo=document.querySelector('.header-logo');
  if(!oldLogo || document.querySelector('.of-header-brand')) return;

  const brand=document.createElement('a');
  brand.className='of-header-brand';
  brand.href='/';
  brand.setAttribute('aria-label','Origen Fit');
  brand.innerHTML='<span class="of-header-wordmark"><span>ORIGEN</span><strong>FIT</strong></span>';
  oldLogo.replaceWith(brand);

  const style=document.createElement('style');
  style.id='of-header-brand-style';
  style.textContent=`
    .shop-header{
      background:#fff!important;
      color:#111!important;
      border-bottom:3px solid var(--red,#e30613)!important;
      box-shadow:0 5px 18px rgba(0,0,0,.10)!important;
    }
    .header-main{min-height:88px!important}
    .of-header-brand{
      justify-self:center;
      display:flex;
      align-items:center;
      justify-content:center;
      min-width:0;
      padding:4px 8px;
      color:#111;
      background:#fff;
      text-decoration:none;
    }
    .of-header-wordmark{
      display:flex;
      align-items:center;
      white-space:nowrap;
      font-family:Inter,Arial,Helvetica,sans-serif;
      font-size:clamp(1.55rem,3vw,2rem);
      line-height:1;
      font-weight:950;
      font-style:italic;
      letter-spacing:-.07em;
    }
    .of-header-wordmark span{color:#111}
    .of-header-wordmark strong{color:var(--red,#e30613);font:inherit;margin-left:2px}

    .shop-header .icon-btn{color:#111!important}
    .shop-header .icon-btn:hover{background:#f2f2f3!important}
    .shop-header .hamburger span{background:#111!important}
    .shop-header a.icon-btn[href*="wa.me"]{
      background:var(--red,#e30613)!important;
      color:#fff!important;
      width:46px!important;
      height:46px!important;
      border-radius:50%!important;
    }
    .shop-header a.icon-btn[href*="wa.me"]:hover{background:var(--red-dark,#b60009)!important}
    .shop-header .search-wrap{padding-top:2px!important}
    .shop-header .search-box{
      background:#f5f5f6!important;
      border:1px solid #e4e4e7!important;
      box-shadow:none!important;
    }
    .shop-header .search-box input,
    .shop-header .search-box button{background:transparent!important;color:#111!important}

    @media(max-width:650px){
      .header-main{min-height:76px!important;grid-template-columns:46px 1fr 46px!important;gap:7px!important}
      .of-header-brand{padding:3px 4px}
      .of-header-wordmark{font-size:1.28rem;letter-spacing:-.065em}
      .shop-header a.icon-btn[href*="wa.me"]{width:42px!important;height:42px!important}
      .shop-header .search-wrap{padding-top:0!important}
    }
  `;
  document.head.appendChild(style);
});

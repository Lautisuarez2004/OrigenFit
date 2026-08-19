/* Origen Fit · evita que respuestas viejas del catálogo pisen filtros/páginas nuevas */
(()=>{
  if(window.__OF_CATALOG_REQUEST_GUARD__)return;
  window.__OF_CATALOG_REQUEST_GUARD__=true;

  const api=window.supabase;
  if(!api||typeof api.createClient!=='function')return;

  const originalCreateClient=api.createClient.bind(api);
  api.createClient=function(...args){
    const client=originalCreateClient(...args);
    if(!client||typeof client.rpc!=='function')return client;

    const originalRpc=client.rpc.bind(client);
    let latestProductsRequest=0;

    client.rpc=function(fn,...rest){
      if(fn!=='get_products_page')return originalRpc(fn,...rest);

      const requestId=++latestProductsRequest;
      const pending=originalRpc(fn,...rest);

      return Promise.resolve(pending).then(result=>{
        /*
         * Si mientras este pedido estaba viajando salió otro get_products_page,
         * esta respuesta ya no representa el filtro/página visible. Se deja
         * pendiente para que el loadProducts viejo jamás llegue a repintar el DOM.
         */
        if(requestId!==latestProductsRequest){
          return new Promise(()=>{});
        }
        return result;
      });
    };

    return client;
  };
})();

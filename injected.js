const originalFetch = window.fetch;

// Override the window.fetch with our custom function
// This is so we can grab the URL of the raw gltf file

window.fetch = async function (...args) {

  const [url, options] = args;


  if (url.method == "GET"){
    if (url.url.startsWith("blob:https://collaborate.shapr3d.com/")){
      
      //found the blob url
      window.MODEL_GLTF_URL = url.url
      stl_ready()
      
    }
  }


  // 4) Call the original fetch
  const response = await originalFetch(...args);

  return response;
};



window.stl_ready = async function(){

    var url = "https://static.candela.io/three/stlmaker.js"

    const script = document.createElement('script');
    script.src = url;
    script.type = "module"
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
    document.head.appendChild(script);
    
}
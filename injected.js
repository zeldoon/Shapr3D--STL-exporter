const originalFetch = window.fetch;

// Override the window.fetch with our custom function
// This is so we can grab the URL of the raw gltf file

window.fetch = async function (...args) {

  const [url, options] = args;


  if (url.method == "GET"){
    if (url.url.startsWith("blob:https://app.shapr3d.com/")){
      
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

    var url = "https://gist.githubusercontent.com/zeldoon/5ef17d73cedc6fa15da0f8dfd0e9ee01/raw/3fe735d6fcbb4e0d8c958979208233d961e5a3b1/stlmaker.js"

    const script = document.createElement('script');
    script.src = url;
    script.type = "module"
    document.head.appendChild(script);
    
}

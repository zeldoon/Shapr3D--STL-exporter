const originalFetch = window.fetch;

window.fetch = async function (...args) {
  const [input, init] = args;

  let requestUrl = "";
  let method = "GET";

  if (typeof input === "string") {
    requestUrl = input;
  } else if (input instanceof Request) {
    requestUrl = input.url;
    method = input.method;
  }

  if (init && init.method) {
    method = init.method;
  }

  if (method === "GET" && requestUrl.startsWith("blob:https://app.shapr3d.com/")) {
    window.MODEL_GLTF_URL = requestUrl;
    stl_ready();
  }

  return originalFetch.apply(this, args);
};

window.stl_ready = async function(){
    

    var url = "https://static.candela.io/three/stlmaker.js"

    const script = document.createElement('script');
    console.log("Loading STL maker script");
    script.src = url;
    script.type = "module"
    document.head.appendChild(script);
    
}

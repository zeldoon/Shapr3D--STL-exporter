const originalFetch = window.fetch;

// Override the window.fetch with our custom function
window.fetch = async function (...args) {
  // 1) The 'args' array contains all arguments passed to fetch.
  //    Typically: [url, options].
  const [url, options] = args;

  // 2) Log or do something with the request info



  if (options){
    if (url.method == "GET"){
        console.log(url.url);
        if (url.url.startsWith("blob:https://collaborate.shapr3d.com/")){
          console.log("Found it?")
          window.BOOTLEG_URL = url.url

          download_stl()
          
        }
    }
  }
  // 3) Optionally modify the request before passing it to the original fetch
  //    e.g. add headers, etc.
  // if (options && options.headers) {
  //   options.headers['X-My-Custom-Header'] = 'HelloWorld';
  // }

  // 4) Call the original fetch
  const response = await originalFetch(...args);

  // 5) You can also intercept or read the response before returning
  //    For example, clone it or parse JSON.
  // const clonedResponse = response.clone();
  // const data = await clonedResponse.json();
  // console.log("Fetch response data:", data);

  // 6) Return the original response so the page logic stays intact
  return response;
};




function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.type = "module"
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
        document.head.appendChild(script);
    });
}


window.download_stl = async function(){

    // import * as THREE from 'https://unpkg.com/three@0.153.0/build/three.module.js';
    // import { GLTFLoader } from 'https://unpkg.com/three@0.153.0/examples/jsm/loaders/GLTFLoader.js';
    // import { DRACOLoader } from 'https://unpkg.com/three@0.153.0/examples/jsm/loaders/DRACOLoader.js';
    // import { STLExporter } from 'https://unpkg.com/three@0.153.0/examples/jsm/exporters/STLExporter.js';

    //await loadMap();
    await loadScript('https://static.candela.io/three/stlmaker.js');

    console.log("loaded?")
    
}
import * as THREE from 'https://unpkg.com/three@0.153.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.153.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.153.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://unpkg.com/three@0.153.0/examples/jsm/loaders/DRACOLoader.js';
import { STLExporter } from 'https://unpkg.com/three@0.153.0/examples/jsm/exporters/STLExporter.js';

let scene, camera, renderer, controls;
let model; // Will hold the loaded GLTF scene/model

init();
animate();

function init() {
    // Create basic Three.js setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa);

    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 2, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);

    // Basic lighting
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(1, 1, 1);
    scene.add(dirLight);

    const ambLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambLight);

    // Set up DRACO loader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
        'https://cdn.jsdelivr.net/npm/three@0.153.0/examples/jsm/libs/draco/'
    );

    // Create GLTF Loader and set its DRACO loader
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    // --- Get fresh Shapr3D export URL ---
    let urlToLoad = null;

    // Case 1: current page IS the export link
    if (window.location.href.includes("web-exports.shapr3d.com")) {
        urlToLoad = window.location.href;
    }

    // Case 2: export link is embedded in the page HTML
    if (!urlToLoad) {
        const match = document.body.innerHTML.match(/https:\/\/web-exports\.shapr3d\.com\/[^\s'"]+/);
        if (match) {
            urlToLoad = match[0];
        }
    }

    if (!urlToLoad) {
        console.error("No valid Shapr3D export URL found!");
        return;
    }

    // Load with fresh URL
    gltfLoader.load(
        urlToLoad,
        (gltf) => {
            model = gltf.scene;
            scene.add(model);
        },
        undefined,
        (error) => {
            console.error('An error occurred while loading the model:', error);
        }
    );

    // Add a button for exporting to STL
    createExportButton();

    window.addEventListener('resize', onWindowResize, false);
}

function createExportButton() {
    const button = document.createElement('button');
    button.innerText = 'Export to STL';
    button.addEventListener('click', exportToSTL);
    document.body.appendChild(button);
}

function exportToSTL() {
    if (!model) {
        alert('Model not loaded yet!');
        return;
    }

    // Create STLExporter and parse the loaded model
    const exporter = new STLExporter();
    const stlString = exporter.parse(model);

    // Convert to Blob for download
    const blob = new Blob([stlString], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Create a hidden link to trigger the download
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);

    link.href = url;
    link.download = 'exported_model.stl';
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

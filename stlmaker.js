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

        // Load Draco-compressed GLTF/GLB
        gltfLoader.load(
            'https://web-exports.shapr3d.com/13d25dce-215e-4cbf-9f8c-63805003ef1c/web-export?Expires=1736023045&Signature=h14ocm-6r86Pp1kABbNNW3N5xWYYbaJPjiRP~STy1vhhG9ze9PpdjiSTHi68Uf2gOcctuDy~RNNV11mj7Ed5x4mRl3FVNI~IdOJEQ~raDeOHTn~8S2VVb0jryCKpoESRtM633A4erAeUi4nJZ3qfyrq0HYxEqfuTIF~CVVd~qC1tQ3UCDzhuFEIN~uCC3r5Y-E5~c37LVyY215omZG-LutFZCH5ceBX0qEB-4S39kvLmFq~xyz~4c5wkKSi9gNzcbS2s7ilEORWu9INf6qGWxKxrd8otXl38NOYGQwa0SvQcnM1bAuP9~mL4DZcGlRXfsYAwAdAs--z3Ugt~G~kwMw__&Key-Pair-Id=K1SKMZH22QRNFF', //'https://static.candela.io/draco_input.gltf',
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

import * as THREE from 'three';

import * as GUI from 'lil-gui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'; // for compressed version
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/src/all';




// creating scene
const scene = new THREE.Scene();
let debugObject = {};

// creating debug UI
const gui = new GUI.GUI();

// creating folders in GUI
const Lightsfolder = gui.addFolder('Lights')
Lightsfolder.open()
// lights folder
const directionLightfolder = Lightsfolder.addFolder('directionLight')
const directionLightfolder2 = Lightsfolder.addFolder('spotLight')
const ambientLightFolder = Lightsfolder.addFolder('ambientLight')

// model
const ModelFolder = gui.addFolder('Model')
ModelFolder.open()

const envimapfolder = ModelFolder.addFolder('Envi')
const modelpositionfolder = ModelFolder.addFolder('Model Position')
const modelRotaionfolder = ModelFolder.addFolder('Model Rotation')


// camera
const CameraFolder = gui.addFolder('Camera')
CameraFolder.open()
const CameraRotationFolder = CameraFolder.addFolder('Camera Rotation')
const CameraPositionFolder = CameraFolder.addFolder('Camera Position')






// creating lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.32);
directionalLight.position.set(0,2.64,0);
// adding intensity              B
directionalLight.intensity = 0.82;
directionalLight.castShadow = true;
// removing shadow acne
directionalLight.shadow.normalBias = 0.05;

// adjusting shadow map size
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff);
directionalLight2.position.set(5,5,1.38);
// adding intensity              B
directionalLight2.intensity = 3
directionalLight2.castShadow = true;
directionalLight2.shadow.normalBias = 0.05;

// adjusting shadow map size
directionalLight2.shadow.mapSize.width = 1024;
directionalLight2.shadow.mapSize.height = 1024;

const directionalLightHelper2 = new THREE.DirectionalLightHelper(directionalLight2);

// all helpers are updated in animate loop functions
scene.add(ambientLight, directionalLight, directionalLightHelper, directionalLight2, directionalLightHelper2);

// adding light controls to the debug UI
// 1. directional light to directionLightfolder
directionLightfolder.add(directionalLight.position, 'x', -5, 5, 0.01).name('directional light x');
directionLightfolder.add(directionalLight.position, 'y', -5, 5, 0.01).name('directional light y');
directionLightfolder.add(directionalLight.position, 'z', -5, 5, 0.01).name('directional light z');
directionLightfolder.add(directionalLight, 'intensity', 0, 10, 0.01).name('directional intensity');

// 2. spotlight to spotLightFolder
directionLightfolder2.add(directionalLight2.position, 'x', -5, 5, 0.01).name('spotlight x');
directionLightfolder2.add(directionalLight2.position, 'y', -5, 5, 0.01).name('spotlight y');
directionLightfolder2.add(directionalLight2.position, 'z', -5, 5, 0.01).name('spotlight z');
directionLightfolder2.add(directionalLight2, 'intensity', 0, 500, 0.01).name('spotlight intensity');

// ambient light
ambientLightFolder.add(ambientLight, 'intensity', 0, 10, 0.01).name('ambient intensity');

// adding visible/invisible button for all helpers
let parameter = {
    flag: true, // flag
    visible: () => {
        spotlightHelper.visible = (parameter.flag) ? false : true;
        directionalLightHelper.visible = (parameter.flag) ? false : true;
        parameter.flag = parameter.flag ? false : true;
    }
};

Lightsfolder.add(parameter, 'visible').name('visible helpers');

// updating all material for envMap

// adding environment map
// using RGBELoader
const rgbeLoader = new RGBELoader();
rgbeLoader.load(
    './assets/enviroment/darkhdri.hdr',
    (environmentMap) => {
        const updateAllMaterials = () => {
            scene.traverse((child) => {
                if (child instanceof THREE.Mesh && (child.material instanceof THREE.MeshStandardMaterial || child.material instanceof THREE.MeshPhysicalMaterial)) {
                    child.material.envMap = environmentMap;
                    child.material.envMapIntensity = debugObject.envMapIntensity;
                    
                    // enabling shadow of object
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        };

        environmentMap.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = environmentMap;
        scene.background = environmentMap;

        debugObject.envMapIntensity = 1;
        debugObject.metalness = 0;
        debugObject.roughness = 0;
        debugObject.reflectivity = 0;
        envimapfolder.add(debugObject, 'envMapIntensity', 0, 10, 0.01).onChange(updateAllMaterials);
        envimapfolder.add(debugObject, 'metalness', 0, 1, 0.01).onChange(updateAllMaterials);
        envimapfolder.add(debugObject, 'roughness', 0, 1, 0.01).onChange(updateAllMaterials);
        envimapfolder.add(debugObject, 'reflectivity', 0, 1, 0.01).onChange(updateAllMaterials);
        environmentMap.encoding = THREE.sRGBEncoding;

        // adding mesh
        let mixer = null;
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath( './assets/libraries/draco/' );
        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader)
        gltfLoader.load(
            './assets/models/draco/gt3r 2/gt3r.gltf',
            (gltf) => {
             
                gltf.scene.renderOrder = 2;
                scene.add(gltf.scene);           
                
                modelRotaionfolder.add(gltf.scene.rotation, 'x', Math.PI / 2, Math.PI * 3, 0.001).name('ObjRotateX');
                modelRotaionfolder.add(gltf.scene.rotation, 'y', Math.PI / 2, Math.PI * 2, 0.001).name('ObjRotateY');
                modelRotaionfolder.add(gltf.scene.rotation, 'z', Math.PI / 2, Math.PI * 3, 0.001).name('ObjRotateZ');
                modelpositionfolder.add(gltf.scene.position, 'x', -20, 10, 0.001).name('obj pos x')
                modelpositionfolder.add(gltf.scene.position, 'y', -5, 10, 0.001).name('obj pos y')
                modelpositionfolder.add(gltf.scene.position, 'z', -20, 20, 0.001).name('obj pos z')
                
          
                
                // playing animation - if any
                if (gltf.animations.length) {
                    mixer = new THREE.AnimationMixer(gltf.scene);
                    const action = mixer.clipAction(gltf.animations[0]);
                    action.play();
                }
                updateAllMaterials();
                
            }
        );

        // ground
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(5, 5),
            new THREE.MeshStandardMaterial({
                color: 0xffffff
            })
        );

        // adding visibility of ground to the debug UI
        gui.add(ground, 'visible').name('visible ground');

        // setting ground properties
        ground.material.side = THREE.DoubleSide;
        // adding position              B
        ground.position.set(0, -0.6, 0);
        ground.rotation.set(Math.PI / 2, 0, 0);
        ground.receiveShadow = true;

        // setting up sizes for rendering
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        };


        
      
        // adding camera
        const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);
        // adding position              B
        camera.position.set(-0.014562269457166203, 1.3209874023720694,-6.004923732399126);
        camera.zoom = 2
        scene.add(camera);


        
gsap.registerPlugin(ScrollTrigger);

// Define camera positions
const cameraPositions = [
    // giving positions of camera as object
    { x: -0.014, y: 1.32, z: -6.00 },
    { x: 2.7023127197580825, y:1.7049162056063678, z: 5.02001983140576 },
    { x: 0.00042699999302532474, y:12.327319, z:0.000797999986965361 },
];


// Function to update the camera position
const updateCamera = (index) => {
    const position = cameraPositions[index];
    if (position) {
            gsap.to(camera.position, {
                x: position.x,
                y: position.y,
                z: position.z,
                duration: 1,
                onUpdate: () => {
                    camera.updateProjectionMatrix();
                    controls.update(15);   
                 }
             });
        }
    
};

// Initialize ScrollTrigger
cameraPositions.forEach((obj, index) => {
    ScrollTrigger.create({
        trigger: `.page-${index + 1}`,
        start: 'top center',
        markers: true ,
        onEnter: () => updateCamera(index),
        onEnterBack: () => updateCamera(index),
    });
});

 
        // adding camera controls to the debug UI
        CameraPositionFolder.add(camera.position, 'x', -5, 10, 0.001).name('camera pos x');
        CameraPositionFolder.add(camera.position, 'y', -5, 10, 0.001).name('camera pos y');
        CameraPositionFolder.add(camera.position, 'z', -5, 10, 0.001).name('camera pos z');
        CameraRotationFolder.add(camera.rotation, 'x', -5, 10, 0.001).name('camera Rotate x');
        CameraRotationFolder.add(camera.rotation, 'y', -5, 10, 0.001).name('camera Rotate y');
        CameraRotationFolder.add(camera.rotation, 'z', -5, 10, 0.001).name('camera Rotate z');
        CameraFolder.add(camera, 'zoom', -0.5, 5, 0.0001).name('zoom');

        // defining canvas
        let canvas = document.querySelector('.webgl');

     // adding orbit controls
     const controls = new OrbitControls(camera, canvas);
     controls.enableDamping = true;

     controls.target.y = scene.position.y + 1

     controls.addEventListener('change', () => {
        console.log(`Camera position: ${camera.position.x}, ${camera.position.y},${camera.position.z}`);
        console.log(`controls target: ${controls.target.x}, ${controls.target.y},${controls.target.z}`);
      });

        // adding renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            // multi sampling for avoiding stair-like effect when zoom
            // you can do antialias only here no other option
            antialias: true,
            alpha:true
        });

        // setting renderer size
        renderer.setSize(sizes.width, sizes.height);

        // setting pixel ratio for better quality
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // enabling shadows
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // enabling physically correct lights rather than arbitrary lights
        renderer.physicallyCorrectLights = true;

        // changing output encoding
        renderer.outputEncoding = THREE.sRGBEncoding;

        // changing renderer tone mapping
        renderer.toneMapping = THREE.ACESFilmicToneMapping;

        // adding renderer tone mapping controls to the debug UI
        gui.add(renderer, 'toneMapping', {
            No: THREE.NoToneMapping,
            Linear: THREE.LinearToneMapping,
            Cineon: THREE.CineonToneMapping,
            Reinhard: THREE.ReinhardToneMapping,
            ACESFilmic: THREE.ACESFilmicToneMapping
        });
        gui.add(renderer, 'toneMappingExposure', 0, 3, 0.0001);

        // render
        renderer.render(scene, camera);

        window.addEventListener('resize', () => {
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;
            renderer.setSize(sizes.width, sizes.height);
            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();
            renderer.render(scene, camera);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });

        let animate = () => {
            // update the helpers if their position changed
            directionalLightHelper.update();
            directionalLightHelper2.update();

            // update animation
            if (mixer != null) {
                mixer.update();
            }

            controls.update();

            // update camera
            camera.updateProjectionMatrix();
     
            // render scene
            renderer.render(scene, camera);
            // play animation on next frame
            window.requestAnimationFrame(animate);
        };
        animate();

        // show/hide lil.gui on keypress h
        gui.domElement.style.display = 'none';
        // Function to hide or show the GUI
        function toggleGUI() {
            if (gui.domElement.style.display === 'none') {
                gui.domElement.style.display = 'block';
            } else {
                gui.domElement.style.display = 'none';
            }
        }

        // Event listener for keypress
        document.addEventListener('keypress', function(event) {
            if (event.key === 'h' || event.key === 'H') {
                toggleGUI();
            }
        });
    }
);

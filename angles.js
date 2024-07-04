
import * as THREE from 'three';

import * as GUI from 'lil-gui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'; // for compressed version
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/src/all';

// creating scene
const scene = new THREE.Scene();
let debugObject = {};

// creating debug UI
const gui = new GUI.GUI();

// creating lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.32);
directionalLight.position.set(-0.04, 5, 5);
directionalLight.castShadow = true;
// removing shadow acne
directionalLight.shadow.normalBias = 0.05;

// adjusting shadow map size
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);

const spotlight = new THREE.SpotLight(0xffffff, 100, 9, 0.7);
spotlight.position.set(0.08, 5, 0.08);
spotlight.castShadow = true;
spotlight.shadow.normalBias = 0.05;

// adjusting shadow map size
spotlight.shadow.mapSize.width = 1024;
spotlight.shadow.mapSize.height = 1024;

const spotlightHelper = new THREE.SpotLightHelper(spotlight);

// all helpers are updated in animate loop functions
scene.add(ambientLight, directionalLight, directionalLightHelper, spotlight, spotlightHelper);

// adding light controls to the debug UI
// 1. directional light
gui.add(directionalLight.position, 'x', -5, 5, 0.01).name('directional light x');
gui.add(directionalLight.position, 'y', -5, 5, 0.01).name('directional light y');
gui.add(directionalLight.position, 'z', -5, 5, 0.01).name('directional light z');
gui.add(directionalLight, 'intensity', 0, 10, 0.01).name('directional intensity');

// 2. spotlight
gui.add(spotlight.position, 'x', -5, 5, 0.01).name('spotlight x');
gui.add(spotlight.position, 'y', -5, 5, 0.01).name('spotlight y');
gui.add(spotlight.position, 'z', -5, 5, 0.01).name('spotlight z');
gui.add(spotlight, 'intensity', 0, 500, 0.01).name('spotlight intensity');

// ambient light
gui.add(ambientLight, 'intensity', 0, 10, 0.01).name('ambient intensity');

// adding visible/invisible button for all helpers
let parameter = {
    flag: true, // flag
    visible: () => {
        spotlightHelper.visible = (parameter.flag) ? false : true;
        directionalLightHelper.visible = (parameter.flag) ? false : true;
        parameter.flag = parameter.flag ? false : true;
    }
};

gui.add(parameter, 'visible').name('visible helpers');

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
        gui.add(debugObject, 'envMapIntensity', 0, 10, 0.01).onChange(updateAllMaterials);
        gui.add(debugObject, 'metalness', 0, 1, 0.01).onChange(updateAllMaterials);
        gui.add(debugObject, 'roughness', 0, 1, 0.01).onChange(updateAllMaterials);
        gui.add(debugObject, 'reflectivity', 0, 1, 0.01).onChange(updateAllMaterials);
        environmentMap.encoding = THREE.sRGBEncoding;

        // adding mesh
        let mixer = null;
        const dracoLoader = new DRACOLoader()
        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader)
        gltfLoader.load(
            './assets/models/draco/718 cayman gt4/718 cayman gt4.gltf',
            (gltf) => {
                gltf.scene.position.set(1.8, -0.585, 3.177)
                gltf.scene.rotation.set(6.2831, 3.119, 6.283 )
                camera.position.set(-1.419, 0.451, 5.722);
                scene.add(gltf.scene);
                gui.add(gltf.scene.rotation, 'x', Math.PI / 2, Math.PI * 3, 0.001).name('ObjRotateX');
                gui.add(gltf.scene.rotation, 'y', Math.PI / 2, Math.PI * 2, 0.001).name('ObjRotateY');
                gui.add(gltf.scene.rotation, 'z', Math.PI / 2, Math.PI * 3, 0.001).name('ObjRotateZ');
                gui.add(gltf.scene.position, 'x', -20, 10, 0.001).name('obj pos x')
                gui.add(gltf.scene.position, 'y', -5, 10, 0.001).name('obj pos y')
                gui.add(gltf.scene.position, 'z', -20, 20, 0.001).name('obj pos z')
                camera.lookAt(gltf.scene.position)
                // playing animation - if any
                if (gltf.animations.length) {
                    mixer = new THREE.AnimationMixer(gltf.scene);
                    const action = mixer.clipAction(gltf.animations[0]);
                    action.play();
                }
                updateAllMaterials();
            
                const t1 = gsap.timeline(
                   { scrollTrigger:{
    
                        trigger: "page-2",
                        markers: true,
                        start: "top",
                        end: "bottom bottom",
                        scrub: 2
                   }
                      }
                );
                t1.to( gltf.scene.rotation,{
                    
                      x:6.541,
                      y:5.677,
                    //   z:6.2831,
                    duration:1
                  })
          
              
          
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
        camera.position.set(-1.419, 0.451, 5.722);
        scene.add(camera);

        // adding camera controls to the debug UI
        gui.add(camera.position, 'x', -5, 10, 0.001).name('camera x');
        gui.add(camera.position, 'y', -5, 10, 0.001).name('camera y');
        gui.add(camera.position, 'z', -5, 10, 0.001).name('camera z');
        gui.add(camera.rotation, 'x', -5, 10, 0.001).name('camera x');
        gui.add(camera.rotation, 'y', -5, 10, 0.001).name('camera y');
        gui.add(camera.rotation, 'z', -5, 10, 0.001).name('camera z');
        gui.add(camera, 'zoom', -0.5, 5, 0.0001).name('zoom');

        // defining canvas
        let canvas = document.querySelector('.webgl');



        // adding renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            // multi sampling for avoiding stair-like effect when zoom
            // you can do antialias only here no other option
            antialias: true
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
            spotlightHelper.update();

            // update animation
            if (mixer != null) {
                mixer.update();
            }

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
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js"; // for compressed version
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { SMAAPass } from "three/examples/jsm/Addons.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { load } from "./loading";
import { cursorAnim } from "./interactions.js";

// if your element is not appearing more than once then pass it in rectangular brackets as array

cursorAnim(document.querySelector(".cursor"), [
  document.querySelectorAll("a"),
  [document.querySelector(".hamburger")],
  [document.querySelector(".close")],
  document.querySelectorAll(".aa"),
  document.querySelectorAll(".cards"),
]);

// making variable to store model
let Model;

// creating scene
const scene = new THREE.Scene();
let debugObject = {};

// creating debug UI

// creating lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.32);
directionalLight.position.set(0, 2.64, 0);
// adding intensity              B
directionalLight.intensity = 0.82;
directionalLight.castShadow = true;
// removing shadow acne
directionalLight.shadow.normalBias = 0.05;

// adjusting shadow map size
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

const directionalLight2 = new THREE.DirectionalLight(0xffffff);
directionalLight2.position.set(5, 5, 1.38);
// adding intensity              B
directionalLight2.intensity = 3;
directionalLight2.castShadow = true;
directionalLight2.shadow.normalBias = 0.05;

// adjusting shadow map size
directionalLight2.shadow.mapSize.width = 1024;
directionalLight2.shadow.mapSize.height = 1024;


// all helpers are updated in animate loop functions
scene.add(ambientLight, directionalLight, directionalLight2);

// adding loading manager
const loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = (url, objectLoaded, totalObject) => {
  load(Math.floor((objectLoaded / totalObject) * 100));
};
// adding environment map
// using RGBELoader
const rgbeLoader = new RGBELoader(loadingManager);
rgbeLoader.load("./assets/enviroment/darkhdri.hdr", (environmentMap) => {
  const updateAllMaterials = () => {
    scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        (child.material instanceof THREE.MeshStandardMaterial ||
          child.material instanceof THREE.MeshPhysicalMaterial)
      ) {
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
  // scene.background = environmentMap;

  debugObject.envMapIntensity = 1;
  debugObject.metalness = 0;
  debugObject.roughness = 0;
  debugObject.reflectivity = 0;
 
  environmentMap.encoding = THREE.sRGBEncoding;

  // adding mesh
  const dracoLoader = new DRACOLoader(loadingManager);
  dracoLoader.setDecoderPath("./assets/libraries/draco/");
  const gltfLoader = new GLTFLoader(loadingManager);
  gltfLoader.setDRACOLoader(dracoLoader);
  gltfLoader.load("./assets/models/draco/gt3r/gt3r.gltf", (gltf) => {
    Model = gltf.scene;
    scene.add(Model);

    updateAllMaterials();

    const applyBloomToPart = (partName) => {
      const part = Model.getObjectByName(partName);
      if (part) {
        part.layers.enable(BLOOM_SCENE);
      }
    };

    applyBloomToPart("Tail_light");
    applyBloomToPart("tail_glass_mirror");
    applyBloomToPart("tail_light_side_light");
    applyBloomToPart("ring");
    applyBloomToPart("head_light");
    applyBloomToPart("head_light_right");
    applyBloomToPart("head_light_left");
    applyBloomToPart("Headlight_Mirror");
    applyBloomToPart("Headlight_Mirror_right");
    applyBloomToPart("Headlight_Mirror_left");
  });

  // setting up sizes for rendering
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // adding camera
  const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);
  // adding position              B
  camera.position.set(
    -0.014562269457166203,
    1.3209874023720694,
    -6.004923732399126
  );
  if (sizes.width > 850) {
    camera.zoom = 2;
  } else {
    camera.zoom = 1;
  }
  scene.add(camera);

  gsap.registerPlugin(ScrollTrigger);

  // Define camera positions
  const cameraPositions = [
    // giving positions of camera as object
    { x: -0.014, y: 1.32, z: -6.0 },
    { x: 2.7023127197580825, y: 1.7049162056063678, z: 5.02001983140576 },
    { x: 0.0001710000006823394, y: 12.326639, z: 0.0003240000012928536 },
    { x: 2.1209853924759434, y: 0.9604913289220418, z: 4.310617568395401 },
    { x: -5.550212999743161, y: 1.4869090011130943, z: -2.740565000144729 },
  ];

  const controlsTarget = [
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(
      -0.4175308165148711,
      0.957633291500015,
      0.7474954119541828
    ),
  ];
  // for model rotation

  const modelRotations = [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: Math.PI + 0.47, z: 0 },
    { x: 0, y: Math.PI * 2 + 0.46, z: 0 },
    { x: 0, y: Math.PI * 2 + 0.46, z: 0 },
  ];

  // Function to update the camera position
  const updateCamera = (index) => {
    const position = cameraPositions[index];
    const rotation = modelRotations[index];
    const controlTarget = controlsTarget[index];

    if (position && rotation) {
      const timeline = gsap.timeline({
        onUpdate: () => {
          camera.updateProjectionMatrix();
          controls.update();
        },
      });

      timeline.to(
        camera.position,
        {
          x: position.x,
          y: position.y,
          z: position.z,
          duration: 2,
          ease: "power2.inOut",
          immediateRender: true, // Ensure immediate rendering
        },
        0
      );

      if (Model) {
        timeline.to(
          Model.rotation,
          {
            x: rotation.x,
            y: rotation.y,
            z: rotation.z,
            duration: 2,
            ease: "power2.inOut",
            immediateRender: true, // Ensure immediate rendering
          },
          0
        );
      }
      timeline.to(
        controls.target,
        {
          x: controlTarget.x,
          y: controlTarget.y,
          z: controlTarget.z,
          duration: 2,
          ease: "power2.inOut",
          immediateRender: true, // Ensure immediate rendering
        },
        0
      );
    }
  };

  // Initialize ScrollTrigger
  cameraPositions.forEach((obj, index) => {
    ScrollTrigger.create({
      trigger: `.page-${index + 1}`,
      start: "top center",
      end: "bottom center",
      scrub: true,
      onEnter: () => updateCamera(index),
      onEnterBack: () => updateCamera(index),
      refreshPriority: index, // Ensure the correct order of ScrollTrigger instances
      invalidateOnRefresh: true, // Recalculate positions when resizing
    });
  });


  // defining canvas
  let canvas = document.querySelector(".webgl");

  // adding orbit controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  //  controls.enabled = false;

  controls.target.y = scene.position.y + 1;

  //  controls.addEventListener('change', () => {
  //     console.log(`Camera position: ${camera.position.x}, ${camera.position.y},${camera.position.z}`);
  //     console.log(`controls target: ${controls.target.x}, ${controls.target.y},${controls.target.z}`);
  //   });

  // adding renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    // multi sampling for avoiding stair-like effect when zoom
    // you can do antialias only here no other option
    antialias: true,
    alpha: true,
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



  // creating bloom

  const renderScene = new RenderPass(scene, camera);
  const composer = new EffectComposer(renderer);

  // adding renderpass to composer
  composer.addPass(renderScene);

  // adding Bloom to composer

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(sizes.width, sizes.height),
    0.21,
    0.9,
    0
  );

  composer.addPass(bloomPass);

  composer.renderToScreen = false;

  // adding shader pass

  const mixPass = new ShaderPass(
    new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: { value: composer.renderTarget2.texture },
      },
      vertexShader: document.getElementById("vertexshader").textContent,
      fragmentShader: document.getElementById("fragmentshader").textContent,
    }),
    "baseTexture"
  );

  // final composer

  const finalComposer = new EffectComposer(renderer);
  finalComposer.addPass(renderScene);
  finalComposer.addPass(mixPass);

  // adding outputpass

  const outputPass = new OutputPass();
  finalComposer.addPass(outputPass);

//   // adding antializing
//   const smaaPass = new SMAAPass();
//   // composer.addPass(smaaPass);
//   finalComposer.addPass(smaaPass);

  //  adding bloom to selected part

  const BLOOM_SCENE = 1;
  const bloomLayer = new THREE.Layers();
  bloomLayer.set(BLOOM_SCENE);

  const darkMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const materials = {};

  function nonBloomed(obj) {
    if (obj.isMesh) {
      if (obj.layers === undefined) {
        console.warn("Object without layers:", obj);
        obj.layers = new THREE.Layers();
      }

      if (bloomLayer.test(obj.layers) === false) {
        materials[obj.uuid] = obj.material;
        obj.material = darkMaterial;
      }
    }
  }

  function restoreMaterial(obj) {
    if (materials[obj.uuid]) {
      obj.material = materials[obj.uuid];
      delete materials[obj.uuid];
    }
  }

  // Traverse scene and assign default layers
  scene.traverse((obj) => {
    if (obj.layers === undefined) {
      obj.layers = new THREE.Layers();
    }
  });

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    renderer.setSize(sizes.width, sizes.height);
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    finalComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    composer.setSize(sizes.width, sizes.height);
    finalComposer.setSize(sizes.width, sizes.height);
    if (sizes.width > 850) {
      camera.zoom = 2;
    } else {
      camera.zoom = 1.1;
    }

    // Refresh ScrollTrigger instances on resize
    ScrollTrigger.refresh();
  });

  let animate = () => {
    
    controls.update();

    // update camera
    camera.updateProjectionMatrix();

    // traversing through scene
    scene.traverse(nonBloomed);

    // calling effect composer to render the effect
    composer.render();

    scene.traverse(restoreMaterial);

    finalComposer.render();

    // play animation on next frame
    window.requestAnimationFrame(animate);
  };

  animate();

 
});

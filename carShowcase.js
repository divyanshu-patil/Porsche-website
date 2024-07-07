import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GammaCorrectionShader, ShaderPass } from "three/examples/jsm/Addons.js";
import { GlitchPass } from "three/examples/jsm/Addons.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";

GlitchPass
import { addGUI } from "./carShowcasegui";
import { addGsapAnimation ,pointsVisibleAnimation} from "./carshowcaseGsapAnimations";
import { cardData} from "./interactions.js";
import { load } from "./loading.js";
import { shaderStages } from "three/examples/jsm/nodes/Nodes.js";

console.log("three-js", THREE);

var urlParams = new URLSearchParams(window.location.search);
var encodedCar = urlParams.get('car');
console.log(encodedCar)
const Data = cardData(encodedCar);

const url =Data.url;
const name = Data.name
const points=Data.points
console.log(Data)
let carName = document.querySelector(".name h1");
document.title = name
carName.innerHTML = name;


// creating scene
const scene = new THREE.Scene();

// creating lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
const directionalLight = new THREE.DirectionalLight(0xcbf2ff, 5.38);
directionalLight.position.set(-0.98, 2, 0);
directionalLight.castShadow = true;
// removing shadow acne
directionalLight.shadow.normalBias = 0.05;

// adjusting shadow map size
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight
);

const directionalLight2 = new THREE.DirectionalLight(0xdd6c24, 1);
directionalLight2.position.set(3.04, 3.63, 2.98);
directionalLight2.castShadow = true;
// removing shadow acne
directionalLight2.shadow.normalBias = 0.05;

// adjusting shadow map size
directionalLight2.shadow.mapSize.width = 1024;
directionalLight2.shadow.mapSize.height = 1024;

const directionalLightHelper2 = new THREE.DirectionalLightHelper(
  directionalLight2
);

// all helpers are updated in animate loop functions
scene.add(
  ambientLight,
  directionalLight,
  directionalLight2,
);

// adding helpers
// scene.add(
//   directionalLightHelper,
//   directionalLightHelper2
// )


directionalLight2.target = scene;


// adding loading manager
const loadingManager = new THREE.LoadingManager()

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

        // enabling shadow of object
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  };

  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = environmentMap;
  // scene.background = environmentMap;
  // scene.background = new THREE.Color('#00000000')

  environmentMap.encoding = THREE.sRGBEncoding;

  // adding mesh
  let mixer = null;
  const dracoLoader = new DRACOLoader(loadingManager);
  dracoLoader.setDecoderPath("./assets/libraries/draco/");
  const gltfLoader = new GLTFLoader(loadingManager);
  gltfLoader.setDRACOLoader(dracoLoader);
  gltfLoader.load(url, (gltf) => {
    gltf.scene.position.y = -0.5;
    scene.add(gltf.scene);

    // playing animation - if any
    if (gltf.animations.length) {
      mixer = new THREE.AnimationMixer(gltf.scene);
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();
    }
    updateAllMaterials();
    pointsVisibleAnimation(points)
    
  });

  // ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
    })
  );

  // setting ground properties
  ground.material.side = THREE.DoubleSide;
  ground.position.set(0, -0.6, 0);
  ground.rotation.set(Math.PI / 2, 0, 0);
  ground.receiveShadow = true;

  // setting up sizes for rendering
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // adding camera
  const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);
  camera.position.set(
    -0.09359446093265265,
    0.8952762544297022,
    -5.856838780599121
  );
  camera.zoom = 2;
  scene.add(camera);

  // defining canvas
  let canvas = document.querySelector(".webgl");

  // adding orbit controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.04
  controls.target.y = scene.position.y + 0.5;
  controls.maxPolarAngle = Math.PI / 2             // dont go below ground
  controls.minDistance =0;
  controls.maxDistance =15;
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

 

  // render
  renderer.render(scene, camera);

  // post processing
  const renderTarget = new THREE.WebGLRenderTarget(sizes.width,sizes.height,
    {
      samples:2
    }
  )

  const effectComposer = new EffectComposer(renderer,renderTarget)
  effectComposer.setSize(sizes.width,sizes.height)
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio,2))

  const renderPass = new RenderPass(scene,camera)
  effectComposer.addPass(renderPass)

 


  const gammaCorrectionPas= new ShaderPass(GammaCorrectionShader)
  effectComposer.addPass(gammaCorrectionPas)

if(renderer.getPixelRatio()===1 && !renderer.capabilities.isWebGL2){

  const smaaPass = new SMAAPass()
  effectComposer.addPass(smaaPass);
}

  






  // controls.addEventListener("change", () => {
  //   console.log(
  //     `Camera position: ${camera.position.x}, ${camera.position.y},${camera.position.z}`
  //   );
  //   console.log(
  //     `controls target: ${controls.target.x}, ${controls.target.y},${controls.target.z}`
  //   );
  // });

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    renderer.setSize(sizes.width, sizes.height);
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // update effect composer
    effectComposer.render(scene, camera);
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // points of intrest
  
  // console.log();
    // next in tick function

  // let addFactor = 6;
  // points.forEach((point) => {
  //     point.element.addEventListener('click', () => {
  //         console.log(point.element.innerHTML);
  //         console.log(point.position);
  //         gsap.to(camera.position, {
  //             x: point.position.x + ((point.position.x < 0) ? addFactor : -addFactor),
  //             y: point.position.y+0.5,
  //             z: point.position.z + ((point.position.z < 0) ? addFactor : -addFactor),
  //         });
  //     });
  // });
  let info = document.querySelector(".info");
  let name = document.querySelector(".name");
  info.style.opacity=0;
  
  addGsapAnimation(camera,controls,THREE,points,info,name)
  loadingManager.onProgress=(url,objectLoaded,totalObject)=>{
    load(Math.floor((objectLoaded/totalObject)*100));
}

  const raycaster = new THREE.Raycaster();
  let animate = () => {
    // update the helpers if their position changed
    directionalLightHelper.update();
    directionalLightHelper2.update();

    // update animation
    if (mixer != null) {
      mixer.update();
    }
 // go through each point
 for(const point of points){
    const screenPosition = point.position.clone()
    screenPosition.project(camera)
    raycaster.setFromCamera(screenPosition,camera)
    const intersects = raycaster.intersectObjects(scene.children,true)

    if(intersects.length===0){
        point.element.classList.add('visible')
    }else{
        const intersectionDistance = intersects[0].distance;
        const pointDistance = points[0].position.distanceTo(camera.position)
        // if(intersectionDistance > pointDistance){
        //     point.element.classList.add('visible')
        // }
        // else{
            // point.element.classList.remove('visible')
        // }
    }

    // console.log(screenPosition.x)
    const translateX = screenPosition.x *sizes.width*0.5
    const translateY = -screenPosition.y *sizes.height*0.5
    point.element.style.transform = `translate(${translateX}px,${translateY}px)`
}




    // update camera
    camera.updateProjectionMatrix();
    // update orbit controls
    controls.update();
    // render scene
    // renderer.render(scene, camera);
    effectComposer.render();
    // play animation on next frame
    window.requestAnimationFrame(animate);
  };
  animate();
  addGUI(THREE, camera, scene, [
    ambientLight,
    directionalLight,
    directionalLight2,
  ],points,controls);
});

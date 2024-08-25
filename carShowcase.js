import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
// import { addGUI } from "./carShowcasegui";
import { addGsapAnimation ,pointsVisibleAnimation} from "./carshowcaseGsapAnimations";
import { cardData,cursorAnim} from "./interactions.js";
import { load } from "./loading.js";



// note 
// if your element is not appearing more than once then pass it in rectangular brackets as array
cursorAnim(
  document.querySelector(".cursor"),
[
  document.querySelectorAll("a"),
  document.querySelectorAll(".label"),
  [document.querySelector(".cross")]
])

let currentModle;

var urlParams = new URLSearchParams(window.location.search);
var encodedCar = urlParams.get('car');

const Data = cardData(encodedCar);

const url =Data.url;
const name = Data.name
const points=Data.points

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

const directionalLight2 = new THREE.DirectionalLight(0xdd6c24, 1);
directionalLight2.position.set(3.04, 3.63, 2.98);
directionalLight2.castShadow = true;
// removing shadow acne
directionalLight2.shadow.normalBias = 0.05;

// adjusting shadow map size
directionalLight2.shadow.mapSize.width = 1024;
directionalLight2.shadow.mapSize.height = 1024;


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
    currentModle = gltf.scene
    currentModle.position.y = -0.5;
    scene.add(currentModle);

    updateAllMaterials();

    const applyBloomToPart = (partName) => {
    const part = currentModle.getObjectByName(partName);
    if (part) {
        part.layers.enable(bloom_scene);
    }
};

applyBloomToPart('Tail_light');
applyBloomToPart('tail_glass_mirror');
applyBloomToPart('tail_light_side_light');
applyBloomToPart('ring');
applyBloomToPart('head_light');
applyBloomToPart('head_light_right');
applyBloomToPart('head_light_left');
applyBloomToPart('Headlight_Mirror');
applyBloomToPart('Headlight_Mirror_right');
applyBloomToPart('Headlight_Mirror_left');
    
pointsVisibleAnimation(points)
    
  });

  // ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
    })
  );

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

  // post processing


  const effectComposer = new EffectComposer(renderer)
  effectComposer.setSize(sizes.width,sizes.height)
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio,2))

  const renderPass = new RenderPass(scene,camera)
  effectComposer.addPass(renderPass)

//   const gammaCorrectionPas= new ShaderPass(GammaCorrectionShader)
//   effectComposer.addPass(gammaCorrectionPas)

// if(renderer.getPixelRatio()===1 && !renderer.capabilities.isWebGL2){

//   const smaaPass = new SMAAPass()
//   effectComposer.addPass(smaaPass);
// }


const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(sizes.width, sizes.height),
  Data.bloom.i,
  Data.bloom.r,
  Data.bloom.t
);

effectComposer.addPass(bloomPass)
// CameraRotationFolder.add(bloomPass.intensity, 'z', -5, 10, 0.001).name('camera Rotate z');

effectComposer.renderToScreen = false


   // adding shader pass

   const mixPass = new ShaderPass(
    new THREE.ShaderMaterial(
        {
            uniforms:{
                baseTexture:{value:null},
                bloomTexture:{value:effectComposer.renderTarget2.texture}
            },
            vertexShader:document.getElementById('vertexshader').textContent,
            fragmentShader:document.getElementById('fragmentshader').textContent

        }
    ),'baseTexture'
)

  // final composer

  const endComposer = new EffectComposer(renderer);
  endComposer.addPass(renderPass) 
  endComposer.addPass(mixPass)

  
  // adding outputpass
  
  const outputPass = new OutputPass()
  endComposer.addPass(outputPass)
  
   // adding antializing
 const smaaPass = new SMAAPass()
 // composer.addPass(smaaPass);
 endComposer.addPass(smaaPass)
  
 const bloom_scene = 1;
 const bloomLayer = new THREE.Layers();
 bloomLayer.set(bloom_scene);

 const darkMaterial = new THREE.MeshBasicMaterial({color:0x000000})
 const materials = {} 

 function nonBloomed(obj) {
  if (obj.isMesh) {
      if (obj.layers === undefined) {
          console.warn('Object without layers:', obj);
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

    // update effect composer
    effectComposer.render(scene, camera);
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    endComposer.setSize(sizes.width, sizes.height);
    endComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  let info = document.querySelector(".info");
  let name = document.querySelector(".name");
  info.style.opacity=0;
  
  addGsapAnimation(camera,controls,THREE,points,info,name)
  loadingManager.onProgress=(url,objectLoaded,totalObject)=>{
    load(Math.floor((objectLoaded/totalObject)*100));
}

  const raycaster = new THREE.Raycaster();


  let animate = () => {
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
    scene.traverse(nonBloomed);
        
    // calling effect composer to render the effect
    effectComposer.render();

    scene.traverse(restoreMaterial);

    endComposer.render();

    // play animation on next frame
    window.requestAnimationFrame(animate);
  };
  animate();
  // addGUI(THREE, camera, scene, [
  //   ambientLight,
  //   directionalLight,
  //   directionalLight2,
  // ],points,controls);
});

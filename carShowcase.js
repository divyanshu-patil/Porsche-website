import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { addGUI } from "./carShowcasegui";
import { addGsapAnimation } from "./carshowcaseGsapAnimations";
console.log("three-js", THREE);

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
  directionalLightHelper,
  directionalLight2,
  directionalLightHelper2
);
directionalLight2.target = scene;

// updating all material for envMap

// adding environment map
// using RGBELoader
const rgbeLoader = new RGBELoader();
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
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("./assets/libraries/draco/");
  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);
  gltfLoader.load("./assets/models/draco/gt3rs/gt3rs.gltf", (gltf) => {
    gltf.scene.position.y = -0.5;
    scene.add(gltf.scene);

    // playing animation - if any
    if (gltf.animations.length) {
      mixer = new THREE.AnimationMixer(gltf.scene);
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();
    }
    updateAllMaterials();
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
  controls.target.y = scene.position.y + 0.5;

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

  // adding renderer tone mapping controls to the debug UI

  // render
  renderer.render(scene, camera);

//   controls.addEventListener("change", () => {
//     console.log(
//       `Camera position: ${camera.position.x}, ${camera.position.y},${camera.position.z}`
//     );
//     console.log(
//       `controls target: ${controls.target.x}, ${controls.target.y},${controls.target.z}`
//     );
//   });

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    renderer.setSize(sizes.width, sizes.height);
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // points of intrest
  const points = [
    {
      position: new THREE.Vector3(0.67471,0.67471,1.62139),
      element: document.querySelector(".point0"),
    },
    {
      position: new THREE.Vector3(-0.74531,0.67471,0.02387),
      element: document.querySelector(".point1"),
    },
    {
      position: new THREE.Vector3(0.02387,1.14805,-1.75116),
      element: document.querySelector(".point2"),
    },
    
  ];
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
  
  const raycaster = new THREE.Raycaster();
addGsapAnimation(camera,controls,THREE)
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
    renderer.render(scene, camera);
    // play animation on next frame
    window.requestAnimationFrame(animate);
  };
  animate();
  addGUI(THREE, camera, scene, [
    ambientLight,
    directionalLight,
    directionalLight2,
  ],points);
});

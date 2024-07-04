import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase) 
let addGsapAnimation =(camera,controls,THREE)=>{
    
 let duration =3;
 let ease =CustomEase.create("custom", "M0,0 C0.083,0.294 0.234,1.162 0.563,1.163 0.816,1.163 0.819,1 1,1 ");
 let rapidease =CustomEase.create("custom", "M0,0 C0.083,0.294 0.206,1.102 0.536,1.103 0.769,1.103 0.556,0.923 1,1 ");
  let defaultPosition =  new THREE.Vector3(camera.position.x,camera.position.y,camera.position.z)


document.querySelector(".point0").addEventListener("click", () => {
    gsap.to(camera.position, {
      x: 2.579815777344435,
      y: 0.9249713729263755,
      z:4.893335663317651,
      ease: ease,
      duration: duration,
    });
    gsap.to(camera,{
      zoom:2,
      ease: ease,
      duration: duration,
    })
  });
  
  document.querySelector(".point1").addEventListener("click", () => {
    gsap.to(camera.position, {
      x: -2.7867899148204773,
      y:  1.3251701539405176,
      z: -4.380688373887278,
      ease: ease,
      duration: duration,
    });
    gsap.to(camera,{
      zoom:2,
      ease: ease,
      duration: duration,
    })
  });
  
  document.querySelector(".point2").addEventListener("click", () => {
    gsap.to(camera.position, {
      x:   -0.11221879758882979,
      y:1.4713641265658624,
      z: -2.6958706807433135,
      ease: rapidease,
      duration: duration,
    });
    gsap.to(controls.target,{
      x: -0.015634134907712538,
      y:0.2902402707101544,
      z:-0.07058572870483645,
      ease: rapidease,
      duration: duration,
    })
    gsap.to(camera,{
      zoom:0.566,
      ease: rapidease,
      duration: duration,
    
    })
    
    })

  //  document.querySelector(".cross").addEventListener('click',()=>{
  //   gsap.to(camera.position,{
  //     x:defaultPosition.x,
  //     y:defaultPosition.y,
  //     z:defaultPosition.z,
  //     duration:duration,
  //     ease:ease,
  //   })
  // });
    


    
}
export {addGsapAnimation}
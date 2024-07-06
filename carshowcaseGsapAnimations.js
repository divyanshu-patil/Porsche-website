import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';


gsap.registerPlugin(CustomEase) 
let addGsapAnimation =(camera,controls,THREE,points,info,name)=>{
{
  console.log('animation played');
  name.style.opacity=1;
  document.querySelector(".cross").style.display='none';
  setTimeout(()=>{
    controls.addEventListener('change',()=>{
      name.style.zIndex=99;
      document.querySelector(".cross").style.display='block';

      gsap.to(name,{
        fontSize:"3vw",
        top:"5%",
        duration:duration,
        ease:ease
      })
    },1000)
  })

let duration =3;
let ease =CustomEase.create("custom", "M0,0 C0.083,0.294 0.234,1.162 0.563,1.163 0.816,1.163 0.819,1 1,1 ");
let rapidease =CustomEase.create("custom", "M0,0 C0.083,0.294 0.206,1.102 0.536,1.103 0.769,1.103 0.556,0.923 1,1 ");
let curveEase = CustomEase.create("custom", "M0,0 C-0.294,0.338 -0.201,0.657 0,0.87 0.374,1.264 0.566,1 1,1 ");
let defaultPosition =  new THREE.Vector3(camera.position.x,camera.position.y,camera.position.z)
let defaultTarget = new THREE.Vector3(controls.target.x,controls.target.y,controls.target.x)
let isAnimating = false;
let title = info.querySelector('.title');
let description = info.querySelector('.description');

document.body.classList.add('disabled-pointer-events');


gsap.from(name,{
  y:100,
  opacity:0,
  duration:3,
  ease:'power2.out',  
})




points.forEach(point => {
  point.element.addEventListener("click", () => {
    
    if (isAnimating) return;
    isAnimating = true;
    document.body.classList.add('disabled-pointer-events');
    // re-enable pointer events
    gsap.to(camera.position, {
      x:  point.cameraPosition.x,
      y:  point.cameraPosition.y,
      z:  point.cameraPosition.z,
      ease: ease,
      duration: duration,
      onComplete:()=>{
        title.innerText=point.title;
        description.innerText=point.description;
        isAnimating = false;
        document.body.classList.remove('disabled-pointer-events'); 
        document.addEventListener('click',()=>{
          gsap.to(info,{
            opacity:0,
            duration:0.1,
            ease:ease,
          })
        })
        info.style.left=point.infoPosition.left;
        info.style.top=point.infoPosition.top;
        console.log(info)
        gsap.to(info,{
          opacity:1,
          duration:1,
          ease:ease,
          onComplete:()=>{
            document.addEventListener('click',()=>{
              gsap.to(info,{
                opacity:0,
                duration:1,
                ease:ease,
              })
            })
           
          }
        })
      }
    });

    gsap.to(camera,{
      zoom:point.cameraZoom,
      ease: ease,
      duration: duration,
    });

    gsap.to(controls.target,{
      x:  point.controlsTarget.x,
      y:  point.controlsTarget.y,
      z:  point.controlsTarget.z,
      ease: rapidease,
      duration: duration,
    })
  });

  
});



   document.querySelector(".cross").addEventListener('click',()=>{
    document.body.classList.add('disabled-pointer-events');

    gsap.to(camera.position,{
      x:defaultPosition.x,
      y:defaultPosition.y,
      z:defaultPosition.z,
      duration:duration,
      ease:ease,
      onComplete:()=>{
    name.style.zIndex =1
        gsap.to(name,{
          fontSize:"10vw",
          top:"10%",
          duration:duration,
          // delay:-1,
          ease:ease,
          onComplete:()=>{
          document.body.classList.remove('disabled-pointer-events');
          document.querySelector(".cross").style.display='none';
            
          }
        })
      }
    })
    gsap.to(camera,{
      zoom:2,
      ease:ease,
      duration:duration,
    })
    gsap.to(controls.target,{
      x:defaultTarget.x,
      y:defaultTarget.y,
      z:defaultTarget.z,
      duration:duration,
      ease:ease,
    })
    
  }); 
  
  
}
}

 let pointsVisibleAnimation=(points)=>{
    setTimeout(()=>{
      document.body.classList.remove('disabled-pointer-events');
      points.forEach((point)=>{
        point.element.classList.add('visible')
      })
     
    },1000)
}

export {addGsapAnimation,pointsVisibleAnimation}
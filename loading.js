import gsap from "gsap";
let load = (percentLoaded)=>{
    
    let indicator=document.querySelector(".indicator");
        let percent = document.querySelector(".percent h1");
        
            percent.innerText =percentLoaded+'%'
            indicator.style.transform=`translateX(${-100+ percentLoaded}%)`
            
            if(percentLoaded===100){
                setTimeout(() => {
                  animate()
                }, 500);
            }
  
        let animate=()=>{
            let tl = new gsap.timeline()
            tl.to('.progress-bar',{
                opacity:0,
                duration:2
            },'fade Out')
            tl.to('.percent h1',{
                opacity:0,
                duration:2
            },'fade Out')
            tl.to('.box1',{
                rotate:'90deg',
                duration:1
            })
            tl.to('.box3',{
                opacity:1,
                duration:0.5,
                
            })
            tl.to('.overlay .wrapper',{
                // opacity:0,
                rotate:'45deg',
                scale:30,
                // x:'100%',
                duration :3,
                delay:0.5
            },'color')
            tl.to('.box1, .box2 , .box3',{
                backgroundColor:'#00000000',
                duration:2.5,
                delay:0.5,
            },'color')
            tl.to('.overlay',{
                opacity:0,
                duration:1,
                delay:1,
                onComplete:()=>{
                  document.querySelector(".overlay").style.display="none";
                }
                },'color')        
    }
  }
  export {load};
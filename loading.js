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
            let ease = 'back(3).out';
            let durationShort = 0.5;
            let duratiionAvg = 1;
            let durationLong = 2;
            let durationVeryLong=2.5;

            let tl = new gsap.timeline()
            tl.to('.progress-bar',{
                opacity:0,
                duration:durationLong,
                ease:ease,
            },'fade Out')
            tl.to('.percent h1',{
                opacity:0,
                duration:durationLong,
                ease:ease,
            },'fade Out')
            tl.to('.box1',{
                rotate:'90deg',
                duration:duratiionAvg,
                delay:-1,
                ease:ease
            })
            tl.to('.box3',{
                opacity:1,
                duration:durationShort,
                ease:ease
                
            })
            tl.to('.overlay .wrapper',{
                // opacity:0,
                rotate:'45deg',
                scale:30,
                // x:'100%',
                duration :durationVeryLong + 0.5,
                delay:0.5
            },'color')
            tl.to('.box1, .box2 , .box3',{
                backgroundColor:'#00000000',
                duration:durationVeryLong,
                delay:0.5,
                ease:ease,
                onComplete:()=>{
                    
                }
            },'color')
            tl.to('.overlay',{
                opacity:0,
                delay:1,
                duration:duratiionAvg,
                ease:ease,
                onComplete:()=>{
                  document.querySelector(".overlay").style.display="none";
                }
                },'color')        
    }
  }
  export {load};
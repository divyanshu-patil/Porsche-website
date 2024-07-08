import gsap from "gsap"

let hamberger = document.querySelector(".hamburger")
let navigation = document.querySelector(".navigation")
let menu = document.querySelector(".menu")
let close = document.querySelector(".close")
let right_bottom = document.querySelector(".right-bottom")
const anchors = document.querySelectorAll('.a-wrapper');
let dot = document.querySelector(".cursor")
let GT3RS = document.querySelector(".text11")
let main_heading = document.querySelector(".main-heading")

hamberger.addEventListener('click',()=>{ 

        navigation.style.display = 'flex'
        document.body.style.overflow = 'hidden';
     
       gsap.to(navigation,{   
         x:`-100%`,    
        duration :1.5,
        onComplete:()=>{
            menu.style.display = 'none'
            close.style.display = 'block'

      }
    })
})

close.addEventListener('click',()=>{

    gsap.to(navigation,{   
        x:`100%`, 
        duration :1.5,
        onComplete:()=>{
            
              navigation.style.display = 'none'
              menu.style.display = 'block'
              close.style.display = 'none'
        }
     })
})


close.addEventListener('mouseenter',()=>{
    gsap.to(dot,{
        scale:3
    })
})

close.addEventListener('mouseleave',()=>{
    gsap.to(dot,{
        scale:1
    })
})

GT3RS.addEventListener('mouseenter',()=>{
    gsap.to(dot,{
        scale:3
    })
})

GT3RS.addEventListener('mouseleave',()=>{
    gsap.to(dot,{
        scale:1
    })
})
main_heading.addEventListener('mouseenter',()=>{
    gsap.to(dot,{
        scale:3
    })
})

main_heading.addEventListener('mouseleave',()=>{
    gsap.to(dot,{
        scale:1
    })
})






// Add event listener to each anchor tag
anchors.forEach(anchor => {
    anchor.addEventListener('mouseenter', (event) => {
        event.preventDefault(); 
        right_bottom.innerHTML = anchor.id
       let entire = `.red-line${anchor.id}`
       gsap.to(dot,{
        scale:3
    })
        gsap.to(entire, { 
            width: 250,
            duration: 1,
            
        });
    });
    anchor.addEventListener('mouseleave', (event) => {
        event.preventDefault();
        let entire = `.red-line${anchor.id}`
        gsap.to(dot,{
            scale:1
        })
        gsap.to(entire, { 
            width: 0,
            duration: 1,
            onComplete:()=>{
                 right_bottom.innerHTML = "00"
            }
        });

     
    });

})





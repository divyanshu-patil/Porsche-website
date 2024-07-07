import gsap from "gsap"


let hamberger = document.querySelector(".hamburger")
let navigation = document.querySelector(".navigation")
let menu = document.querySelector(".menu")
let close = document.querySelector(".close")
let right_bottom = document.querySelector(".right-bottom")
const anchors = document.querySelectorAll('.left .aa');

let flag = true
hamberger.addEventListener('click',()=>{ 

        navigation.style.display = 'flex'
        document.body.style.overflow = 'hidden';
     
       gsap.to(navigation,{   
         x:`-100%`,    
        duration :2,
        onComplete:()=>{
            menu.style.display = 'none'
            close.style.display = 'block'

      }
    })
})

close.addEventListener('click',()=>{
   
    gsap.to(navigation,{   
        x:`100%`, 
        duration :2,
        onComplete:()=>{
            
              navigation.style.display = 'none'
              menu.style.display = 'block'
              close.style.display = 'none'
        }
     })
})



// Add event listener to each anchor tag
anchors.forEach(anchor => {
    anchor.addEventListener('mouseenter', (event) => {
        event.preventDefault(); 
        right_bottom.innerHTML = anchor.id
        // Your animation code using gsap
        gsap.to(anchor.previousElementSibling, { // Select the previous sibling which is the svg
            width: 250,
            duration: 1,
        });

        // If you want to log the clicked anchor tag or perform other actions
        console.log('Clicked:', anchor);
    });
    anchor.addEventListener('mouseleave', (event) => {
        event.preventDefault(); // Prevent the default link behavior
       
        // Your animation code using gsap
        gsap.to(anchor.previousElementSibling, { // Select the previous sibling which is the svg
            width: 0,
            duration: 1,
            onComplete:()=>{
                 right_bottom.innerHTML = "00"
            }
        });

        // If you want to log the clicked anchor tag or perform other actions
        console.log('Clicked:', anchor);
    });

})

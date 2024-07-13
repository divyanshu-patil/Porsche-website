import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/src/all';


let animate1;
let animate2;
let animate3;
let animate4;
let animate5;
let animate6;
let animate7;
let animate8;
let animate9;
let animate10;
let animate11;
let animate12;
let animate13;
let animate14;
let animate15;
// cards animation
{
let duration = 0.3
let cards=document.querySelectorAll(".page-4 .cards ");
cards.forEach((card)=>{
  card.addEventListener('mouseenter',()=>{
  //   cards.forEach(c => {
  //     if (c !== card) {
  //         c.classList.add('blurred');
  //         // body.classList.add('blurred');
  //     }
  // });



    let txt = card.querySelector('.page-4 .cards .txt')
    animate1 = gsap.to(card,{
      scale:1.075,
      duration:duration,
      ease:"power2.inOut"
    })
    animate2= gsap.to(txt,{
      bottom:"10%",
      left:"10%",
      duration:duration,
      ease:"power2.inOut"

    })
    let gradient = card.querySelector('.page-4 .cards .gradient')
    animate3 = gsap.to(gradient,{
      top:"0%",
      delay:0.02,
      duration:duration,
      ease:"power2.inOut"
    })
  })

  card.addEventListener('mouseleave',()=>{
  //   cards.forEach(c => {
  //     if (c !== card) {
  //         c.classList.remove('blurred');
  //         // body.classList.add('blurred');
          
  //     }
  // });

  animate4 = gsap.to(card,{
    scale:1,
    duration:duration,
    ease:"power2.inOut"
  })

    let txt = card.querySelector('.page-4 .cards .txt')
   animate5 =  gsap.to(txt,{
      bottom:"-20%",
      left:"30%",
      duration:duration,
      ease:"power2.inOut"

    })
    let gradient = card.querySelector('.page-4 .cards .gradient')
    animate6 =gsap.to(gradient,{
      top:"100%",
      duration:duration,
      ease:"power2.inOut"
    })
  })
})
}
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

let panels = gsap.utils.toArray(".pages"),
    observer = ScrollTrigger.normalizeScroll(true),
    scrollTween;

// on touch devices, ignore touchstart events if there's an in-progress tween so that touch-scrolling doesn't interrupt and make it wonky
document.addEventListener("touchstart", e => {
  if (scrollTween) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
}, {capture: true, passive: false})

function goToSection(i) {
  scrollTween = gsap.to(window, {
    scrollTo: {y: i * innerHeight, autoKill: false},
    onStart: () => {
      observer.disable(); // for touch devices, as soon as we start forcing scroll it should stop any current touch-scrolling, so we just disable() and enable() the normalizeScroll observer
      observer.enable();
    },
    duration: 1,
    onComplete: () => scrollTween = null,
    overwrite: true
  });
}

panels.forEach((panel, i) => {
  ScrollTrigger.create({
    trigger: panel,
    start: "top bottom",
    end: "+=199%",
    onToggle: self => self.isActive && !scrollTween && goToSection(i)
  });
});

// just in case the user forces the scroll to an inbetween spot (like a momentum scroll on a Mac that ends AFTER the scrollTo tween finishes):
ScrollTrigger.create({
  start: 0, 
  end: "max",
  snap: 1 / (panels.length - 1)
})


// scroll based animation

//  const t1 = gsap.timeline({
//   scrollTrigger:{
//     trigger: ".page-1",
//     markers: true,
//     start: "top center",
//     end: "bottom bottom",
//     scrub: 2
//   }
// })
// tl.set(document.body, {overflow: "hidden"})

// animation on all the pages...

let tl = gsap.timeline()
let duration=1;
let ease='power2.out';
function page1animation() {
  
// document.body.classList.add('disabled-pointer-events');


tl.from("nav",{
  top:"-100%",
  opacity: 0,
  duration:duration,
  ease:ease
},'fixed')

tl.from(".page-1 .main-heading h1",{
  y: 40,
  opacity:0,
  duration:duration,
  ease:ease,
},"-=0.8")

tl.from(".page-1 .sub-heading ",{
  y: 40,
  opacity:0,
  scale:0.5,
  duration:duration,
  ease:ease,

},"-=0.8")

tl.from(".watermark ",{
  right:'-90%',
  opacity:0,
  duration:duration,
  ease:ease,
},'fixed')

}

page1animation();
function page2animation(){
  let delay=0.5
  animate7 = gsap.from('.page-2 .trans-text ',{
    left:'-100%',
    duration:duration,
    ease:'power2.out',
    delay:delay,
    scrollTrigger:{
      trigger:".page-2 ",
      scroller:"body",
      start:'top 10px',
      // end:'top 20%',

      // markers:true,
      // scrub:true
    }
  })
  animate8 = gsap.from('.page2-discription-part',{
    right:'-100%',
    opacity:0,
    duration:duration,
    ease:'power2.out',
    delay:delay,
    scrollTrigger:{
      trigger:".page-2 ",
      scroller:"body",
      start:'top 10px',
      // end:'top 20%',

      // markers:true,
      // scrub:true
    }
  })
}
page2animation()

function page3animation() {
  let delay=0.5
animate9 =gsap.from('.page-3 .top-left',{
  left:'-100%',
  opacity:0,
  duration:duration,
  delay:delay,
  scrollTrigger:{
    trigger:'.page-3',
    scroller:'body',
    start:'top 10px',
    // markers:true
  }
})
animate10 =gsap.from('.page-3 .bottom-right ',{
  right:'-100%',
  opacity:0,
  duration:duration,
  delay:delay,
  // stagger:0.5,
  scrollTrigger:{
    trigger:'.page-3',
    scroller:'body',
    start:'top 10px',
    // markers:true
  }
})

}
page3animation();

function page4Animation(){
  let delay = 0.4;
  duration=1;
  ease ='back(3).out'
  animate11 =gsap.from('.page-4 .cards',{
    y:100,
    opacity:0,
    duration:duration,
    delay:delay+0.5,
    stagger:0.2,
    ease:ease,
    scrollTrigger:{
      trigger:'.page-4',
      scroller:'body',
      start:'top 10px',
      // markers:true
      }
  })

}
page4Animation()


function footerAnimation(){
  document.querySelector('.info .wrapper').style.opacity=0

  let delay = 0.5;
  let duration=1;
  let ease2 ='back(3).out'
  let ease1= 'power2.out'
  animate12 =gsap.from('.page-5 .hider',{
    left:'-100%',
    opacity:0,
    duration:duration,
    delay:delay-0.2,
    ease:ease1,
    scrollTrigger:{
      trigger:'.page-5',
      scroller:'body',
      start:'top 10px',
      // markers:true
      },
      onComplete:()=>{
        document.querySelector(".footer-part").style.opacity=1;
        animate13 =gsap.from(".footer-part .section",{
          y:100,
          opacity:0,
          duration:duration,
          ease:ease2,
          stagger:0.15,
          scrollTrigger:{
            trigger:".page-5",
            scroller:"body",
            start:"top 50px",
            // end:'top 10px',
            // scrub:2,
            // markers:true
            },
          onComplete:infoAnimation()
        })
      }
  })

  
}
footerAnimation()

function infoAnimation(){
  
  let duration = 2;
  ease='power3.inOut'
document.querySelector('.info').style.display='block'
  animate14 =gsap.from('.info',{
    height:0,
    padding:0,
    opacity:0,
    duration:duration,
    ease:ease,
    scrollTrigger:{
      trigger:'.page-5',
      scroller:'body',
      start:'top 10px',
      // markers:true
      },
      onComplete:()=>{
        document.querySelector('.info .wrapper').style.opacity=1
       animate15 = gsap.from('.info .wrapper',{
          opacity:0,
          duration:duration/3,
          ease:ease,
          onComplete:()=>{
            let name = document.querySelectorAll(".info .title a")
            name.forEach((a)=>{
              animateWord(a)
            })
          }
        })
        
      }
  })
}

function animateWord(a){
const letters = "ABCDEFGHIJKLMNOPQRDTUVWXYZ"
let word = a.innerText;
a.innerText = a.innerText.split('').map((letter,index) =>  {  
  return letters[Math.floor(Math.random()*26)]
}).join('')

let iterations = 0;

const interval = setInterval(()=>{
  a.innerText = a.innerText.split('').map((letter,index) =>  {
    if(index < iterations){
      return word[index]
    }
    
    return letters[Math.floor(Math.random()*26)]
  }).join('')


  if(iterations >= word.length) clearInterval(interval)

  iterations +=1/4;
},30)
}


function animate(){
  animate1.render()
  animate2.render()
  animate3.render()
  animate4.render()
  animate5.render()
  animate6.render()
  animate7.render()
  animate8.render()
  animate9.render()
  animate10.render()
  animate11.render()
  animate12.render()
  animate13.render()
  animate14.render()
  animate15.render()
  window.requestAnimationFrame(animate)
}
animate()
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/src/all';


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
    gsap.to(card,{
      scale:1.075,
      duration:duration,
      ease:"power2.inOut"
    })
    gsap.to(txt,{
      bottom:"10%",
      left:"10%",
      duration:duration,
      ease:"power2.inOut"

    })
    let gradient = card.querySelector('.page-4 .cards .gradient')
    gsap.to(gradient,{
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

  gsap.to(card,{
    scale:1,
    duration:duration,
    ease:"power2.inOut"
  })

    let txt = card.querySelector('.page-4 .cards .txt')
    gsap.to(txt,{
      bottom:"-20%",
      left:"30%",
      duration:duration,
      ease:"power2.inOut"

    })
    let gradient = card.querySelector('.page-4 .cards .gradient')
    gsap.to(gradient,{
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

function Model_animation() {
  t1.to(gltf.scene.position,{
    x:-500,
    y:-200,
  })
  
}





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
  gsap.from('.page-2 .trans-text ',{
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
  gsap.from('.page2-discription-part',{
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
gsap.from('.page-3 .top-left',{
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
gsap.from('.page-3 .bottom-right ',{
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

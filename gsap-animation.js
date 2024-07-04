import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/src/all';

document.querySelectorAll('.cards').forEach(card => {
    let card_logo = card.querySelector('.cards-logo');
    let car_name = card.querySelector('.car-name');
    let container = card.querySelector('.hover-after');
  

    container.addEventListener('mouseenter', (events) => {
 
        gsap.to([card_logo, car_name], {
            x: 30,
            opacity: 1,
            duration: 0.5
        });
    });

    container.addEventListener('mouseleave', () => {
        gsap.to([card_logo, car_name], {
            x: -20,
            opacity: 0,
            duration: 0.5
        });
    });
});


// scroll snapping 


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
    console.log(panel);
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


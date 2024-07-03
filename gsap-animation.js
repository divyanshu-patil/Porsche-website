import gsap from 'gsap';

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
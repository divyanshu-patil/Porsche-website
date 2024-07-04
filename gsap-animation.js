import gsap from 'gsap';


document.querySelectorAll('.cards').forEach(card => {
    card.addEventListener('mouseenter', () => {
        document.querySelectorAll('.cards').forEach(c => {
            if (c !== card) {
                c.classList.add('blurred');   
            }
        });
    });
    
    card.addEventListener('mouseleave', () => {
        document.querySelectorAll('.cards').forEach(c => {
            c.classList.remove('blurred');
        });
    });
});

document.querySelectorAll('.cards').forEach((card) => {

    let card_logo = card.querySelector('.cards-logo');
    let car_name = card.querySelector('.car-name');
    let container = card.querySelector('.hover-after');

    container.addEventListener('mouseenter', () => {
 
        gsap.to([card_logo, car_name], {
            y: -20,
            opacity: 1,
            duration: 0.5
        });

      
    });

    container.addEventListener('mouseleave', () => {
        gsap.to([card_logo, car_name], {
            y: 20,
            opacity: 0,
            duration: 0.5
        });

    });
});

const slider = document.querySelector('.page-4 .holder');

slider.addEventListener('wheel', (event) => {
    event.preventDefault();
    const scrollAmount = event.deltaY * 2;
    slider.scrollLeft += scrollAmount;
});

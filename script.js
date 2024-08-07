
document.addEventListener("DOMContentLoaded", () => {
    // Elements to animate
    const elementsToAnimate = [
        document.querySelector('.pic'),
        document.querySelector('.about'),
        document.querySelector('.contact-section'),
    ];

    // Add hidden class initially
    elementsToAnimate.forEach(element => {
        element.classList.add('hidden');
    });

    // Function to add fade-in class after a delay
    const animateElements = (elements, delay) => {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('fade-in');
            }, index * delay);
        });
    };

    // Trigger animations with different delays
    animateElements([document.querySelector('.pic')], 200);
    animateElements([document.querySelector('.about')], 300);
    animateElements([document.querySelector('.contact-section')], 400);
   
});

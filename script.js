
// document.addEventListener("DOMContentLoaded", () => {
//     // Elements to animate
//     const elementsToAnimate = [
//         document.querySelector('.header'),
//         document.querySelector('.pic'),
//         document.querySelector('.about'),
//         document.querySelector('.contact-section'),
//         ...document.querySelectorAll('.experience'),
//         ...document.querySelectorAll('.gallery')
//     ];

//     // Add hidden class initially
//     elementsToAnimate.forEach(element => {
//         element.classList.add('hidden');
//     });

//     // Function to add fade-in class after a delay
//     const animateElements = (elements, delay) => {
//         elements.forEach((element, index) => {
//             setTimeout(() => {
//                 element.classList.add('fade-in');
//             }, index * delay);
//         });
//     };

//     // Trigger animations with different delays
//     animateElements([document.querySelector('.header')], 100);
//     animateElements([document.querySelector('.pic')], 200);
//     animateElements([document.querySelector('.about')], 300);
//     animateElements([document.querySelector('.contact-section')], 400);
//     animateElements(document.querySelectorAll('.experience'), 100);
//     animateElements(document.querySelectorAll('.gallery'), 50);
// });

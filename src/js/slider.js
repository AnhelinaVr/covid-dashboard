import Chart from './chart-4';

/* Индекс слайда по умолчанию */
let slideIndex = 1;

/* Основная функция сладера */
function showSlides(n) {
  let i;
  const slides = document.getElementsByClassName('slider_item');

  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i += 1) {
    slides[i].style.display = 'none';
    slides[i].toggleClass('slide--active');
  }
  // App.moduleChart.setParam = (slides[slideIndex - 1].textContent).toLowerCase();
  Chart.prototype.setParam = (slides[slideIndex - 1].textContent).toLowerCase();
  console.log((slides[slideIndex - 1].textContent).toLowerCase());
  slides[slideIndex - 1].style.display = 'block';
  slides[slideIndex - 1].toggleClass('slide--active');
}

/* Функция увеличивает индекс на 1, показывает следующй слайд */
function plusSlide() {
  showSlides(slideIndex += 1);
}

/* Функция уменьшяет индекс на 1, показывает предыдущий слайд */
function minusSlide() {
  showSlides(slideIndex -= 1);
}

/* Устанавливает текущий слайд */
// function currentSlide(n) {
//   showSlides(slideIndex = n);
// }

showSlides(slideIndex);

document.querySelector('.slider_prev')
  .addEventListener(('click'), minusSlide);

document.querySelector('.slider_next')
  .addEventListener(('click'), plusSlide);

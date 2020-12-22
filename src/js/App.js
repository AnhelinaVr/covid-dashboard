import Table from './Table';
import getData from './getCountriesInfo';

export default class App {
  constructor() {
    this.data = null;
    this.country = null;
  }

  async getDatas() {
    this.data = await getData();
  }

  whendataready() {
    this.moduleTable = new Table('table',
      this.setCountry.bind(this), this.data);
    this.moduleTable.addTheadandTbody();
    this.moduleTable.showCountries('Total');
    this.addEventListenerForButtonFullscreenClick();
  }

  /* в свою таблицу передаю функцию которая вызывается когда страна меняется */

  setCountry(country) {
    this.country = country;
    this.moduleTable.showDataTargetCountry(country.country);
  }

  addEventListenerForButtonFullscreenClick() {
    const SECTIONS = document.querySelectorAll('section');
    SECTIONS.forEach((section) => {
      const FULL_SCREEN_BUTTON = section.querySelector('.fullscreen__button');
      let isButtonFullscreenClick = false;
      FULL_SCREEN_BUTTON.addEventListener('click', () => {
        const buttonImg = FULL_SCREEN_BUTTON.querySelector('img');
        if (!isButtonFullscreenClick) {
          section.classList.add('fullscreenActive');
          isButtonFullscreenClick = true;
          buttonImg.src = '/src/assets/icons/minimize.png';
        } else {
          section.classList.remove('fullscreenActive');
          isButtonFullscreenClick = false;
          buttonImg.src = '/src/assets/icons/fullscreen.png';
        }
      });
    });
    console.log(this.country);
  }
}

import CovidMap from './map';
import Chart from './chart-4';
import List from './list.modules';
import Table from './Table';
import getData from './getCountriesInfo';

export default class App {
  constructor() {
    this.data = null;
    this.country = { Country: 'Brazil', TotalConfirmed: 7110434 };
  }

  async getDatas() {
    this.data = await getData();
  }

  whendataready() {
    // table module
    this.moduleTable = new Table('table',
      this.setCountry.bind(this), this.data);
    this.moduleTable.addTheadandTbody();
    this.moduleTable.showCountries('Total');
    // map module
    this.moduleMap = new CovidMap(document.querySelector('.map-tabs'),
      this.setCountry.bind(this), this.data);
    this.moduleMap.renderData('cases');
    //  list module
    this.moduleList = new List(this.data, this.setCountry.bind(this));
    this.moduleList.showCountries();
    this.moduleList.events();
    // chart module
    this.moduleChart = new Chart();
    this.moduleChart.init();
    this.resetToGlobalButton = document.querySelector('.resetToGlobalButton');
    this.resetToGlobalButton.addEventListener('click', () => {
      this.moduleChart = new Chart('cases');
      this.moduleChart.init();
    });
    this.addEventListenerForButtonFullscreenClick();
  }

  /* в свою таблицу передаю функцию которая вызывается когда страна меняется */

  setCountry(country) {
    this.country = country;
    this.moduleMap.setCountry(country.latlng);
    this.moduleTable.showDataTargetCountry(country.country);
    this.moduleChart = new Chart('cases');
    this.moduleChart.setCountry = country.countryCode;
    this.moduleChart.init();
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

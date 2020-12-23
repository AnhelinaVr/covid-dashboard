import { CovidMap } from './map';
import Chart from './chart-4';
import { List } from './list.modules';
import Table from './Table';
import getData from './getCountriesInfo';

export default class App {
  constructor() {
    this.data = null;
    this.country = { Country: 'Brazil', TotalConfirmed: 7110434 };
    this.main = document.querySelector('.main');
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
    this.moduleChart = new Chart('cases');
    this.moduleChart.init();
    this.chartButtons = document.querySelector('.graphButtons');
    this.chartButtons.addEventListener('click', ({ target }) => {
      this.moduleChart = new Chart(`${target.textContent.toLowerCase()}`);
      this.moduleChart.init();
    });

    this.resetToGlobalButton = document.querySelector('.resetToGlobalButton');
    this.resetToGlobalButton.addEventListener('click', () => {
      this.moduleChart = new Chart('cases');
      this.moduleChart.init();
    });

    this.buttonsListner();
    this.addEventListenerForModal();
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

  buttonsListner() {
    this.main.addEventListener('click', (event) => {
      if (event.target.classList.contains('button') && !event.target.classList.contains('resetToGlobalButton')) {
        Array.from(event.target.parentElement.children).forEach((element) => {
          element.classList.remove('button--active');
        });
        event.target.classList.toggle('button--active');
      } else if (event.target.classList.contains('resetToGlobalButton')) {
        const graphButtons = document.querySelector('.graphButtons');
        Array.from(graphButtons.children).forEach((element) => {
          element.classList.remove('button--active');
        });
        graphButtons.firstElementChild.classList.add('button--active');
      }
    });
  }

  addEventListenerForModal() {
    const BODY = document.querySelector('body');
    const MODAL = document.getElementById('modal-container__box');
    const BUTTON = document.getElementById('modal-container__button-open');
    const SPAN = document.getElementsByClassName('close')[0];
    BUTTON.onclick = () => {
      MODAL.style.display = 'block';
      BODY.style.position = 'fixed';
    };
    SPAN.onclick = () => {
      MODAL.style.display = 'none';
      BODY.style.position = 'static';
    };
    window.onclick = (event) => {
      if (event.target === MODAL) {
        MODAL.style.display = 'none';
        BODY.style.position = 'static';
      }
    };

    const TAB_LINKS = document.querySelectorAll('.modal-container__tabs-list a');
    const TAB_PANELS = document.querySelectorAll('.modal-container__tabs-content__panel');

    TAB_LINKS.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.modal-container__tabs-list li.tab-active').classList.remove('tab-active');
        document.querySelector('.modal-container__tabs-content__panel.tab-active').classList.remove('tab-active');
        const PARENT_LIST_ITEM = el.parentElement;
        PARENT_LIST_ITEM.classList.add('tab-active');
        const INDEX = [...PARENT_LIST_ITEM.parentElement.children].indexOf(PARENT_LIST_ITEM);
        const PANEL = [...TAB_PANELS].filter((element) => element.getAttribute('data-index') === String(INDEX));
        PANEL[0].classList.add('tab-active');
      });
    });
    console.log(this.country);
  }
}

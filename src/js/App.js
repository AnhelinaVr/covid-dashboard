import Table from './Table';
import CovidMap from './map';
import Chart from './chart-4';
import getData from './getCountriesInfo';
import { doc } from 'prettier';

export default class App {
  constructor() {
    this.data = null;
    this.country = { Country: 'Brazil', TotalConfirmed: 7110434 };
  }

  async getDatas() {
    this.data = await getData();
  }

  whendataready() {
    this.moduleTable = new Table('.module-table', 'module-table__table',
      this.setCountry.bind(this), this.data);
    this.moduleTable.addTheadandTbody();
    this.moduleTable.showCountries('Total');
    this.moduleMap = new CovidMap(document.querySelector('#map'),
      document.querySelector('#legend'),
      document.querySelector('.map-tabs'),
      this.setCountry.bind(this), this.data);
    this.moduleMap.renderData('cases');
    this.moduleChart = new Chart('cases');
    this.moduleChart.init();
    this.chartButtons = document.querySelector('.graphButtons');
    this.chartButtons.addEventListener('click', ({ target }) => {
      this.moduleChart = new Chart(`${target.textContent.toLowerCase()}`);
      this.moduleChart.init();
    });
  }

  /* в свою таблицу передаю функцию которая вызывается когда страна меняется */

  setCountry(country) {
    this.country = country;
    this.moduleMap.setCountry(country.latlng);
    this.moduleTable.showDataTargetCountry(country.country);
  }
}

import Table from './Table';
import CovidMap from './map';
import Chart from './chart-4';
import List from './list.modules';
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
    this.moduleTable = new Table('.module-table', 'module-table__table',
      this.setCountry.bind(this), this.data);
    this.moduleTable.addTheadandTbody();
    this.moduleTable.showCountries('Total');
    this.moduleMap = new CovidMap(document.querySelector('#map'),
      document.querySelector('#legend'),
      document.querySelector('.map-tabs'),
      this.setCountry.bind(this), this.data);
    this.moduleMap.renderData('cases');
    this.moduleChart = new Chart();
    this.moduleChart.init();
    this.moduleChart.setParam = document.querySelector('.slide--active')
      .textContent.toLowerCase();
    this.moduleList = new List(this.data, this.setCountry.bind(this));
    this.moduleList.showCountries();
    this.moduleList.events();
  }

  /* в свою таблицу передаю функцию которая вызывается когда страна меняется */

  setCountry(country) {
    this.country = country;
    this.moduleMap.setCountry(country.latlng);
    this.moduleTable.showDataTargetCountry(country.country);
  }
}

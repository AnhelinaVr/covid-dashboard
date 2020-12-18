import Table from './Table';

export default class App {
  constructor() {
    this.country = { Country: 'Brazil', TotalConfirmed: 7110434 };
    this.moduleTable = new Table('.module-table', 'module-table__table', this.setCountry.bind(this));
    this.moduleTable.addTheadandTbody();
    this.moduleTable.showCountries('Total');
  }

  /* в свою таблицу передаю функцию которая вызывается когда страна меняется */

  setCountry(country) {
    this.country = country;
    console.log(country, 'app');
  }
}

const app = new App();

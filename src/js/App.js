import Table from './Table';

export default class App {
  constructor() {
    this.country = '';
  }
}

const moduleTable = new Table('table', '.module-table', 'module-table__table');
moduleTable.addTheadandTbody();
moduleTable.showCountries('Total');

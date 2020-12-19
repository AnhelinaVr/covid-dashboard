// import Table from './Table';
import CovidMap from './map';


export default class App {
    constructor() {
        this.country = { Country: 'Brazil', TotalConfirmed: 7110434 };
        // this.moduleTable = new Table('.module-table', 'module-table__table', this.setCountry.bind(this));
        // this.moduleTable.addTheadandTbody();
        // this.moduleTable.showCountries('Total');
        this.moduleMap = new CovidMap(document.querySelector('#map'),
            document.querySelector('#legend'), this.info);
        this.moduleMap.renderData('totalCases');

    }

    /* в свою таблицу передаю функцию которая вызывается когда страна меняется */

    setCountry(country) {
        this.country = country;
        console.log(country, 'app');
    }
}
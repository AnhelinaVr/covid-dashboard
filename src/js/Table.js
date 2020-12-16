export default class Table {
  constructor(type, parentSelector, className) {
    const parent = document.querySelector(parentSelector);
    this.el = document.createElement(type);
    this.el.classList.add(className);
    parent.appendChild(this.el);
    this.data = [];
    this.countries = [];
    this.searchTerm = '';
  }

  createSeacrhField() {
    const THEAD = this.el.querySelector('.module-table__table-thead');
    const ROW_INPUT = document.createElement('tr');
    THEAD.appendChild(ROW_INPUT);
    ROW_INPUT.innerHTML = '<input type="text" id="search" placeholder="Search for a Country">';
    const INPUT = document.getElementById('search');
    INPUT.addEventListener('input', (e) => {
      this.searchTerm = e.target.value;
      this.showCountries();
    });
  }

  addTheadandTbody() {
    const thead = document.createElement('thead');
    thead.classList.add('module-table__table-thead');
    const tbody = document.createElement('tbody');
    tbody.classList.add('module-table__table-tbody');
    this.el.appendChild(thead);
    this.el.appendChild(tbody);
    this.createSeacrhField();
  }

  async fetchCountries() {
    this.data = await fetch('https://api.covid19api.com/summary').then((result) => result.json());
    this.countries = this.data.Countries;
  }

  async showCountries() {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    // getting the data
    await this.fetchCountries();

    // creating structure
    console.log(this.countries);
    this.countries.filter((country) => country.Country.toLowerCase()
      .includes(this.searchTerm.toLowerCase()))
      .forEach((country) => {
        const row = document.createElement('tr');
        row.classList.add('module-table__table-tbody__tr');
        const tdLocation = document.createElement('td');
        tdLocation.classList.add('module-table__table-tbody__tr__td-location');
        const tdInfected = document.createElement('td');
        tdInfected.classList.add('module-table__table-tbody__tr__td-infected');
        const tdRecovered = document.createElement('td');
        tdRecovered.classList.add('module-table__table-tbody__tr__td-recovered');
        const tdDeath = document.createElement('td');
        tdDeath.classList.add('module-table__table-tbody__tr__td-death');
        tbody.appendChild(row);
        row.append(tdLocation, tdInfected, tdRecovered, tdDeath);
        const location = country.Country;
        const infected = country.TotalConfirmed;
        const recovered = country.TotalDeaths;
        const death = country.TotalRecovered;
        tdLocation.innerText = location;
        tdInfected.innerText = infected;
        tdRecovered.innerText = recovered;
        tdDeath.innerText = death;
      });
  }
}

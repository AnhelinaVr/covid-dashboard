import getCountriesInfo from './getCountriesInfo';

export default class Table {
  constructor(parentSelector, className, funcCountryChange) {
    const parent = document.querySelector(parentSelector);
    this.el = document.createElement('table');
    this.el.classList.add(className);
    parent.appendChild(this.el);
    this.globalInfo = null;
    this.finalCountries = [];
    this.categories = ['Total', 'New', 'Total / 100k', 'New / 100k'];
    this.indexCategory = 0;
    this.searchTerm = '';
    this.countryTarget = funcCountryChange;
  }

  /* createSeacrhFieldInModuleTable() {
    const THEAD = this.el.querySelector('.module-table__table-thead');
    const ROW_INPUT = document.createElement('tr');
    THEAD.appendChild(ROW_INPUT);
    ROW_INPUT.innerHTML = '<input type="text" id="search" placeholder="Search for a Country">';
    const INPUT = document.getElementById('search');
    INPUT.addEventListener('input', (e) => {
      this.searchTerm = e.target.value;
      this.showCountries(this.categories[this.indexCategory]);
    });
  } */

  createSeacrhFieldAndTabsContainerInModuleTable() {
    const THEAD = this.el.querySelector('.module-table__table-thead');
    const ROW_INPUT = document.createElement('tr');
    ROW_INPUT.classList.add('module-table__table-thead__search-tabs-container');
    THEAD.appendChild(ROW_INPUT);
    ROW_INPUT.innerHTML = `<button class="module-table__button" id="module-table__button__reset">
                             <img class="module-table__button__img" src="/src/assets/icons/refresh.png" alt="Refresh">
                           </button>
                           <input type="text" class="module-table__table-thead__search" id="module-table__table-search" placeholder="Search for a Country">
                           <div class = "module-table__table-thead__search-tabs-container__tab">
                             <button class="module-table__button" id="module-table__button__prev">
                               <img class="module-table__button__img" src="/src/assets/icons/left-arrow.png" alt="Prev">
                             </button>
                             <div class="module-table__text-categories">Total</div>
                             <button class="module-table__button" id="module-table__button__next">
                               <img class="module-table__button__img" src="/src/assets/icons/right-arrow.png" alt="Next">
                             </button>
                           </div>`;
    const INPUT = document.getElementById('module-table__table-search');
    INPUT.addEventListener('input', (e) => {
      this.searchTerm = e.target.value;
      this.showCountries(this.categories[this.indexCategory]);
    });
    this.addEventListenerForButton();
  }

  /* createTabsContainerInModuleTable() {
    const THEAD = this.el.querySelector('.module-table__table-thead');
    const ROW_TABS_CONTAINER = document.createElement('tr');
    ROW_TABS_CONTAINER.classList.add('module-table__table-thead__tabs-container');
    THEAD.appendChild(ROW_TABS_CONTAINER);
    ROW_TABS_CONTAINER.innerHTML = `<button class=
    "module-table__button" id="module-table__button__prev">
          <img class="module-table__button__img" src="/src/assets/icons/left-arrow.png" alt="Prev">
                                    </button>
                                    <div class="module-table__text-categories">Total</div>
       <button class="module-table__button" id="module-table__button__next">
      <img class="module-table__button__img" src="/src/assets/icons/right-arrow.png" alt="Next">
                                    </button>`;

    this.addEventListenerForButton();
  }
 */
  createRowWithGlobalInfo() {
    const THEAD = this.el.querySelector('.module-table__table-thead');
    if (THEAD.querySelector('.module-table__table-thead__target-info')) {
      const GLOBAL_INGO = THEAD.querySelector('.module-table__table-thead__target-info');
      GLOBAL_INGO.remove();
    }
    const ROW = document.createElement('tr');
    ROW.classList.add('module-table__table-thead__target-info');
    ROW.innerHTML = `<td class="module-table__table-thead__target-info__td-location">Global(total)</td>
                     <td class="module-table__table-thead__target-info__td-infected">${this.globalInfo.TotalConfirmed}</td>
                     <td class="module-table__table-thead__target-info__td-recovered">${this.globalInfo.TotalRecovered}</td>
                     <td class="module-table__table-thead__target-info__td-deaths">${this.globalInfo.TotalDeaths}</td>`;
    THEAD.appendChild(ROW);
  }

  createRowWithNamesColumns() {
    const THEAD = this.el.querySelector('.module-table__table-thead');
    const ROW = document.createElement('tr');
    ROW.classList.add('module-table__table-thead__names-columns');
    ROW.innerHTML = `<td class="module-table__table-thead__names-columns__td-location">
                       Locaction<img src="/src/assets/icons/placeholder.png" alt="Location">
                     </td>
                     <td class="module-table__table-thead__names-columns__td-infected">
                       Infected<img src="/src/assets/icons/coronavirus.png" alt="Infected">
                     </td>
                     <td class="module-table__table-thead__names-columns__td-recovered">
                       Recovered<img src="/src/assets/icons/heartbeat.png" alt="Recovered">
                     </td>
                     <td class="module-table__table-thead__names-columns__td-deaths">
                       Deaths<img src="/src/assets/icons/skull.png" alt="Deaths">
                     </td>`;
    THEAD.appendChild(ROW);
  }

  addEventListenerForCountry() {
    const COUNTRIES = document.querySelectorAll('.module-table__table-tbody__tr');
    const INPUT = document.getElementById('module-table__table-search');
    COUNTRIES.forEach((country) => {
      country.addEventListener('click', () => {
        const LOCATION = country.querySelector('.module-table__table-tbody__tr__td-location').textContent;
        let DATA_COUNTRY = null;
        DATA_COUNTRY = this.finalCountries.find((obj) => LOCATION === obj.Country);
        INPUT.value = DATA_COUNTRY.Country;
        this.searchTerm = INPUT.value;
        this.showCountries(this.categories[this.indexCategory]);
        this.countryTarget(DATA_COUNTRY);
      });
    });
  }

  addEventListenerForButton() {
    const BUTTONS_CATEGORIES = document.querySelectorAll('.module-table__button');
    const NAME_CATEGORIES = document.querySelector('.module-table__text-categories');
    BUTTONS_CATEGORIES.forEach((element) => {
      element.addEventListener('click', () => {
        if (element.id === 'module-table__button__prev') {
          this.indexCategory -= 1;
          if (this.indexCategory < 0) {
            this.indexCategory = 3;
          }
          NAME_CATEGORIES.textContent = `${this.categories[this.indexCategory]}`;
          this.showCountries(this.categories[this.indexCategory]);
        } else if (element.id === 'module-table__button__next') {
          this.indexCategory += 1;
          if (this.indexCategory > 3) {
            this.indexCategory = 0;
          }
          NAME_CATEGORIES.textContent = `${this.categories[this.indexCategory]}`;
          this.showCountries(this.categories[this.indexCategory]);
        } else if (element.id === 'module-table__button__reset') {
          const INPUT = document.getElementById('module-table__table-search');
          INPUT.value = '';
          this.indexCategory += 0;
          this.searchTerm = '';
          NAME_CATEGORIES.textContent = `${this.categories[this.indexCategory]}`;
          this.showCountries(this.categories[this.indexCategory]);
        }
        /* this.indexCategory += 0;
          this.searchTerm = '';
          NAME_CATEGORIES.textContent = `${this.categories[this.indexCategory]}`;
          this.showCountries(this.categories[this.indexCategory]); */
      });
    });
  }

  addTheadandTbody() {
    const THEAD = document.createElement('thead');
    THEAD.classList.add('module-table__table-thead');
    const TBODY = document.createElement('tbody');
    TBODY.classList.add('module-table__table-tbody');
    this.el.appendChild(THEAD);
    this.el.appendChild(TBODY);
    this.createSeacrhFieldAndTabsContainerInModuleTable();
    /* this.createSeacrhFieldInModuleTable();
    this.createTabsContainerInModuleTable(); */
    this.createRowWithNamesColumns();
    /* this.createRowWithGlobalInfo(); */
  }

  /* async fetchCountries() {
    const DATA_BY_COUNTRIES_COVID = await fetch('https://api.covid19api.com/summary').then((result) => result.json());
    const DATA_BY_COUNTRIES_OTHER = await fetch('https://restcountries.eu/rest/v2/all').then((result) => result.json());
    this.globalInfo = DATA_BY_COUNTRIES_COVID.Global;
    this.countries = DATA_BY_COUNTRIES_COVID.Countries;
    this.finalCountries = [];
    this.countries.forEach((el) => {
      const newCountry = {};
      newCountry.Country = el.Country;
      newCountry.TotalConfirmed = el.TotalConfirmed;
      newCountry.TotalRecovered = el.TotalRecovered;
      newCountry.TotalDeaths = el.TotalDeaths;
      newCountry.NewConfirmed = el.NewConfirmed;
      newCountry.NewRecovered = el.NewRecovered;
      newCountry.NewDeaths = el.NewDeaths;
      newCountry.Coordinates = DATA_BY_COUNTRIES_OTHER
        .find((obj) => el.CountryCode === obj.alpha2Code).latlng;
      newCountry.Population = DATA_BY_COUNTRIES_OTHER
        .find((obj) => el.CountryCode === obj.alpha2Code).population;
      newCountry.Flag = DATA_BY_COUNTRIES_OTHER
        .find((obj) => el.CountryCode === obj.alpha2Code).flag;
      this.finalCountries.push(newCountry);
    });
    this.sortDataCountries();
    console.log(this.finalCountries);
  } */

  sortDataCountries() {
    this.finalCountries = this.finalCountries.sort((a, b) => b.TotalConfirmed - a.TotalConfirmed);
  }

  async showCountries(param) {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    // getting the data
    const data = await getCountriesInfo();
    this.finalCountries = data.countriesInfo;
    this.globalInfo = data.globalInfo;
    console.log(this.finalCountries);

    this.createRowWithGlobalInfo();

    // creating structure
    this.finalCountries.filter((country) => country.country.toLowerCase()
      .includes(this.searchTerm.toLowerCase()))
      .forEach((country) => {
        const ROW = document.createElement('tr');
        ROW.classList.add('module-table__table-tbody__tr');
        const tdLocation = document.createElement('td');
        tdLocation.classList.add('module-table__table-tbody__tr__td-location');
        const tdInfected = document.createElement('td');
        tdInfected.classList.add('module-table__table-tbody__tr__td-infected');
        const tdRecovered = document.createElement('td');
        tdRecovered.classList.add('module-table__table-tbody__tr__td-recovered');
        const tdDeath = document.createElement('td');
        tdDeath.classList.add('module-table__table-tbody__tr__td-deaths');
        tbody.appendChild(ROW);
        ROW.append(tdLocation, tdInfected, tdRecovered, tdDeath);
        let location = null;
        let confirmed = null;
        let recovered = null;
        let death = null;
        const POPULATION_100K = 100000;
        if (param === 'Total') {
          location = country.country;
          confirmed = country.TotalConfirmed;
          recovered = country.TotalRecovered;
          death = country.TotalDeaths;
        } else if (param === 'New') {
          location = country.Country;
          confirmed = country.NewConfirmed;
          recovered = country.NewRecovered;
          death = country.NewDeaths;
        } else if (param === 'Total / 100k') {
          location = country.Country;
          confirmed = ((country.TotalConfirmed / country.Population) * POPULATION_100K).toFixed(2);
          recovered = ((country.TotalRecovered / country.Population) * POPULATION_100K).toFixed(2);
          death = ((country.TotalDeaths / country.Population) * POPULATION_100K).toFixed(2);
        } else if (param === 'New / 100k') {
          location = country.Country;
          confirmed = ((country.NewConfirmed / country.Population) * POPULATION_100K).toFixed(2);
          recovered = ((country.NewRecovered / country.Population) * POPULATION_100K).toFixed(2);
          death = ((country.NewDeaths / country.Population) * POPULATION_100K).toFixed(2);
        }
        tdLocation.innerText = location;
        tdInfected.innerText = confirmed;
        tdRecovered.innerText = recovered;
        tdDeath.innerText = death;
      });
    this.addEventListenerForCountry();
    console.log(this.globalInfo);
  }
}

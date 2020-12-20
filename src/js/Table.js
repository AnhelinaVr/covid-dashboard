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
    COUNTRIES.forEach((cntr) => {
      cntr.addEventListener('click', () => {
        const LOCATION = cntr.querySelector('.module-table__table-tbody__tr__td-location').textContent;
        const DATA_COUNTRY = this.finalCountries.find((obj) => LOCATION === obj.country);
        INPUT.value = DATA_COUNTRY.country;
        this.searchTerm = INPUT.value;
        /* this.showCountries(this.categories[this.indexCategory]); */
        this.countryTarget(DATA_COUNTRY);
      });
    });
  }

  showDataTargetCountry(targetCountry) {
    const INPUT = document.getElementById('module-table__table-search');
    const DATA_COUNTRY = targetCountry;
    INPUT.value = DATA_COUNTRY;
    this.searchTerm = DATA_COUNTRY;
    this.showCountries(this.categories[this.indexCategory]);
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
    this.createRowWithNamesColumns();
  }

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

    this.createRowWithGlobalInfo();
    this.sortDataCountries();

    // creating structure
    this.finalCountries.filter((country) => country.country.toLowerCase()
      .includes(this.searchTerm.toLowerCase()))
      .forEach((cntr) => {
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
          location = cntr.country;
          confirmed = cntr.TotalConfirmed;
          recovered = cntr.TotalRecovered;
          death = cntr.TotalDeaths;
        } else if (param === 'New') {
          location = cntr.country;
          confirmed = cntr.NewConfirmed;
          recovered = cntr.NewRecovered;
          death = cntr.NewDeaths;
        } else if (param === 'Total / 100k') {
          location = cntr.country;
          confirmed = ((cntr.TotalConfirmed / cntr.population) * POPULATION_100K).toFixed(2);
          recovered = ((cntr.TotalRecovered / cntr.population) * POPULATION_100K).toFixed(2);
          death = ((cntr.TotalDeaths / cntr.population) * POPULATION_100K).toFixed(2);
        } else if (param === 'New / 100k') {
          location = cntr.country;
          confirmed = ((cntr.NewConfirmed / cntr.population) * POPULATION_100K).toFixed(2);
          recovered = ((cntr.NewRecovered / cntr.population) * POPULATION_100K).toFixed(2);
          death = ((cntr.NewDeaths / cntr.population) * POPULATION_100K).toFixed(2);
        }
        tdLocation.innerText = location;
        tdInfected.innerText = confirmed;
        tdRecovered.innerText = recovered;
        tdDeath.innerText = death;
      });
    this.addEventListenerForCountry();
  }
}

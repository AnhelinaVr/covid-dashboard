export default class Table {
  constructor(el, funcCountryChange, data) {
    this.el = document.querySelector(el);
    this.globalInfo = data.globalInfo;
    this.finalCountries = data.countriesInfo;
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
    ROW_INPUT.innerHTML = `<button class="module-table__button module-table__button__reset" id="module-table__button__reset">
                             <img class="module-table__button__reset__img" src="../assets/icons/refresh.png" alt="Reset">
                           </button>
                           <div class="search-container">
                              <input type="text" class="module-table__table-thead__search" id="module-table__table-search" placeholder="Search for a Country" placeholder="Search for a Country" />
                              <input class="button__kb__view" type="button">
                            </div>
                           <div class = "module-table__table-thead__search-tabs-container__tab">
                             <button class="module-table__button" id="module-table__button__prev">
                               <img class="module-table__button__arrow__img" src="../assets/icons/left-arrow.png" alt="Prev">
                             </button>
                             <div class="module-table__text-categories">Total</div>
                             <button class="module-table__button" id="module-table__button__next">
                               <img class="module-table__button__arrow__img" src="../assets/icons/right-arrow.png" alt="Next">
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
    let CASES = null;
    let RECOVERED = null;
    let DEATHS = null;
    const POPULATION_100K = 100000;
    if (this.indexCategory === 0) {
      CASES = this.globalInfo.cases;
      RECOVERED = this.globalInfo.recovered;
      DEATHS = this.globalInfo.deaths;
    } else if (this.indexCategory === 1) {
      CASES = this.globalInfo.todayCases;
      RECOVERED = this.globalInfo.todayRecovered;
      DEATHS = this.globalInfo.todayDeaths;
    } else if (this.indexCategory === 2) {
      CASES = ((this.globalInfo.cases / this.globalInfo.population) * POPULATION_100K).toFixed(2);
      RECOVERED = ((this.globalInfo.recovered / this.globalInfo.population)
                * POPULATION_100K).toFixed(2);
      DEATHS = ((this.globalInfo.deaths / this.globalInfo.population) * POPULATION_100K).toFixed(2);
    } else if (this.indexCategory === 3) {
      CASES = ((this.globalInfo.todayCases / this.globalInfo.population)
                * POPULATION_100K).toFixed(2);
      RECOVERED = ((this.globalInfo.todayRecovered / this.globalInfo.population)
                * POPULATION_100K).toFixed(2);
      DEATHS = ((this.globalInfo.todayDeaths / this.globalInfo.population)
                * POPULATION_100K).toFixed(2);
    }
    ROW.innerHTML = `<td class="module-table__table-thead__target-info__td-location">Global</td>
                     <td class="module-table__table-thead__target-info__td-infected">${CASES}</td>
                     <td class="module-table__table-thead__target-info__td-recovered">${RECOVERED}</td>
                     <td class="module-table__table-thead__target-info__td-deaths">${DEATHS}</td>`;
    THEAD.appendChild(ROW);
  }

  createRowWithNamesColumns() {
    const THEAD = this.el.querySelector('.module-table__table-thead');
    const ROW = document.createElement('tr');
    ROW.classList.add('module-table__table-thead__names-columns');
    ROW.innerHTML = `<td class="module-table__table-thead__names-columns__td-location">
                       Locaction<img src="../assets/icons/placeholder.png" alt="Location">
                     </td>
                     <td class="module-table__table-thead__names-columns__td-infected">
                       Infected<img src="../assets/icons/coronavirus.png" alt="Infected">
                     </td>
                     <td class="module-table__table-thead__names-columns__td-recovered">
                       Recovered<img src="../assets/icons/heartbeat.png" alt="Recovered">
                     </td>
                     <td class="module-table__table-thead__names-columns__td-deaths">
                       Deaths<img src="../assets/icons/skull.png" alt="Deaths">
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
    this.finalCountries = this.finalCountries.sort((a, b) => b.cases - a.cases);
    return this.finalCountries;
  }

  async showCountries(param) {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

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
          confirmed = cntr.cases;
          recovered = cntr.recovered;
          death = cntr.deaths;
        } else if (param === 'New') {
          location = cntr.country;
          confirmed = cntr.todayCases;
          recovered = cntr.todayRecovered;
          death = cntr.todayDeaths;
        } else if (param === 'Total / 100k') {
          location = cntr.country;
          confirmed = ((cntr.cases / cntr.population) * POPULATION_100K).toFixed(2);
          recovered = ((cntr.recovered / cntr.population) * POPULATION_100K).toFixed(2);
          death = ((cntr.deaths / cntr.population) * POPULATION_100K).toFixed(2);
        } else if (param === 'New / 100k') {
          location = cntr.country;
          confirmed = ((cntr.todayCases / cntr.population) * POPULATION_100K).toFixed(2);
          recovered = ((cntr.todayRecovered / cntr.population) * POPULATION_100K).toFixed(2);
          death = ((cntr.todayDeaths / cntr.population) * POPULATION_100K).toFixed(2);
        }
        tdLocation.innerText = location;
        tdInfected.innerText = confirmed;
        tdRecovered.innerText = recovered;
        tdDeath.innerText = death;
      });
    this.addEventListenerForCountry();
  }
}

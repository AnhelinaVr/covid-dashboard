function numberWithCommas(cases) {
  return cases
    .toFixed()
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function showFlag(country, id) {
  const countryFlag = document.createElement('img');
  countryFlag.innerHTML = '';
  const li = document.querySelector(`#${id}`);

  countryFlag.src = country.flag;
  countryFlag.classList.add('country-item__flag');
  li.prepend(countryFlag);
}

function getParams(data, casesOnPopalaton, filterParam, country, id) {
  const countryInfo = document.createElement('div');
  const countryPopulation = document.createElement('h2');
  const countryPopulationText = document.createElement('h5');
  const li = document.querySelector(`#${id}`);

  let nameParam = filterParam.split(/(?=[A-Z])/).join(' ');
  if (casesOnPopalaton) {
    countryPopulation.innerText = numberWithCommas((data / country.population) * 100000);
    nameParam += ' on 100k';
  } else {
    countryPopulation.innerText = numberWithCommas(data);
  }
  countryPopulation.classList.add('country-item__population');
  countryInfo.classList.add('country-item__info');

  countryPopulationText.innerText = nameParam;
  countryPopulationText.classList.add('country-item__population--text');

  countryInfo.appendChild(countryPopulation);
  countryInfo.appendChild(countryPopulationText);
  li.appendChild(countryInfo);
}
export default class List {
  constructor(data, funcCountryChange) {
    this.searchInput = document.getElementById('search');
    this.results = document.getElementById('results');
    this.on100KCases = 100000;
    this.searchTerm = '';
    this.countryTarget = funcCountryChange;
    this.finalCountries = data.countriesInfo;
  }

  createListElement(country, filterParam, casesOnPopalaton) {
    const id = country.countryCode;
    const data = country[`${filterParam}`];
    const li = document.createElement('li');
    const countryName = document.createElement('h3');
    const ul = document.querySelector('.countries');

    li.classList.add('country-item');
    li.id = `${id}`;

    countryName.innerText = country.country;
    countryName.classList.add('country-item__name');
    li.appendChild(countryName);
    ul.appendChild(li);
    getParams(data, casesOnPopalaton, filterParam, country, id);

    showFlag(country, id);

    li.addEventListener('click', () => {
      this.countryTarget(country);
    });
  }

  events() {
    const searchInput = document.getElementById('search');
    const buttonsTotal = document.querySelector('.buttonsTotal');
    let searchTerm = '';
    let currentParam = 'cases';
    let casesOnPopalaton = 'TotalConfirmed';

    searchInput.addEventListener('input', (e) => {
      console.log(e);
      searchTerm = e.target.value;
      this.showCountries(currentParam, casesOnPopalaton, searchTerm);
    });

    buttonsTotal.addEventListener('click', (event) => {
      currentParam = event.target.id;
      casesOnPopalaton = event.target.getAttribute('population');
      this.showCountries(currentParam, casesOnPopalaton);
    });
  }

  async showCountries(filterParam, casesOnPopalaton, searchTerm) {
    let paramToFilter = filterParam;
    this.results.innerHTML = '';
    if (!paramToFilter) {
      paramToFilter = 'cases';
    }

    if (searchTerm) {
      this.searchTerm = searchTerm;
    } else {
      this.searchTerm = '';
    }

    const ul = document.createElement('ul');
    ul.classList.add('countries');
    this.results.appendChild(ul);
    this.finalCountries
      .filter((country) => country.country.toLowerCase().includes(this.searchTerm.toLowerCase()))
      .filter((country) => country.countryCode)
      .sort((a, b) => {
        if (casesOnPopalaton) {
          return (
            ((a[`${paramToFilter}`] / a.population) * this.on100KCases).toFixed()
                        - ((b[`${paramToFilter}`] / b.population) * this.on100KCases).toFixed()
          );
        }
        return a[`${paramToFilter}`] - b[`${paramToFilter}`];
      })
      .reverse()
      .forEach((country) => {
        this.createListElement(country, paramToFilter, casesOnPopalaton);
      });
  }
}

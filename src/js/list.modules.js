import getCountriesInfo from './getCountriesInfo';

export { showCountries };

const searchInput = document.getElementById('search');
const results = document.getElementById('results');
const buttonsTotal = document.querySelector('.buttonsTotal');
let countries;
const on100KCases = 100000;
const getData = async () => {
  const data = await getCountriesInfo();
  countries = data.countriesInfo; // массив инфа по странам
};

let searchTerm = '';

function numberWithCommas(x) {
  return x
    .toFixed()
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const showFlag = async (country) => {
  //   await fetchFlag(CountryCode);
  const id = `#${country.CountryCode}`;
  const countryFlag = document.createElement('img');
  countryFlag.innerHTML = '';
  const li = document.querySelector(id);

  countryFlag.src = country.flag;
  countryFlag.classList.add('country-item__flag');
  li.prepend(countryFlag);
};

const getParams = async (data, casesOnPopalaton, filterParam, country) => {
  const id = `#${country.CountryCode}`;
  const countryInfo = document.createElement('div');
  const countryPopulation = document.createElement('h2');
  const countryPopulationText = document.createElement('h5');
  const li = document.querySelector(id);

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
};

function createListElement(country, filterParam, casesOnPopalaton) {
  const data = country[`${filterParam}`];
  const li = document.createElement('li');
  const countryName = document.createElement('h3');
  const ul = document.querySelector('.countries');

  li.classList.add('country-item');
  li.id = country.CountryCode;

  countryName.innerText = country.country;
  countryName.classList.add('country-item__name');
  li.appendChild(countryName);
  ul.appendChild(li);
  getParams(data, casesOnPopalaton, filterParam, country);

  showFlag(country);
}

const showCountries = async (filterParam, casesOnPopalaton) => {
  results.innerHTML = '';

  if (!filterParam) {
    filterParam = 'TotalConfirmed';
  }
  await getData();

  // creating structure
  const ul = document.createElement('ul');
  ul.classList.add('countries');
  results.appendChild(ul);

  countries
    .filter((country) => country.country.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (casesOnPopalaton) {
        return (
          ((a[`${filterParam}`] / a.population) * on100KCases).toFixed()
          - ((b[`${filterParam}`] / b.population) * on100KCases).toFixed()
        );
      }
      return a[`${filterParam}`] - b[`${filterParam}`];
    })
    .reverse()
    .forEach((country) => {
      createListElement(country, filterParam, casesOnPopalaton);
    });
};

let timerId = '';
let currentParam = 'TotalConfirmed';
let casesOnPopalaton = 'TotalConfirmed';

searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value;
  clearTimeout(timerId);
  timerId = setTimeout(showCountries, 700, currentParam, casesOnPopalaton);
});

buttonsTotal.addEventListener('click', (event) => {
  showCountries(event.target.id, event.target.getAttribute('population'));
  currentParam = event.target.id;
  casesOnPopalaton = event.target.getAttribute('population');
});

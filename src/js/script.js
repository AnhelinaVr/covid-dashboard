import '../styles/main.scss';
import 'normalize.css';

// console.log('Hello!');

const searchInput = document.getElementById('search');
const results = document.getElementById('results');
const buttonsTotal = document.querySelector('.buttonsTotal');

let searchTerm = '';
let countriesList;
let flag;

const fetchCountries = async () => {
  countriesList = await fetch(
    'https://api.covid19api.com/summary',
  ).then((res) => res.json());
};
const fetchFlag = async (CountryCode) => {
  const link = `https://restcountries.eu/rest/v2/alpha/${CountryCode}?fields=population;flag`;
  flag = await fetch(link).then((res) => res.json());
};

function numberWithCommas(x) {
  return x.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const showFlag = async (CountryCode) => {
  await fetchFlag(CountryCode);
  const id = `#${CountryCode}`;
  const countryFlag = document.createElement('img');
  countryFlag.innerHTML = '';
  const li = document.querySelector(id);

  countryFlag.src = flag.flag;
  countryFlag.classList.add('country-item__flag');
  li.prepend(countryFlag);
};

const getParams = async (CountryCode, data, population, filterParam) => {
  await fetchFlag(CountryCode);
  const id = `#${CountryCode}`;
  const countryInfo = document.createElement('div');
  const countryPopulation = document.createElement('h2');
  const countryPopulationText = document.createElement('h5');
  const li = document.querySelector(id);

  let nameParam = filterParam.split(/(?=[A-Z])/).join(' ');
  if (population) {
    countryPopulation.innerText = numberWithCommas((data / flag.population) * 100000);
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

function createListElement(country, filterParam, ul, population) {
  const data = country[`${filterParam}`];
  const li = document.createElement('li');
  const countryName = document.createElement('h3');

  li.classList.add('country-item');
  li.id = country.CountryCode;

  countryName.innerText = country.Country;
  countryName.classList.add('country-item__name');

  getParams(country.CountryCode, data, population, filterParam);

  li.appendChild(countryName);
  ul.appendChild(li);
  showFlag(country.CountryCode);
}

const showCountries = async (filterParam, population) => {
  results.innerHTML = '';

  // getting the data
  await fetchCountries();

  // creating structure
  const ul = document.createElement('ul');
  ul.classList.add('countries');
  countriesList.Countries
    .filter((country) => country.Country.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a[`${filterParam}`] - b[`${filterParam}`])
    .reverse()
    .forEach((country) => {
      createListElement(country, filterParam, ul, population);
    });
  results.appendChild(ul);
};

showCountries('TotalConfirmed');
let timerId = '';
let currentParam = 'TotalConfirmed';
let currentAtr = 'TotalConfirmed';

searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value;
  clearTimeout(timerId);
  timerId = setTimeout(showCountries, 700, currentParam, currentAtr);
});

buttonsTotal.addEventListener('click', (event) => {
  showCountries(event.target.id, event.target.getAttribute('population'));
  currentParam = event.target.id;
  currentAtr = event.target.getAttribute('population');
});

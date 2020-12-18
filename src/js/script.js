import '../styles/main.scss';
import 'normalize.css';

// console.log('Hello!');

const searchInput = document.getElementById('search');
const results = document.getElementById('results');
const newCases = document.getElementById('NewConfirmed');
const totalCases = document.getElementById('TotalConfirmed');

let searchTerm = '';
let countriesList;
let flag;

const fetchCountries = async () => {
  countriesList = await fetch(
    'https://api.covid19api.com/summary',
  ).then((res) => res.json());
};
const fetchFlag = async (CountryCode) => {
  const link = `https://restcountries.eu/rest/v2/alpha/${CountryCode}?fields=name;flag`;
  flag = await fetch(link).then((res) => res.json());
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const showFlag = async (CountryCode) => {
  await fetchFlag(CountryCode);
  const id = `#${CountryCode}`;
  const countryFlag = document.createElement('img');
  const li = document.querySelector(id);

  countryFlag.src = flag.flag;
  countryFlag.classList.add('country-item__flag');
  li.prepend(countryFlag);
};

const showCountries = async (param) => {
  results.innerHTML = '';
  console.log(param);

  // getting the data
  await fetchCountries();
  // creating structure

  const ul = document.createElement('ul');
  ul.classList.add('countries');
  console.log(countriesList);
  countriesList.Countries
    .filter((country) => country.Country.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.TotalConfirmed - b.TotalConfirmed)
    .reverse()
    .forEach((country) => {
      console.log(country);
      const li = document.createElement('li');
      const countryName = document.createElement('h3');
      const countryInfo = document.createElement('div');
      const countryPopulation = document.createElement('h2');
      const countryPopulationText = document.createElement('h5');

      li.classList.add('country-item');
      li.id = country.CountryCode;
      countryInfo.classList.add('country-item__info');

      countryName.innerText = country.Country;
      countryName.classList.add('country-item__name');

      countryPopulation.innerText = numberWithCommas(country.TotalConfirmed);
      countryPopulation.classList.add('country-item__population');

      countryPopulationText.innerText = 'Total Confirmed';
      countryPopulationText.classList.add('country-item__population--text');

      countryInfo.appendChild(countryPopulation);
      countryInfo.appendChild(countryPopulationText);

      li.appendChild(countryName);
      li.appendChild(countryInfo);
      ul.appendChild(li);
      showFlag(country.CountryCode);
    });
  results.appendChild(ul);
};

showCountries('TotalConfirmed');

searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value;
  showCountries();
});

newCases.addEventListener('click', () => {
  showCountries(newCases.id);
  console.log();
});

totalCases.addEventListener('click', () => {
  showCountries(totalCases.id);
});

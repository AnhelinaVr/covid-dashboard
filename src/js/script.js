import '../styles/main.scss';
import 'normalize.css';

// console.log('Hello!');

const searchInput = document.getElementById('search');
const results = document.getElementById('results');

let searchTerm = '';
let countries;
let flag;

const fetchCountries = async () => {
  countries = await fetch('https://api.covid19api.com/summary').then((res) => res.json());
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

const showCountries = async () => {
  results.innerHTML = '';

  // getting the data
  await fetchCountries();
  // creating structure
  const ul = document.createElement('ul');
  ul.classList.add('countries');
  countries.Countries
    .filter((country) => country.Country.toLowerCase().includes(searchTerm.toLowerCase()))
    // .sort(country.Country)
    .sort((a, b) => {
      if (a.TotalConfirmed > b.TotalConfirmed) {
        return -1;
      }
      if (a.TotalConfirmed < b.TotalConfirmed) {
        return 1;
      }
      // a должно быть равным b
      return 0;
    })
    .forEach((country) => {
      const li = document.createElement('li');
      //   const countryFlag = document.createElement('img');
      const countryName = document.createElement('h3');
      const countryInfo = document.createElement('div');
      const countryPopulation = document.createElement('h2');
      const countryPopulationText = document.createElement('h5');

      li.classList.add('country-item');
      li.id = country.CountryCode;
      countryInfo.classList.add('country-item__info');

      //   showFlag(country.CountryCode);
      //   console.log(showFlag(country.CountryCode));
      //   countryFlag.src = showFlag(country.CountryCode);
      //   countryFlag.classList.add('country-item__flag');

      countryName.innerText = country.Country;
      countryName.classList.add('country-item__name');

      countryPopulation.innerText = numberWithCommas(country.TotalConfirmed);
      countryPopulation.classList.add('country-item__population');

      countryPopulationText.innerText = 'Total Confirmed';
      countryPopulationText.classList.add('country-item__population--text');

      countryInfo.appendChild(countryPopulation);
      countryInfo.appendChild(countryPopulationText);

      //   li.appendChild(countryFlag);
      //   console.log(showFlag(country.CountryCode));
      //   li.appendChild(showFlag(country.CountryCode));
      li.appendChild(countryName);
      li.appendChild(countryInfo);
      ul.appendChild(li);
      showFlag(country.CountryCode);
    });
  results.appendChild(ul);
};

showCountries();

searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value;
  showCountries();
});

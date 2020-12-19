async function fetchCountries() {
  const dataCovid = await fetch('https://api.covid19api.com/summary')
    .then((result) => result.json());
  const dataPopulation = await fetch('https://restcountries.eu/rest/v2/all')
    .then((result) => result.json());
  const countries = dataCovid.Countries;
  const globalInfo = dataCovid.Global;
  const countriesInfo = [];
  countries.forEach((elem) => {
    const newCountry = {};
    newCountry.CountryCode = elem.CountryCode;
    newCountry.country = elem.Country;
    newCountry.TotalConfirmed = elem.TotalConfirmed;
    newCountry.TotalRecovered = elem.TotalRecovered;
    newCountry.TotalDeaths = elem.TotalDeaths;
    newCountry.NewConfirmed = elem.NewConfirmed;
    newCountry.NewRecovered = elem.NewRecovered;
    newCountry.NewDeaths = elem.NewDeaths;
    newCountry.latlng = dataPopulation.find(
      (obj) => elem.CountryCode === obj.alpha2Code,
    ).latlng;
    newCountry.population = dataPopulation.find(
      (obj) => elem.CountryCode === obj.alpha2Code,
    ).population;
    newCountry.flag = dataPopulation.find(
      (obj) => elem.CountryCode === obj.alpha2Code,
    ).flag;
    countriesInfo.push(newCountry);
  });
  return { countriesInfo, globalInfo };
}

export default fetchCountries;

export default async function getCountriesInfo() {
  const response = await fetch('https://disease.sh/v3/covid-19/countries');
  const responseGlobal = await fetch('https://disease.sh/v3/covid-19/all');
  const countries = await response.json();
  const globalInfo = await responseGlobal.json();
  const countriesInfo = [];
  countries.forEach((elem) => {
    const newCountry = {};
    newCountry.countryCode = elem.countryInfo.iso2;
    newCountry.country = elem.country;
    newCountry.cases = elem.cases;
    newCountry.recovered = elem.recovered;
    newCountry.deaths = elem.deaths;
    newCountry.todayCases = elem.todayCases;
    newCountry.todayRecovered = elem.todayRecovered;
    newCountry.todayDeaths = elem.todayDeaths;
    newCountry.latlng = [elem.countryInfo.lat, elem.countryInfo.long];
    newCountry.population = elem.population;
    newCountry.flag = elem.countryInfo.flag;
    countriesInfo.push(newCountry);
  });

  return { countriesInfo, globalInfo };
}

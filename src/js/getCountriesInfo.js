/**
 * Возвращает данные по covid в разных странах
 * И некоторую доп. информацию (население, координаты)
 *
 * @return {Object}
 *
 *    !!! как получить данные
 *
 *
 *   -------------------------------------------
 *    1. В конструкторе класса должен приниматься аргумент (data)
 *      this.globalInfo = data.globalInfo;       // объект тотал инфа
 *      this.countriesInfo = data.countriesInfo; // массив инфа по странам
 *      ...
 *      const countries = this.countriesInfo;
 *      const general = this.globalInfo;
 *   -------------------------------------------
 *
 * cases:          @type {Number}               // общее кол-во заболевших за весь период
 * country:        @type {String}               // Название страны
 * countryCode:    @type {String}               // код страны в формате iso2
 * deaths:         @type {Number}               // общее кол-во погибших за весь период
 * flag:           @type {String} "[name].png"  // изображение с флагом страны
 * latlng:         @type {Array}                // координаты
 * population:     @type {Number}               // население
 * recovered:      @type {Number}               // общее кол-во выздоровевших за весь период
 * todayCases:     @type {Number}               // кол-во заболевших за последний день
 * todayDeaths:    @type {Number}               // кол-во погибших за последний день
 * todayRecovered: @type {Number}               // кол-во выздоровевших за последний день
 *
 */

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

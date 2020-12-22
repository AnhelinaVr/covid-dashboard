import Table from '../Table';

const datas = {
  countriesInfo: [{
    cases: 18474609,
    country: 'USA',
    countryCode: 'US',
    deaths: 326772,
    flag: 'https://disease.sh/assets/img/flags/us.png',
    latlng: [38, -97],
    population: 331923317,
    recovered: 10806829,
    todayCases: 893,
    todayDeaths: 0,
    todayRecovered: 4333,
  },
  {
    cases: 2479151,
    country: 'France',
    countryCode: 'FR',
    deaths: 60900,
    flag: 'https://disease.sh/assets/img/flags/fr.png',
    latlng: [46, 2],
    population: 65342214,
    recovered: 184464,
    todayCases: 0,
    todayDeaths: 0,
    todayRecovered: 0,
  },
  {
    cases: 2906503,
    country: 'Russia',
    countryCode: 'RU',
    deaths: 51912,
    flag: 'https://disease.sh/assets/img/flags/ru.png',
    latlng: [60, 100],
    population: 145964267,
    recovered: 2319520,
    todayCases: 28776,
    todayDeaths: 561,
    todayRecovered: 24158,
  },
  ],
  globalInfo: {
    active: 21415096,
    activePerOneMillion: 2747.24,
    affectedCountries: 220,
    cases: 77850804,
    casesPerOneMillion: 9988,
    critical: 106205,
    criticalPerOneMillion: 13.62,
    deaths: 1711847,
    deathsPerOneMillion: 219.6,
    oneCasePerPeople: 0,
    oneDeathPerPeople: 0,
    oneTestPerPeople: 0,
    population: 7795123586,
    recovered: 54723861,
    recoveredPerOneMillion: 7020.27,
    tests: 1161140298,
    testsPerOneMillion: 148957.27,
    todayCases: 121156,
    todayDeaths: 3170,
    todayRecovered: 138987,
    updated: 1608644501026,
  },
};

const dataSort = [{
  cases: 18474609,
  country: 'USA',
  countryCode: 'US',
  deaths: 326772,
  flag: 'https://disease.sh/assets/img/flags/us.png',
  latlng: [38, -97],
  population: 331923317,
  recovered: 10806829,
  todayCases: 893,
  todayDeaths: 0,
  todayRecovered: 4333,
},
{
  cases: 2906503,
  country: 'Russia',
  countryCode: 'RU',
  deaths: 51912,
  flag: 'https://disease.sh/assets/img/flags/ru.png',
  latlng: [60, 100],
  population: 145964267,
  recovered: 2319520,
  todayCases: 28776,
  todayDeaths: 561,
  todayRecovered: 24158,
},
{
  cases: 2479151,
  country: 'France',
  countryCode: 'FR',
  deaths: 60900,
  flag: 'https://disease.sh/assets/img/flags/fr.png',
  latlng: [46, 2],
  population: 65342214,
  recovered: 184464,
  todayCases: 0,
  todayDeaths: 0,
  todayRecovered: 0,
},
];

/* const table = require('../Table'); */

it(('check function'), () => {
  const newTable = new Table('table', () => {}, datas);
  /* newTable.finalCountries = [{ country: 'Poland', population: 447 }, { country: 'Belarus', population: 223 }]; */
  newTable.sortDataCountries();
  expect(newTable.sortDataCountries()).toBe(3);
  /* console.log(newTable.sortDataCountries()); */
});

/* import table from '../Table';

jest.mock('../Table', () => (
  return class{
    finalCountries = [{ country: 'Belarus', population: 223 },
  { country: 'Poland', population: 447 }]
  }
);

describe('Mock test', () => {
  test('Table.sort', () => {
    const newTable = new Table('div', 'new-div', (() => {}));
    newTable.finalCountries = [{ country: 'Belarus', population: 223 },
      { country: 'Poland', population: 447 }];
    console.log(newTable.sortDataCountries());
  });
}); */

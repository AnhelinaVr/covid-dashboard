import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
/* eslint-disable camelcase */
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

class Chart {
  constructor(paramToSet) {
    this.graph = am4core.create('chartdiv', am4charts.XYChart);
    this.dataCountry = '';
    this.graphData = [];
    this.paramToSet = paramToSet;
    this.showByHundredThousand = false;
    this.dateAxis = this.graph.xAxes.push(new am4charts.DateAxis());
    this.valueAxis = this.graph.yAxes.push(new am4charts.ValueAxis());
    this.population = 0;
  }

  set setParam(paramToSet) {
    if (
      paramToSet !== 'cases'
      && paramToSet !== 'deaths'
      && paramToSet !== 'recovered'
    ) {
      throw new Error('Некорректный параметр графика (Случаи)');
    }
    this.paramToSet = paramToSet;
  }

  set showByThousand(param) {
    if (param !== true && param !== false) {
      throw new Error('Некорректный параметр графика (Отображения по 100к)');
    }
    this.showByHundredThousand = param;
  }

  get getParam() {
    return this.paramToSet;
  }

  set setCountry(Country) {
    this.dataCountry = Country;
  }

  setChartSettings() {
    am4core.useTheme(am4themes_animated);

    this.graph.hiddenState.properties.opacity = 0;
    this.graph.background.fill = am4core.color('#1e2128');
    this.graph.paddingRight = 20;
    this.graph.dataSource.updateCurrentData = true;
  }

  setGraphAxix() {
    this.valueAxis.tooltip.disabled = true;
    this.valueAxis.renderer.grid.template.stroke = am4core.color('#fff');
    this.valueAxis.renderer.labels.template.fill = am4core.color('#fff');

    this.dateAxis.renderer.labels.template.fill = am4core.color('#fff');
    this.dateAxis.tooltip.background.stroke = am4core.color('#ff8726');
    this.dateAxis.tooltip.background.fill = am4core.color('#ff8726');
    this.dateAxis.tooltip.label.fill = am4core.color('#fff');
    this.dateAxis.renderer.grid.template.stroke = am4core.color('#fff');
  }

  setChartCursor() {
    this.graph.cursor = new am4charts.XYCursor();
    this.graph.cursor.xAxis = this.dateAxis;
    this.graph.cursor.lineX.stroke = am4core.color('#ff8726');
  }

  setGraphSeries() {
    const series = this.graph.series.push(new am4charts.LineSeries());

    series.dataFields.dateX = 'date';
    series.dataFields.valueY = `${this.paramToSet}`;
    series.tooltipText = `${this.paramToSet}: {valueY.value}`;
    series.sequencedInterpolation = true;
    series.defaultState.transitionDuration = 1500;
    series.stroke = am4core.color('#ff8726');
    series.tensionX = 0.8;
  }

  pushData(dataObj, showBy100K, population) {
    for (let i = 0; i < dataObj.length; i += 1) {
      if (showBy100K) {
        this.graphData.push({
          date: Date.parse(dataObj[i].last_update),
          [this.paramToSet]: (
            (dataObj[i][`total_${this.paramToSet}`] / population)
            * 100000
          ).toFixed(2),
        });
      } else {
        this.graphData.push({
          date: Date.parse(dataObj[i].last_update),
          [this.paramToSet]: dataObj[i][`total_${this.paramToSet}`],
        });
      }
    }

    this.graph.data = this.graphData;
  }

  pushDataByCountry(dataObj, showBy100k, population) {
    for (let i = 0; i < dataObj.length; i += 1) {
      if (showBy100k) {
        this.graphData.push({
          date: Date.parse(dataObj[i].last_update),
          [this.paramToSet]: (
            (dataObj[i][`${this.paramToSet}`] / population)
            * 100000
          ).toFixed(2),
        });
      } else {
        this.graphData.push({
          date: Date.parse(dataObj[i].last_update),
          [this.paramToSet]: dataObj[i][`${this.paramToSet}`],
        });
      }
    }

    this.graph.data = this.graphData;
  }

  set setObjFromMain(data) {
    this.dataCountry = data.CountryCode;
    this.population = data.population;
  }

  async getData() {
    const DATA_COVID = await fetch(
      'https://covid19-api.org/api/timeline',
    ).then((result) => result.json());
    const DATA_COVID_BY_COUNTRY = await fetch(
      `https://covid19-api.org/api/timeline/${this.dataCountry}`,
    ).then((result) => result.json());
    const DATA_OF_COUNTRIES = await fetch(
      'https://restcountries.eu/rest/v2/all',
    ).then((result) => result.json());

    let worldPopulation = 0;
    for (let i = 0; i < DATA_OF_COUNTRIES.length; i += 1) {
      worldPopulation += DATA_OF_COUNTRIES[i].population;
    }

    for (let key; key < DATA_OF_COUNTRIES.length; key += 1) {
      if (DATA_OF_COUNTRIES[key].alpha2Code === this.dataCountry) {
        this.population = DATA_OF_COUNTRIES[key].population;
      }
    }

    if (this.dataCountry) {
      this.pushDataByCountry(
        DATA_COVID_BY_COUNTRY,
        this.showByHundredThousand,
        this.population,
      );
    } else {
      this.pushData(DATA_COVID, this.showByHundredThousand, worldPopulation);
    }
  }

  init() {
    this.setChartSettings();
    this.setGraphAxix();
    this.setGraphSeries();
    this.setChartCursor();
    this.getData();
  }
}

export default Chart;

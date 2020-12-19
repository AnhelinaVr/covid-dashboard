// https://www.youtube.com/watch?v=UlfacaW8634

import mapStyle from './map-style';
import getCountriesInfo from './getCountriesInfo';

function getPercentage(current, general) {
    return (current * 100) / general || 0;
}

function renderPopup(data) {
    let html = '';
    data.forEach((item) => {
        html += `<p> <strong> ${item} </strong> </p>`;
    });
    return (`
        <div>
          ${html}
        </div>
      `);
}

class CovidMap {
    constructor(mapContainer, legend) {
        this.mapContainer = mapContainer;
        this.map = this.initMap();
        this.markers = [];
        this.popup = new window.google.maps.InfoWindow();
        this.legend = legend;
        this.map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM]
            .push(this.legend);
    }

    initMap() {
        return new window.google.maps.Map(this.mapContainer, {
            center: {
                lat: 0,
                lng: 0,
            },
            zoom: 2,
            streetViewControl: false,
            mapTypeControl: false,
            styles: mapStyle,
        });
    }

    createLegend() {
        this.legend.innerHTML = '<h3>Legend</h3>';
        const div = document.createElement('div');
        div.innerHTML = `<img src="../../assets/circleRed.png"> - > 10% 
        <br>       <img src="../../assets/circleOrange.png"> - > 1% <br>   
        <img src="../../assets/circleYellow.png"> - < 1%`;
        this.legend.appendChild(div);
    }

    async renderData(tabName) {
        this.deleteMarkers();
        const data = await getCountriesInfo()
        const countries = data.countriesInfo;
        const general = data.globalInfo;
        console.log(countries);

        for (let i = 0; i < countries.length - 1; i += 1) {
            general.TotalConfirmed += countries[i].TotalConfirmed;
            general.TotalDeaths += countries[i].TotalDeaths;
            general.TotalRecovered += countries[i].TotalRecovered;
        }
        this.createLegend();

        countries.forEach((country) => {
            const icon = {
                url: '../../assets/circleYellow.png', // url
                scaledSize: new window.google.maps.Size(20, 20), // scaled size
            };
            let percent;
            let tabInfo;

            switch (tabName) {
                case 'totalCases':
                    percent = getPercentage(country.TotalConfirmed, general.TotalConfirmed);

                    tabInfo = country.TotalConfirmed;
                    if (percent >= 1 && percent < 10) icon.url = '../../assets/circleOrange.png';
                    else if (percent >= 10) icon.url = '../../assets/circleRed.png';
                    break;
                case 'totalRecovered':
                    percent = getPercentage(country.TotalRecovered, general.TotalRecovered);
                    tabInfo = country.TotalRecovered;
                    icon.url = '../../assets/circleOrange.png';
                    if (percent >= 1 && percent < 5) icon.url = '../../assets/circleYellow.png';
                    else if (percent >= 5) icon.url = '../../assets/circleGreen';
                    break;
                case 'totalDeaths':
                    percent = getPercentage(country.TotalDeaths, general.TotalDeaths);
                    tabInfo = country.TotalDeaths;
                    if (percent >= 1 && percent < 10) icon.url = '../../assets/circleOrange.png';
                    else if (percent >= 10) icon.url = '../../assets/circleRed.png';
                    break;
                case 'deathsToCases':
                    percent = getPercentage(country.TotalDeaths, country.TotalConfirmed);
                    tabInfo = `${percent.toFixed(3)} %`;
                    if (percent >= 1 && percent < 10) icon.url = '../../assets/circleOrange.png';
                    else if (percent >= 10) icon.url = '../../assets/circleRed.png';
                    break;
                case 'recoveredToCases':
                    percent = getPercentage(country.TotalRecovered, country.TotalConfirmed);
                    tabInfo = `${percent.toFixed(3)} %`;
                    if (percent >= 1 && percent < 10) icon.url = '../../assets/circleOrange.png';
                    else if (percent >= 10) icon.url = '../../assets/circleRed.png';
                    break;
                default:
                    break;
            }

            const marker = new window.google.maps.Marker({
                position: {
                    lat: country.latlng[0],
                    lng: country.latlng[1],
                },
                map: this.map,
                icon,
            });
            this.markers.push(marker);
            marker.addListener('mouseover', () => {
                this.popup.setContent(renderPopup([country.country, tabInfo]));
                this.popup.open(this.map, marker);
            });
            marker.addListener('mouseout', () => {
                this.popup.close();
            });
        });
    }

    async setCountry(latlng) {
        this.map.setCenter({ lat: latlng[0], lng: latlng[1] });
        this.map.setZoom(5);
    }

    // Deletes all markers in the array by removing references to them.
    deleteMarkers() {
        const { markers } = this;
        for (let i = 0; i < markers.length; i += 1) {
            markers[i].setMap(null);
        }
        markers.length = 0;
    }
}

export default CovidMap;
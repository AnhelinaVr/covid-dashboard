// https://www.youtube.com/watch?v=UlfacaW8634

import mapStyle from './map-style';

async function getData() {
  const covid = await fetch('https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/latest')
    .then((value) => value.json());
  const population = await fetch('https://restcountries.eu/rest/v2/all')
    .then((value) => value.json());
  return { covid, population };
}

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
  constructor(mapContainer) {
    this.mapContainer = mapContainer;
    this.map = this.initMap();
    this.markers = [];
    this.popup = new window.google.maps.InfoWindow();
  }

  initMap() {
    return new window.google.maps.Map(this.mapContainer, {
      center: {
        lat: 0,
        lng: 0,
      },
      zoom: 2,
      styles: mapStyle,
    });
  }

  async renderData() {
    this.deleteMarkers();
    const data = await getData();
    // const { population } = data;
    const countries = data.covid;
    let general = 0;
    for (let i = 0; i < countries.length - 1; i += 1) {
      general += countries[i].confirmed;
    }
    countries.forEach((country) => {
      const icon = {
        url: '../../assets/circleRed.png', // url
        scaledSize: new window.google.maps.Size(20, 20), // scaled size
      };
      const percent = getPercentage(country.confirmed, general);
      if (percent >= 1 && percent < 10) icon.url = '../../assets/circleOrange.png';
      else if (percent >= 10) icon.url = '../../assets/circleRed.png';
      const marker = new window.google.maps.Marker({
        position: {
          lat: country.location.lat,
          lng: country.location.lng,
        },
        map: this.map,
        icon,
        title: String(country.confirmed),
      });
      this.markers.push(marker);
      marker.addListener('mouseover', () => {
        this.popup.setContent(renderPopup([country.countryregion, country.confirmed]));
        this.popup.open(this.map, marker);
      });
      marker.addListener('mouseout', () => {
        this.popup.close();
      });
    });
  }

  setCountry() {
    setTimeout(() => {
      this.map.setCenter({ lat: 21, lng: 78 });
      this.map.setZoom(5);
    }, 10000);
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

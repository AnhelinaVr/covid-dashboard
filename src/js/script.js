import '../styles/main.scss';
import 'normalize.css';
import CovidMap from './map';

const map = new CovidMap(document.querySelector('#map'));
map.renderData();

map.setCountry(21, 78);

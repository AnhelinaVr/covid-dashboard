import '../styles/main.scss';
import 'normalize.css';
import CovidMap from './map';

const map = new CovidMap(document.querySelector('#map'),
  document.querySelector('#legend'));

const buttonsContainer = document.querySelector('.map-tabs');

map.renderData('totalCases');

buttonsContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('button-map--tab')) map.renderData(event.target.dataset.tabName);
});

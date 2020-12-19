import '../styles/main.scss';
import 'normalize.css';
import App from './App';

const app = new App();



// const map = new CovidMap(document.querySelector('#map'),
//   document.querySelector('#legend'));

// map.renderData('totalCases');

const buttonsContainer = document.querySelector('.map-tabs');
buttonsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('button-map--tab'))
        app.moduleMap.renderData(event.target.dataset.tabName);
});
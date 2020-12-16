import '../styles/main.scss';
import 'normalize.css';

import Table from './Table';

console.log('Hello!');

const table = new Table('table', '.module-table', 'module-table__table');

table.addTheadandTbody();
table.fetchCountries();
table.showCountries();
/* table.addRowToBodyTable(); */

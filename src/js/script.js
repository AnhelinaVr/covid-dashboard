import '../index.html';
import '../styles/main.scss';
import 'normalize.css';
import App from './App';
import './keyboard';

const app = new App();
app.getDatas().then(() => app.whendataready());

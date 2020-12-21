import '../styles/main.scss';
import 'normalize.css';

import App from './App';

const app = new App();
app.getDatas().then(() => app.whendataready());

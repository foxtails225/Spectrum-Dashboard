import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'nprogress/nprogress.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { enableES5 } from 'immer';
import * as serviceWorker from 'src/serviceWorker';
import App from 'src/App';

enableES5();

ReactDOM.render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
  document.getElementById('root')
);

serviceWorker.register();

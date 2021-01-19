import React from 'react';
import type { FC } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { create } from 'jss';
import { SnackbarProvider } from 'notistack';
import {
  jssPreset,
  StylesProvider,
} from '@material-ui/core';
import routes, { renderRoutes } from 'src/routes';
import { BASE_URL } from './constants';

const jss = create({ plugins: [...jssPreset().plugins] });
const history = createBrowserHistory();

const App: FC = () => {
  console.log(BASE_URL)
  return (
      <StylesProvider jss={jss}>
          <SnackbarProvider
            dense
            maxSnack={3}
          >
            <Router history={history}>
                {renderRoutes(routes)}
            </Router>
          </SnackbarProvider>
      </StylesProvider>
  );
};

export default App;

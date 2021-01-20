import React, { FC } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { create } from 'jss';
import { SnackbarProvider } from 'notistack';
import { jssPreset, StylesProvider } from '@material-ui/core';
import routes, { renderRoutes } from 'src/routes';

const jss = create({ plugins: [...jssPreset().plugins] });
const history = createBrowserHistory();

const App: FC = () => {
  return (
    <StylesProvider jss={jss}>
      <SnackbarProvider dense maxSnack={3}>
        <Router history={history}>{renderRoutes(routes)}</Router>
      </SnackbarProvider>
    </StylesProvider>
  );
};

export default App;

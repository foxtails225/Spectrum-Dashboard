import React, { FC } from 'react';
import { HashRouter } from 'react-router-dom';
import { create } from 'jss';
import { SnackbarProvider } from 'notistack';
import { jssPreset, StylesProvider } from '@material-ui/core';
import routes, { renderRoutes } from 'src/routes';

const jss = create({ plugins: [...jssPreset().plugins] });

const App: FC = () => {
  return (
    <StylesProvider jss={jss}>
      <SnackbarProvider dense maxSnack={3}>
        <HashRouter>{renderRoutes(routes)}</HashRouter>
      </SnackbarProvider>
    </StylesProvider>
  );
};

export default App;

import React, { Suspense, Fragment, lazy } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import HomeView from 'src/pages/home';
import LoadingScreen from 'src/components/LoadingScreen';

type Routes = {
  exact?: boolean;
  path?: string | string[];
  component?: any;
  routes?: Routes;
}[];

export const renderRoutes = (routes: Routes = []): JSX.Element => (
  <Suspense fallback={<LoadingScreen />}>
    <Switch>
      {routes.map((route, i) => {
        const Component = route.component;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={props => (
              <Fragment>
                {route.routes ? (
                  renderRoutes(route.routes)
                ) : (
                  <Component {...props} />
                )}
              </Fragment>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
);

const routes: Routes = [
  {
    exact: true,
    path: '/404',
    component: lazy(() => import('src/pages/errors/NotFoundView'))
  },
  {
    exact: true,
    path: '/maintenance',
    component: lazy(() => import('src/pages/maintenance'))
  },
  {
    exact: true,
    path: '/dark-lunar',
    component: lazy(() => import('src/pages/dashboard'))
  },
  {
    exact: true,
    path: '/',
    component: HomeView
  },
  {
    path: '*',
    routes: [
      {
        component: () => <Redirect to="/404" />
      }
    ]
  }
];

export default routes;

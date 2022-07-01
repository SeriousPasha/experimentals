import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import { DebouncedAsyncExecution } from './DebouncedAsyncExecution/DebouncedAsyncExecution';

export const App = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/deferred-calls" component={DebouncedAsyncExecution} />
        <Redirect to="/deferred-calls" />
      </Switch>
    </HashRouter>
  );
};

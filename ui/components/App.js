import React from 'react';

import {
  HashRouter,
  Switch,
  Route,
} from "react-router-dom"

import { Debug } from './debug/Debug';

import { LandingPage } from './LandingPage';
import { Login } from './login/Login';

import { Navbar } from './layout/Navbar';

import { UploadForm } from './UploadForm';

import { AppContext } from './AppContext';

export function App() {
  const ctx = React.useContext(AppContext);

  return (
    <div data-test-id='App-root'>
      <Switch>
        <Route path="/" exact>
          <LandingPage />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/upload" exact>
          <Navbar />
          <UploadForm onUpload={ctx.uploadTrack} />
        </Route>
        <Debug />
      </Switch>
    </div>
  );
}

export function DefaultApp() {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  );
}

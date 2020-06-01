import React from 'react';

import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
} from "react-router-dom"

import { Debug } from './debug/Debug';

import { LandingPage } from './LandingPage';
import { Login } from './login/Login';

import { Navbar } from './layout/Navbar';

import { UploadForm } from './UploadForm';

import { AppContext } from './AppContext';

import {
  Auth0Provider,
} from './login/Auth0Context';

const Logout = () => {
  return (
    <h1>logged out</h1>
  );
};

export function FullscreenCenterHero({ children }) {
  return (
    <section className="hero is-link is-fullheight">
      <div className="hero-body has-text-centered">
        <div className="container">
          {children}
        </div>
      </div>
    </section>
  );
}

export function Loading() {
  return (
    <FullscreenCenterHero>
      <div className='icon'>
        <div className="fa-3x">
          <i className="fas fa-id-badge"></i>
        </div>
      </div>
    </FullscreenCenterHero>
  );
}

export function App() {
  const ctx = React.useContext(AppContext);

  return (
    <div data-test-id='App-root'>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/home" />
        </Route>
        <Route path="/start" exact>
          <LandingPage />
        </Route>
        <Route path="/home" exact>
          <LandingPage />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/logout" exact>
          <Redirect to="/login" />
        </Route>
        <Route path="/upload" exact>
          <Navbar />
          <UploadForm onUpload={ctx.uploadTrack} />
        </Route>
        <Debug />
        <Route render={() => <Redirect to="/home" />} />
      </Switch>
    </div>
  );
}

export function DefaultApp() {
  // FIXME - global
  const RouterBasename = window.Prestissimo.RouterBasename;

  // FIXME
  const config = {
    "domain": "alexjpaz.auth0.com",
    "clientId": "dZrsXB0I87NK4J238ia2Z7znHKp5M33w"
  };

  const onRedirectCallback = appState => {
    console.log(appState);
    //history.push(
      //appState && appState.targetUrl
      //? appState.targetUrl
      //: window.location.pathname
    //);
  };

  return (
    <Router basename={RouterBasename}>
      <Auth0Provider
        domain={config.domain}
        client_id={config.clientId}
        redirect_uri={[RouterBasename, '/login'].join('')}
        onRedirectCallback={onRedirectCallback}
      >
      <App />
      </Auth0Provider>
    </Router>
  );
}

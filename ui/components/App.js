import React from 'react';

import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
} from "react-router-dom"

import { Transactions } from './transactions/Transactions';
import { Dashboard } from './dashboard/Dashboard';
import { Debug } from './debug/Debug';

import { LandingPage } from './LandingPage';
import { Login } from './login/Login';

import { Navbar } from './layout/Navbar';

import { Upload } from './upload/Upload';

import { AppContext, DefaultAppContextProvider } from './AppContext';

import {
  useAuth0,
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

export function Start() {
  const { isAuthenticated } = useAuth0();

  if(isAuthenticated) {
    return <Redirect to="/home" />
  } else {
    return <Redirect to="/login" />
  }
}

export function App() {
  const auth0 = useAuth0();
  const ctx = React.useContext(AppContext);

  return (
    <div data-test-id='App-root'>
      <Switch>
        <Route path="/login" />
        <Route path="/start" />
        <Route render={() => <Navbar />} />
      </Switch>
      <Switch>
        <Route path="/start" exact>
          <Start />
        </Route>
        <Route path="/home" exact>
          <Redirect to="/dashboard" />
        </Route >
        <Route path="/dashboard" exact>
          <Dashboard />
        </Route>
        <Route path="/transactions/:transactionId">
          <Transactions />
        </Route>
        <Route path="/about" exact>
          <LandingPage />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/logout" exact>
          <Redirect to="/login" />
        </Route>
        <Route path="/upload" exact>
          <Upload />
        </Route>
        <Debug />
        <Route render={() => <Redirect to="/start" />} />
      </Switch>
    </div>
  );
}

export function DefaultApp() {
  // FIXME - global
  const RouterBasename = window.Prestissimo.RouterBasename;

  // IMPORTANT: Must be a full url!
  const redirect_uri = [window.location.origin, RouterBasename, '/login'].join('');

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
      <DefaultAppContextProvider>
        <Auth0Provider
        domain={config.domain}
        client_id={config.clientId}
        redirect_uri={redirect_uri}
        onRedirectCallback={onRedirectCallback}
      >
          <App />
        </Auth0Provider>
      </DefaultAppContextProvider>
    </Router>
  );
}

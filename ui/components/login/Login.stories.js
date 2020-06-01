import React from 'react';

import { Login } from './Login';

import { Auth0Provider } from './Auth0Context';

// FIXME
const config = {
  "domain": "alexjpaz.auth0.com",
  "clientId": "dZrsXB0I87NK4J238ia2Z7znHKp5M33w"
}

export default {
  title: "Login",
};

export const withDefault = () => {
  const onRedirectCallback = appState => {
    history.push(
      appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
    );
  };


  return (
    <Auth0Provider
      domain={config.domain}
      client_id={config.clientId}
      redirect_uri={window.location.href}
      onRedirectCallback={onRedirectCallback}
    >
      <Login />
    </Auth0Provider>
  );
};



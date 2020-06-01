import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom"

import { useAuth0 } from './Auth0Context';

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

export function Login() {
  const { isAuthenticated, loginWithRedirect, logout, loading } = useAuth0();

  if(loading) {
    return <Loading />
  }

  if(!isAuthenticated) {

  }

  if(isAuthenticated) {
    return (
      <Redirect to="/foobar" />
    );
  }

  return (
    <section className="hero is-dark is-fullheight">
      <div className="hero-body">
        <div className="container has-text-centered">
          <p className="title is-size-1">
            <button className='button is-large' onClick={() => loginWithRedirect({})}>Log in</button>
          </p>
        </div>
      </div>
    </section>
  );
}

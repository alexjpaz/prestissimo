import React from 'react';
import { Switch, Route, Redirect, Link } from "react-router-dom"

import { useAuth0 } from './Auth0Context';

import { Branding } from '../branding/Branding';

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
      <Redirect to="/home" />
    );
  }

  return (
    <section className="hero is-link is-fullheight">
      <div className="hero-body">
        <div className="container has-text-centered">
          <p className="title is-size-1">
            <Branding />
          </p>
          <p className="subtitle">
            <span>Play as fast as possible</span>
          </p>
          <button className="button is-large is-warning" onClick={() => loginWithRedirect({})}>
            <span className='icon'>
              <i className='fas fa-play'></i>
            </span>
            <span>Login</span>
          </button>
        </div>
      </div>
    </section>
  );
}

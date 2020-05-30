import React from 'react';
import { Switch, Route } from "react-router-dom"

import { useAuth0 } from './Auth0Context';

export function Login() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  if(isAuthenticated) {
    alert('do a thing');
  }

  return (
    <section className="hero is-dark is-fullheight-with-navbar">
      <div className="hero-body">
        <div className="container has-text-centered">
          <p className="title is-size-1">
            //<button onClick={() => loginWithRedirect({})}>Log in</button>
          </p>
        </div>
      </div>
    </section>
  );
}

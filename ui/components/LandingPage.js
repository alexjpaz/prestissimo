import React from 'react';

import { Link } from "react-router-dom"

import { Branding } from './branding/Branding';

export function LandingPage() {
  return (
    <section className="hero is-link is-fullheight-with-navbar">
      <div className="hero-body">
        <div className="container has-text-centered">
          <p className="title is-size-1">
            <Branding />
          </p>
          <p className="subtitle">
            <span>Going as fast as possible</span>
          </p>
          <Link to='/login' className="button is-large is-warning">
            <span className='icon'>
              <i className='fas fa-play-circle'></i>
            </span>
            <span>Get Started</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

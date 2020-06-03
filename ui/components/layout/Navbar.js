import React from 'react';

import { Link } from 'react-router-dom';

import { useAuth0 } from '../login/Auth0Context';
import { AppContext } from '../AppContext';
import { Branding } from '../branding/Branding';

export function LogoutButton() {
  const auth0 = useAuth0();

  const logout = (e) => {
    auth0.logout();
  };

  return (
    <span className="navbar-item">
      <button className='button is-info' onClick={logout}>Logout</button>
    </span>
  );
}

export function NavbarProfile() {
  const auth0 = useAuth0();

  if(!auth0.user) {
    return (
      null
    );
  }

  let {
    picture,
    name
  } = auth0.user;

  return (
    <span className="navbar-item" href="#">
      <Link to="/profile" className="button is-inverted is-rounded">
        <span>{name} </span>
        <figure className="image is-32x32">
          <img src={picture} className='is-rounded' />
        </figure>
      </Link>
    </span>
  );
}

export function Navbar() {
  const ctx = React.useContext(AppContext);

  return (
    <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item is-size-4" href="/">
          <Branding />
        </a>

        <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div className='navbar-menu'>
        <div className="navbar-end">
          <NavbarProfile />
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}

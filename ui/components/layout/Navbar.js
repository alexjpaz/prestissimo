import React from 'react';

import { AppContext } from '../AppContext';
import { Branding } from '../branding/Branding';

export function NavbarProfile() {
  const ctx = React.useContext(AppContext);

  console.log(ctx.user.photo);

  return (
    <a class="navbar-item" href="#">
      <span>{ctx.user.name} </span>
      <img src={ctx.user.photo} height='32' width='32' />
    </a>
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
          <div className="navbar-item">
            <NavbarProfile />
          </div>
        </div>
      </div>
    </nav>
  );
}

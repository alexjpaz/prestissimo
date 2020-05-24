import React from 'react';

import { AppContext } from '../AppContext';

export function Navbar() {
  const ctx = React.useContext(AppContext);

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
            <span className="icon">
              <i className='fas fa-music'> </i>
            </span>
            <span>prestissimo</span>
        </a>

        <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
    </nav>
  );
}

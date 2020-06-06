import React from 'react';

import { Link } from 'react-router-dom';

import { useAuth0 } from '../login/Auth0Context';
import { AppContext } from '../AppContext';
import { Branding } from '../branding/Branding';

const navbarImgHeightFix = {
  maxHeight: 'none',
};

export function RoundProfileImage({ picture }) {
  return (
    <figure className="image is-square">
      <img src={picture}
        className='is-rounded'
        alt="Profile image"
        style={navbarImgHeightFix} />
    </figure>
  );
}

export function LogoutButton() {
  const auth0 = useAuth0();

  const logout = (e) => {
    auth0.logout();
  };

  return (
    <div className="dropdown-item" >
      <button className='button is-info is-outlined is-fullwidth' onClick={logout}>Logout</button>
    </div>
  );
}

export function ProfileDropdownItem() {
  const auth0 = useAuth0();

  console.log(auth0.user);

  let {
    picture,
    name,
    email,
    nickname,
  } = auth0.user;

  return (
    <div className="dropdown-item">
      <div className="media">
          <div className="media-content">
          <RoundProfileImage picture={picture} />
            <p className="title is-4 has-text-centered">{nickname || name}</p>
            <p className="subtitle is-6">{email}</p>
          </div>
      </div>
    </div>
  );
}

export function NavbarProfile() {
  const dropdownRef = React.useRef();
  const [ dropdownIsVisible, setDropdownIsVisible ] = React.useState(false);

  const toggleDropdown = (e) => {
    e.stopPropagation();

    setDropdownIsVisible(!dropdownIsVisible);
  };

  React.useEffect(() => {
    const listener = event => {
      // Do nothing if clicking ref's element or descendent elements
      if (!dropdownRef.current || dropdownRef.current.contains(event.target)) {
        return;
      }

      setDropdownIsVisible(false);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ dropdownRef ]);

  const auth0 = useAuth0();

  if(!auth0.user) {
    return (
      <span className="navbar-item" href="#">
        <span className="icon">
          <i className="fas fa-spinner fa-pulse fa-2x"></i>
        </span>
      </span>
    );
  }

  let {
    picture,
    name
  } = auth0.user;

  return (
    <span className="navbar-item" href="#">
      <div className={`dropdown ${dropdownIsVisible ? 'is-active' : ''} is-right`}>
        <div className="dropdown-trigger" onClick={toggleDropdown}>
          <figure className="image is-32x32">
            <img src={picture} className='is-rounded' style={navbarImgHeightFix} />
          </figure>
        </div>
        <div className="dropdown-menu" ref={dropdownRef}>
          <div className="dropdown-content">
            <ProfileDropdownItem />
            <hr className="dropdown-divider" />
            <Link to="/upload" className="dropdown-item">Upload Track</Link>
            <hr className="dropdown-divider" />
            <LogoutButton />
          </div>
        </div>
      </div>
    </span>
  );
}

export function Navbar() {
  const ctx = React.useContext(AppContext);

  return (
    <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-item is-size-4" to="/home">
          <Branding />
        </Link>

        <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div className='navbar-menu'>
        <div className="navbar-end">
          <div className='navbar-item'>
            <Link className='button is-primary is-small' to='/upload'>Upload Track</Link>
          </div>
          <NavbarProfile />
        </div>
      </div>
    </nav>
  );
}

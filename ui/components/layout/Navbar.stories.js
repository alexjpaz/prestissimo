import React from 'react';

import { MemoryRouter } from "react-router-dom"

import { Navbar } from './Navbar';
import { Auth0Context } from '../login/Auth0Context';

export default {
  title: "Navbar",
};

export const withAuthentication = () => {
  let auth0 = {
    user: {
      name: "Fake User",
      picture: "https://api.adorable.io/avatars/156/fake@fake.com.png"
    }
  };

  return (
    <MemoryRouter>
      <Auth0Context.Provider value={auth0}>
        <Navbar />
      </Auth0Context.Provider>
    </MemoryRouter>
  );
};

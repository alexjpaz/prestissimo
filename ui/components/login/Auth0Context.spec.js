import React from "react";
import { act } from "react-dom/test-utils";

import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import createAuth0Client from "@auth0/auth0-spa-js";

jest.mock("@auth0/auth0-spa-js");

import { useAuth0, Auth0Provider } from './Auth0Context';

let config = {
  domain: "https://fake.auth0.domain",
  clientId: "fakeClientId",
};

let redirect_uri = "http://full.url:port/login";

const Debug = () => {
  const ctx = useAuth0();

  return (
    <pre data-testid='debug' data={ctx}>{JSON.stringify(ctx)}</pre>
  );
};

describe('Authenticated flow', () => {
  it('typical', async () => {
    let auth0Client = {
      isAuthenticated: jest.fn(() => true),
      getUser: jest.fn(() => ({
        name: "Fake",
        nickname: "fake",
        email: "fake@fake.com",
        sub: "auth0|fake",
      })),
      getTokenSilently: jest.fn(() => {}),
    };

    const onRedirectCallback = jest.fn();

    createAuth0Client.mockImplementation(() => {
      return auth0Client;
    });

    let getByTestId;

    await act(async () => {
      ({ getByTestId } = render(
        <Auth0Provider
        domain={config.domain}
        client_id={config.clientId}
        redirect_uri={redirect_uri}
        onRedirectCallback={onRedirectCallback}
      >
          <Debug />
        </Auth0Provider>
      ));
    });

    expect(auth0Client.isAuthenticated).toHaveBeenCalled();
    expect(auth0Client.getUser).toHaveBeenCalled();

    const container = getByTestId("debug");

    let data = JSON.parse(container.innerHTML);

    expect(data).toEqual(expect.objectContaining({
      isAuthenticated: true,
      user: expect.objectContaining({
        name: "Fake"
      })
    }));
  });
});

describe('Unauthenticated flow', () => {
  it('landing without creds', async () => {
    let auth0Client = {
      isAuthenticated: jest.fn(() => false),
      getUser: jest.fn(() => ({
        name: "Fake",
        nickname: "fake",
        email: "fake@fake.com",
        sub: "auth0|fake",
      }))
    };

    const onRedirectCallback = jest.fn();

    createAuth0Client.mockImplementation(() => {
      return auth0Client;
    });

    let getByTestId;

    await act(async () => {
      ({ getByTestId } = render(
        <Auth0Provider
        domain={config.domain}
        client_id={config.clientId}
        redirect_uri={redirect_uri}
        onRedirectCallback={onRedirectCallback}
      >
          <Debug />
        </Auth0Provider>
      ));
    });

    expect(auth0Client.isAuthenticated).toHaveBeenCalled();

    const container = getByTestId("debug");

    let data = JSON.parse(container.innerHTML);

    expect(data).toEqual(expect.objectContaining({
      isAuthenticated: false,
    }));
  });

  it('landing with code + state ', async () => {
    let auth0Client = {
      isAuthenticated: jest.fn(() => false),
      handleRedirectCallback: jest.fn(() => {
        return {
          // This is what comes back :shrug:
          appState: undefined,
        }
      }),
      getUser: jest.fn(() => ({
        name: "Fake",
        nickname: "fake",
        email: "fake@fake.com",
        sub: "auth0|fake",
      }))
    };

    let _window = {
      location: {
        search: "?code=CODE&state=STATE",
      }
    };

    const onRedirectCallback = jest.fn();

    createAuth0Client.mockImplementation(() => {
      return auth0Client;
    });

    let getByTestId;

    await act(async () => {
      ({ getByTestId } = render(
        <Auth0Provider
        _window={_window}
        domain={config.domain}
        client_id={config.clientId}
        redirect_uri={redirect_uri}
        onRedirectCallback={onRedirectCallback}
      >
          <Debug />
        </Auth0Provider>
      ));
    });

    expect(auth0Client.isAuthenticated).toHaveBeenCalled();
    expect(auth0Client.handleRedirectCallback).toHaveBeenCalled();
    expect(onRedirectCallback).toHaveBeenCalled();

    const container = getByTestId("debug");

    let data = JSON.parse(container.innerHTML);

    expect(data).toEqual(expect.objectContaining({
      isAuthenticated: false,
    }));
  });

});


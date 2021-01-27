import React from "react";

import { Route } from "react-router-dom";

import { useAuth0 } from '../login/Auth0Context';

import { PrestissimoApi } from '../../helpers/PrestissimoApi';

import * as axios from 'axios';

export function Debug({ api = PrestissimoApi.standard() }) {
  const auth0 = useAuth0();

  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    (function () {
      api.ping()
        .then(d => setData(d));
    })();
  }, []);

  //TODO
  return (
    <Route path="/debug" exact>
      <div data-test-id="App-debug">
        <section className="hero is-warning is-fullheight-with-navbar">
          <div className="hero-body">
            <div className="container has-text-centered">
              <p className="title is-size-1">
                debug
              </p>
              <pre className="subtitle has-text-left">
                {JSON.stringify(data, null, 2)}
              </pre>
              <pre className="subtitle has-text-left">
                1
                {JSON.stringify(auth0, null, 2)}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </Route>
  );
}

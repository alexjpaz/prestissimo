import React from "react";

import { Route } from "react-router-dom";

import { PrestissimoApi } from '../../helpers/PrestissimoApi';

import * as axios from 'axios';

const usePing = () => {};

export function Debug({ api = PrestissimoApi.standard() }) {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    (function () {
      api.ping()
        .then(d => setData(d));
      //fetch("http://localhost:3000/local/ping")
        //.then((r) => r.json())
        //.then((r) => setData(r));
    })();
  }, []);

  //TODO
  return (
    <Route path="/debug" exact>
      <div data-test-id="App-debug" class>
        <section className="hero is-warning is-fullheight-with-navbar">
          <div className="hero-body">
            <div className="container has-text-centered">
              <p className="title is-size-1">
                <h1>debug</h1>
              </p>
              <p className="subtitle">
                <pre className="has-text-left">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </p>
            </div>
          </div>
        </section>
      </div>
    </Route>
  );
}

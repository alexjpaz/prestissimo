import React from 'react';

import { PrestissimoApi } from '../helpers/PrestissimoApi';

const NOT_IMPLEMENTED = () => {
  throw new Error("NOT_IMPLEMENTED");
};

const defaultContext = () => {
  let api = PrestissimoApi.standard();

  return {
    user: {
      name: "test@test.com",
      nickname: "test",
      photo: "http://tinygraphs.com/squares/tinygraphs?theme=frogideas&numcolors=4&size=500&fmt=png"
    },
    fetchTransactions: async (p) => await api.fetchTransactions(p),
    fetchTransaction: async (p) => await api.fetchTransaction(p),

    uploadTrack: () => alert("NOT IMPLEMENTED")
  };
};

export const defaultContextValue = defaultContext();

export const AppContext = React.createContext(defaultContextValue);

export class DefaultAppContextProvider extends React.Component {
  componentDidMount() {
    let state = this.state || defaultContextValue;

    // TODO
    state.uploadTrack = async (manifest) => {
      try {
        const endpoint = "http://localhost:3000/local";

        this.setState({
          ...state,
          progress: "0",
          uploadThing: {
            item: {
              status: "PREPARING",
            },
          },
        });



        let rsp = await fetch(`${endpoint}/api/transactions`, {
          method: "PUT",
        })
          .then(r => r.json());

        let { upload } = rsp.data;

        manifest.userId = rsp.data.userId;
        manifest.transactionId = rsp.data.transactionId;

        this.setState({
          ...state,
          progress: "25",
          uploadThing: {
            item: {
              status: "UPLOADING",
            },
          },
        });

        await fetch(upload.url, {
          method: upload.httpMethod,
          body: JSON.stringify(manifest),
        });

        this.setState({
          ...state,
          progress: "50",
          uploadThing: {
            item: {
              status: "CREATED",
            },
          },
        });

        // FIXME - Bad
        // Exponential backoff
        let MAX_RETRIES = 20;
        let MAX_TIMEOUT = 4000;
        let timeout;
        let retries = 0;

        let that = this;

        (async function check() {
          let transactionStatus = await fetch(`${endpoint}/api/transactions/${rsp.data.transactionId}`)
            .then(r => r.json());

          that.setState({
            ...state,
            progress: 75 + retries + "",
            uploadThing: transactionStatus.data,
          });

          let terminalStates = [
            'SUCCESS',
            'ERROR',
          ];

          if(retries >= MAX_RETRIES) {
            throw new Error("Retry limit reached!");
          }

          if(!terminalStates.includes(transactionStatus.data.item.status)) {
            retries++;
            timeout = Math.min(MAX_TIMEOUT, Math.pow(2, retries) * 500);

            console.log(timeout);

            setTimeout(check, timeout);
          } else {
            that.setState({
              ...state,
              progress: "100",
            });
          }
        })();
      } catch(e) {
        console.error(e);
        throw e;
      }
    };

    this.setState(state);
  }

  render() {
    const state = this.state;

    if(!state) {
      return (
        null
      );
    }

    return (
      <AppContext.Provider value={state}>
        {this.props.children}
      </AppContext.Provider>
    )
  }
}

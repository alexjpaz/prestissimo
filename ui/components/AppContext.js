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
    testPost: NOT_IMPLEMENTED
  };
};

export const defaultContextValue = defaultContext();

export const AppContext = React.createContext(defaultContextValue);

export class DefaultAppContextProvider extends React.Component {
  componentDidMount() {
    let state = this.state || defaultContextValue;

    //state.uploadTrack = () => {
      //console.log(123);
    //};

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

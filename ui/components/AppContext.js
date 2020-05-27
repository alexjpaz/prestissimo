import React from 'react';

const NOT_IMPLEMENTED = () => {
  throw new Error("NOT_IMPLEMENTED");
};

const defaultContext = () => {
  return {
    user: {
      name: "Alex"
    },
    testPost: NOT_IMPLEMENTED
  }
};

const defaultContextValue = defaultContext();

export const AppContext = React.createContext(defaultContext());

export class DefaultAppContextProvider extends React.Component {
  componentDidMount() {
    let state = this.state || defaultContextValue();

    this.setState(state);
  }

  render() {
    const state = this.state;

    return (
      <AppContext.Provider value={state}>
        {this.props.children}
      </AppContext.Provider>
    )
  }
}

import React from 'react';

const NOT_IMPLEMENTED = () => {
  throw new Error("NOT_IMPLEMENTED");
};

const defaultContext = () => {
  return {
    user: {
      name: "test@test.com",
      nickname: "test",
      photo: "http://tinygraphs.com/squares/tinygraphs?theme=frogideas&numcolors=4&size=500&fmt=png"
    },
    testPost: NOT_IMPLEMENTED
  }
};

export const defaultContextValue = defaultContext();

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

import AppNavigators from './navigator/AppNavigators';
import {Provider} from 'react-redux';
import React, {Component} from 'react';
import store from './store';

console.disableYellowBox = true;

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavigators />
      </Provider>
    );
  }
}

export default App;

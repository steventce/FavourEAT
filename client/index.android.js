import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';

import configureStore from './src/config/configureStore.js';

import Login from './src/scenes/Login';
import { UserEvents as Home } from './src/scenes/Events';

const store = configureStore();

const Navigation = StackNavigator({
  Login: { screen: Login },
  Home: { screen: Home }
});

class FavourEAT extends Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
  }  
}

AppRegistry.registerComponent('FavourEAT', () => FavourEAT);

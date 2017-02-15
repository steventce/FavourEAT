import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { AppRegistry } from 'react-native';

import Login from './src/scenes/Login';
import { UserEvents as Home } from './src/scenes/Events';

const FavourEAT = StackNavigator({
  Login: { screen: Login },
  Home: { screen: Home }
});

AppRegistry.registerComponent('FavourEAT', () => FavourEAT);

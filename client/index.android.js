import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { AppRegistry } from 'react-native';

import Login from './src/scenes/Login';
import { UserEvents as Home } from './src/scenes/Events';
import Swipe from './src/scenes/Swipe';

const FavourEAT = StackNavigator({
  Login: { screen: Login },
  Home: { screen: Home },
  Swipe: { screen: Swipe }
});

AppRegistry.registerComponent('FavourEAT', () => FavourEAT);

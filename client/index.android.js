import React, { Component } from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';

import configureStore from './src/config/configureStore.js';

import Login from './src/scenes/Login';
import Drawer from './src/scenes/Drawer';
import { UserEvents } from './src/scenes/Events';
import Preferences from './src/scenes/Events/Preferences';
import Winner from './src/scenes/Events/Winner';
import Swipe from './src/scenes/Swipe';
import CreateEvent from './src/scenes/Events/CreateEvent';
import Tournament from './src/scenes/Tournament';
import RestaurantDetails from './src/scenes/RestaurantDetails';

const store = configureStore();

const HomeStack = StackNavigator({
  CreateEvent: { screen: CreateEvent },
  UserEvents: { screen: UserEvents },
  Preferences: { screen: Preferences },
  Tournament: { screen: Tournament }
}, {
  initialRouteName: 'UserEvents'
});

const HomeDrawer = DrawerNavigator({
  Home: { screen: HomeStack },
  CreateEvent: { screen: CreateEvent },
  Preferences: { screen: Preferences },
  Swipe: { screen: Swipe },
}, {
  initialRouteName: 'Home',
  drawerWidth: 300,
  contentComponent: Drawer
});

const MainStack = StackNavigator({
  Login: { screen: Login },
  HomeDrawer: { screen: HomeDrawer },
  RestaurantDetails: { screen: RestaurantDetails },
  Winner: { screen: Winner },
}, {
  initialRouteName: 'Login',
  backBehavior: 'none',
  navigationOptions: {
    header: {
      visible: false
    }
  }
});

class FavourEAT extends Component {
  render() {
    return (
      <Provider store={store}>
        <MainStack />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('FavourEAT', () => FavourEAT);

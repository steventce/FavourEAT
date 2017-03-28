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
import JoinEvent from './src/scenes/Events/JoinEvent';
import Swipe from './src/scenes/Swipe';
import CreateEvent from './src/scenes/Events/CreateEvent';
import Tournament from './src/scenes/Tournament';
import RestaurantDetails from './src/scenes/RestaurantDetails';
import EventDetails from './src/scenes/Events/EventDetails';
import Map from './src/scenes/Map';

const store = configureStore();

const HomeDrawer = DrawerNavigator({
  Home: { screen: UserEvents }
}, {
  initialRouteName: 'Home',
  drawerWidth: 300,
  contentComponent: Drawer
});

const MainStack = StackNavigator({
  Login: { screen: Login },
  HomeDrawer: { screen: HomeDrawer, navigationOptions: { header: { visible: false } } },
  CreateEvent: { screen: CreateEvent },
  JoinEvent: { screen: JoinEvent },
  RestaurantDetails: { screen: RestaurantDetails },
  Preferences: { screen: Preferences },
  Swipe: { screen: Swipe },
  Tournament: { screen: Tournament },
  Winner: { screen: Winner },
  EventDetails: { screen: EventDetails },
  Map: { screen: Map }
}, {
  initialRouteName: 'Login'
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

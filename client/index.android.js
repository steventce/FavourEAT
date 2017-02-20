import React, { Component } from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';

import configureStore from './src/config/configureStore.js';

import Login from './src/scenes/Login';
import Drawer from './src/scenes/Drawer';
import { UserEvents } from './src/scenes/Events';
import Preferences from './src/scenes/Events/Preferences';

const store = configureStore();

const PreferencesStack = StackNavigator({
  Preferences: { screen: Preferences }
}, {
  initialRouteName: 'Preferences'
});

const HomeStack = StackNavigator({
  UserEvents: { screen: UserEvents }
}, {
  initialRouteName: 'UserEvents'
});

const HomeDrawer = DrawerNavigator({
  Home: { screen: HomeStack },
  Preferences: { screen: Preferences }
}, {
  initialRouteName: 'Home',
  drawerWidth: 300,
  contentComponent: Drawer
});

const MainStack = StackNavigator({
  Login: { screen: Login },
  HomeDrawer: { screen: HomeDrawer }
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

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';

import store from './src/config/configureStore.js';

import App from './src/scenes/App';
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

import { login, simpleLogout, grantTypes } from './src/reducers/Login/actions';
import moment from 'moment';

const HomeDrawer = DrawerNavigator({
  Home: { screen: UserEvents }
}, {
  initialRouteName: 'Home',
  drawerWidth: 300,
  contentComponent: Drawer
});

export const MainStack = StackNavigator({
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
        <App />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('FavourEAT', () => FavourEAT);

// Overrides

// Global fetch as interceptor
globalFetch = fetch;
fetch = (function(globalFetch) {
  return function fetchInterceptor() {
    const state = store.getState();
    const { access_token, user_id, expires_on, refresh_token, isLoggedIn } = state.auth.token;

    if (moment().add(1, 'h').isAfter(moment(expires_on))) {
      return store
        .dispatch(login(refresh_token, grantTypes.REFRESH))
        .then(() => {
          if (arguments.length === 2) {
            const newAccessToken = store.getState().auth.token.access_token;
            arguments[1].headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return globalFetch
            .apply(this, arguments)
            .then((response) => {
              return response;
            });
        });
    } else {
      return globalFetch
        .apply(this, arguments)
        .then((response) => {
          if (response.status === 401) {
            store.dispatch(simpleLogout());
          }
          return response;
        });
    }
  }
})(fetch);

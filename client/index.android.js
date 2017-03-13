import React, { Component } from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType
} from 'react-native-fcm';

import configureStore from './src/config/configureStore.js';

import Login from './src/scenes/Login';
import Drawer from './src/scenes/Drawer';
import { UserEvents } from './src/scenes/Events';
import Preferences from './src/scenes/Events/Preferences';
import Winner from './src/scenes/Events/Winner';
import Swipe from './src/scenes/Swipe';
import Tournament from './src/scenes/Tournament';
import RestaurantDetails from './src/scenes/RestaurantDetails';

const store = configureStore();

const HomeStack = StackNavigator({
  UserEvents: { screen: UserEvents },
  Preferences: { screen: Preferences },
  Tournament: { screen: Tournament }
}, {
  initialRouteName: 'UserEvents'
});

const HomeDrawer = DrawerNavigator({
  Home: { screen: HomeStack },
  Swipe: { screen: Swipe }
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
  componentDidMount() {
    FCM.getFCMToken().then((token) => {
      // TODO: Store FCM token on server
    });
    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
      // notif.notification -> notification payload, notif.data -> data payload
      if (notif.local_notification) {
        // local notification
      }
      if (notif.opened_from_tray) {
        // app is open/resumed because user clicked banner
      }

      // await someAsyncCall();
    });
    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
      // FCM token may not be available on first load, catch
    });
  }

  componentWillUnmount() {
    this.notificationListener.remove();
    this.refreshTokenListener.remove();
  }

  render() {
    return (
      <Provider store={store}>
        <MainStack />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('FavourEAT', () => FavourEAT);

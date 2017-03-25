import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, AsyncStorage } from 'react-native';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType
} from 'react-native-fcm';

import { login, saveFcmToken, setToken } from '../../reducers/Login/actions';
import Login from './Login';

class LoginContainer extends Component {
  static navigationOptions = { header: { visible: false } }

  handleFacebookLogin() {
    LoginManager.logInWithReadPermissions(['public_profile']).then((result) => {
      if (!result.isCancelled) {
        AccessToken.getCurrentAccessToken().then((data) => {
          const accessToken = data.accessToken.toString();
          this.props.dispatch(login(accessToken));
        });
      }
    },
    (error) => {
      Alert.alert('Error', `Loading Error - ${error}. Please login again.`);
    });
  }

  handleFCMInit(accessToken, userId) {
    FCM.getFCMToken().then((fcmToken) => {
      this.props.dispatch(saveFcmToken(accessToken, userId, fcmToken));
    });
    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
      if (notif.local_notification) {
        return;
      }
      if (notif.opened_from_tray) {
        return;
      }
    });
    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (fcmToken) => {
      this.props.dispatch(saveFcmToken(accessToken, userId, fcmToken));
    });
  }

  componentWillReceiveProps(nextProps) {
    const { navigate } = this.props.navigation;
    const { status, msg, token } = nextProps;

    // If the user logins into the app successfully
    if (status === 'success') {
      this.handleFCMInit(token.access_token, token.user_id);
      navigate('HomeDrawer');
    }
  }

  componentDidMount() {
    this.loadInitialState.bind(this)().done();
  }

  loadInitialState = async() => {
    const { navigate } = this.props.navigation;
    try {
      const tokenStr = await AsyncStorage.getItem('token');
      if (tokenStr) {
        const token = JSON.parse(tokenStr);
        const userId = token.user_id;
        const accessToken = token.access_token;

        // Add the auth info back into the store
        this.props.dispatch(setToken(token));
        this.handleFCMInit(accessToken, userId);
        navigate('HomeDrawer');
      }
    } catch (error) {
      Alert.alert('Error', `Loading Error - ${error}. Please login again.`);
    }
  }

  componentWillUnmount() {
    this.notificationListener.remove();
    this.refreshTokenListener.remove();
  }

  render() {
    return (
      <Login handleFacebookLogin={this.handleFacebookLogin.bind(this)} />
    );
  }
}

const mapStateToProps = function(state) {
  return state.auth;
}

export default connect(mapStateToProps)(LoginContainer);

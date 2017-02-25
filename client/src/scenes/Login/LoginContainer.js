import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, AsyncStorage } from 'react-native';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { login } from '../../reducers/Login/actions';
import Login from './Login';

class LoginContainer extends Component {
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
      Alert.alert('Error', 'Login failed with error: ' + error)
    });
  }

  componentWillReceiveProps(nextProps) {
    const { navigate } = this.props.navigation;
    const { status, msg } = nextProps;

    if (status === 'success') {
      navigate('HomeDrawer');
    } else {
      Alert.alert('Error', msg);
    }
  }

  componentDidMount() {
    this.loadInitialState.bind(this)().done();
  }

  loadInitialState = async() => {
    const { navigate } = this.props.navigation;
    try {
      const appAccessToken = await AsyncStorage.getItem('app_access_token');
      if (appAccessToken) {
        navigate('HomeDrawer');
      }
    } catch (error) {
      Alert.alert('Error', 'Loading Error. Please try again.');
    }
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

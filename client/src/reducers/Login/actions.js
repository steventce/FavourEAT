import { AsyncStorage } from 'react-native';
import * as actionTypes from './actionTypes';
import { API_BASE_URL } from '../../config/env';
import { LoginManager } from 'react-native-fbsdk';

export function login(accessToken) {
  return function(dispatch) {
    AsyncStorage.removeItem('app_access_token');
    return fetch(`${API_BASE_URL}v1/token/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer facebook ${accessToken}`
      },
      body: JSON.stringify({ access_token: accessToken })
    }).then((response) => {
      if (!response.ok) throw Error();
      return response.json();
    }).then((json) => {
      AsyncStorage.setItem('app_access_token', json.access_token);
      AsyncStorage.setItem('user_id', String(json.user_id));
      dispatch(loginSuccess(json));
    }).catch(() => {
      dispatch(loginError());
    });
  }
}

export function logout() {
  LoginManager.logOut();
  AsyncStorage.removeItem('app_access_token');

  return logoutSuccess();
}

// Login Actions

function loginSuccess(token) {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    status: 'success',
    msg: '',
    token
  }
}

function loginError() {
  return {
    type: actionTypes.LOGIN_ERROR,
    status: 'error',
    msg: 'Sign in failed. Please try again.'
  }
}

// Logout Actions

function logoutSuccess() {
  return {
    type: actionTypes.LOGOUT_SUCCESS,
    status: 'success',
    msg: ''
  }
}

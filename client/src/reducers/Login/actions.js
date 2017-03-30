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
      AsyncStorage.setItem('token', JSON.stringify(json));
      AsyncStorage.setItem('app_access_token', json.access_token);
      AsyncStorage.setItem('user_id', String(json.user_id));
      dispatch(loginSuccess(json));
    }).catch(() => {
      dispatch(loginError());
    });
  }
}

export function saveFcmToken(accessToken, userId, fcmToken) {
  return function(dispatch) {
    return fetch(`${API_BASE_URL}v1/users/${userId}/fcm-token/`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ fcm_token: fcmToken })
    })
    .catch((error) => console.error(error));
  }
}

export function logout(accessToken, userId) {
  return function(dispatch) {
    LoginManager.logOut();
    // TODO: Depreciate user_id and app_access_token
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('app_access_token');
    AsyncStorage.removeItem('user_id');
    return fetch(`${API_BASE_URL}v1/users/${userId}/fcm-token/`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }).then((response) => {
      dispatch(logoutSuccess());
    })
    .catch((error) => console.error(error));
  }
}

export function setToken(token) {
  return {
    type: actionTypes.SET_TOKEN,
    token
  };
}

export function setProfilePicture(imageUrl) {
  return {
    type: actionTypes.SET_PROFILE_PICTURE,
    imageUrl
  }
}

// Login Actions

function loginSuccess(token) {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    status: 'success',
    msg: '',
    token
  };
}

function loginError() {
  return {
    type: actionTypes.LOGIN_ERROR,
    status: 'error',
    msg: 'Sign in failed. Please try again.'
  };
}

// Logout Actions

function logoutSuccess() {
  return {
    type: actionTypes.LOGOUT_SUCCESS,
    status: 'success',
    msg: ''
  };
}

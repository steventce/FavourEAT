import { AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';
import * as actionTypes from './actionTypes';
import { API_BASE_URL } from '../../config/env';
import { LoginManager } from 'react-native-fbsdk';
import moment from 'moment';

export const grantTypes = {
  CONVERT: 'convert_token',
  REFRESH: 'refresh_token'
}

export function login(token, grantType) {
  let url = '';
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }

  const body = {};
  if (grantType === grantTypes.CONVERT) {
    headers.Authorization = `Bearer facebook ${token}`;
    body.access_token = token;
    url = `${API_BASE_URL}v1/token/`;
  } else {
    body.refresh_token = token;
    url = `${API_BASE_URL}v1/refresh-token/`;
  }

  return function(dispatch) {
    AsyncStorage.removeItem('app_access_token');
    AsyncStorage.removeItem('token');
    return globalFetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    }).then((response) => {
      if (!response.ok) throw Error();
      return response.json();
    }).then((json) => {
      // Calculate the token expiry
      json.expires_on = moment().add(json.expires_in, 's').toDate();
      AsyncStorage.setItem('token', JSON.stringify(json));
      AsyncStorage.setItem('app_access_token', json.access_token);
      AsyncStorage.setItem('user_id', String(json.user_id));
      dispatch(loginSuccess(json));
    }).catch((err) => {
      console.log(err);
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

export function simpleLogout() {
  return function(dispatch) {
    LoginManager.logOut();
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('app_access_token');
    AsyncStorage.removeItem('user_id');
    dispatch(logoutSuccess());
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

export function resetToLogout() {
  return NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: 'Login' })
    ]
  });
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
    token,
    isLoggedIn: true
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
    msg: '',
    isLoggedIn: false
  };
}

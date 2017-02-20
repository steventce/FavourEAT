import { AsyncStorage } from 'react-native';
import * as actionTypes from './actionTypes';
import { API_BASE_URL } from '../../config/env';

export function sendFbAccessToken(accessToken) {
  return function(dispatch) {
    removeAccessToken(dispatch);
    return fetch(`${API_BASE_URL}v1/token/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer facebook ${accessToken}`
      },
      body: JSON.stringify({ access_token: accessToken })
    }).then((response) => {
      if (!response.ok) {
        throw Error();
      }
      return response.json();
    }).then((json) => {
      addAccessToken(json, dispatch);
    }).catch(() => {
      dispatch(accessTokenError());
    })
  }
}

function accessTokenSuccess(token) {
  return {
    type: actionTypes.ACCESS_TOKEN_SUCCESS,
    status: 'success',
    response: token
  }
}

function accessTokenError() {
  return {
    type: actionTypes.ACCESS_TOKEN_FAILURE,
    status: 'error',
    error: 'Sign in failed. Please try again.'
  }
}

export async function removeAccessToken(dispatch) {
  try {
    await AsyncStorage.removeItem('app_access_token');
    console.log('removed!!!!!!!!!!!!!1');
  } catch (error) {
    dispatch(accessTokenError());
  }
}

async function addAccessToken(json, dispatch) {
  try {
    await AsyncStorage.setItem('app_access_token', json.access_token);
    await AsyncStorage.setItem('user_id', String(json.user_id));
    dispatch(accessTokenSuccess(json));
  } catch (error) {
    dispatch(accessTokenError());
  }
}

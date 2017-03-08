import { AsyncStorage } from 'react-native';
import * as actionTypes from './actionTypes';
import { API_BASE_URL } from '../../../config/env';

export function fetchEvents(accessToken, userId) {
  return function(dispatch) {
    fetch(`${API_BASE_URL}v1/users/${userId}/events/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      dispatch(fetchEventsSuccess(json));
    })
    .catch((error) => console.log(error));
  }
}

function fetchEventsSuccess(json) {
  return {
    type: actionTypes.FETCH_EVENTS_SUCCESS,
    events: json
  }
}

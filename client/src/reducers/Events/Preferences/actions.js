import * as actionTypes from './actionTypes';
import { API_BASE_URL } from '../../../config/env';

export function savePreferences(accessToken, userId, preferences) {
  return function (dispatch) {
    const { radius, minPrice, maxPrice, cuisineTypes } = preferences;
    const data = {
      radius: 100,
      min_price: minPrice,
      max_price: maxPrice,
      cuisine_types: 'chinese',
      latitude: 49.2827,
      longitude: -123.1207,
      name: 'Test'
    }

    return fetch(`${API_BASE_URL}v1/users/${userId}/events/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(data)
    })
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      const preferences = responseJson;
      dispatch(savePreferencesSuccess(responseJson));
    })
    .catch((error) => console.error(error));
  }
};

export function savePreferencesSuccess(responseJson) {
  return {
    type: actionTypes.SAVE_PREFERENCES_SUCCESS,
    status: 'success',
    eventId: responseJson.event_id
  }
}

// Example?
export function changeRadius(radius) {
  return {
    type: actionTypes.CHANGE_RADIUS,
    radius: radius
  };
};

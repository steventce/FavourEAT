import * as actionTypes from './actionTypes';
import { API_BASE_URL } from '../../../config/env';
import { getRound } from '../../Tournament/actions';

const METERS_IN_KILOMETER = 1000;

export function savePreferences(accessToken, userId, preferences) {
  return function (dispatch) {
    const { radius, minPrice, maxPrice, cuisineTypes, latitude, longitude } = preferences;

    const cuisineTypeData = [];
    for (var i = 0; i < preferences.cuisineTypes.length; i++) {
      cuisineTypeData.push(preferences.cuisineTypes[i].category);
    }

    console.log("position", latitude, longitude);
    const data = {
      radius: radius * METERS_IN_KILOMETER,
      min_price: minPrice,
      max_price: maxPrice,
      cuisine_types: cuisineTypeData,
      latitude: latitude.toFixed(6),
      longitude: longitude.toFixed(6),
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

      // immediately fetch list of retaurant for the first round
      dispatch(getRound(accessToken, responseJson.event_id));

      // not really needed but keeping for now
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

import * as actionTypes from './actionTypes';
import { API_BASE_URL } from '../../config/env';
import { getRound } from '../Tournament/actions';

const METERS_IN_KILOMETER = 1000;

/** Events */

export function fetchEvents(accessToken, userId) {
  return function (dispatch) {
    dispatch(resetStatus());
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

export function joinEvent(accessToken, userId, inviteCode) {
  return function (dispatch) {
    dispatch(resetStatus());
    return fetch(`${API_BASE_URL}v1/users/${userId}/join/${inviteCode}/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then((response) => {
        if (!response.ok) throw Error();
        console.log('joinEvent success');
        // update store
        dispatch(fetchEvents(accessToken, userId));

        return response;
      })
      .catch((error) => console.error(error));
  }
}

export function createEvent(accessToken, userId, eventDetail, preferences) {
  return function (dispatch) {
    dispatch(resetStatus());
    const { name, date, time, rndDuration } = eventDetail;
    const { radius, minPrice, maxPrice, cuisineTypes } = preferences;

    const cuisineTypeData = [];
    for (var i = 0; i < preferences.cuisineTypes.length; i++) {
      cuisineTypeData.push(preferences.cuisineTypes[i].category);
    }

    const data = {
      name: name,
      date: date,
      time: time,
      roundDuration: rndDuration,
      radius: radius * METERS_IN_KILOMETER,
      min_price: minPrice,
      max_price: maxPrice,
      cuisine_types: cuisineTypeData,
      latitude: 49.2827,
      longitude: -123.1207,
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
        // immediately fetch list of retaurant for the first round
        dispatch(getRound(accessToken, responseJson.event_id));
      })
      .catch((error) => console.error(error));
  }
};

export function editEventDetails(accessToken, userId, eventId, datetime) {
  return function(dispatch) {
    dispatch(resetStatus());
    return fetch(`${API_BASE_URL}v1/users/${userId}/events/${eventId}/`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ datetime })
    })
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      dispatch(editEventDetailsSuccess())
    })
    .catch((error) => {
      console.log(error);
    });
  }
}

export function cancelEvent(accessToken, userId, eventId) {
  return function(dispatch) {
    dispatch(resetStatus());
    return fetch(`${API_BASE_URL}v1/users/${userId}/events/${eventId}/`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }).then((response) => {
      return response.json();
    }).then((responseJson) => {
      dispatch(cancelEventSuccess());
    })
  }
}

function fetchEventsSuccess(json) {
  return {
    type: actionTypes.FETCH_EVENTS_SUCCESS,
    events: json,
    status: 'success'
  };
}

function editEventDetailsSuccess() {
  return {
    type: actionTypes.EDIT_EVENT_DETAILS_SUCCESS,
    status: 'success',
    msg: 'Event successfully updated'
  };
}

function cancelEventSuccess() {
  return {
    type: actionTypes.CANCEL_EVENT_SUCCESS,
    status: 'success',
    msg: 'Event cancelled'
  };
}

function resetStatus() {
  return {
    type: actionTypes.RESET_STATUS,
    status: '',
    msg: ''
  };
}

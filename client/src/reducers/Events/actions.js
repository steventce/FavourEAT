import * as actionTypes from './actionTypes';
import { API_BASE_URL } from '../../config/env';
import { getRound } from '../Tournament/actions';

const METERS_IN_KILOMETER = 1000;

/** Events */

export function fetchEvents(accessToken, userId) {
  return function (dispatch) {
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
        return response.json();
      })
      .then((json) => {
        // update store with new event
        dispatch(joinEventSuccess(json));
      })
      .catch((error) => console.error(error));
  }
}

export function createEvent(accessToken, userId, eventDetail, preferences) {
  return function (dispatch) {
    const is_group = (eventDetail) ? true : false;
    const name = (is_group) ? eventDetail.name : null;
    const date = (is_group) ? eventDetail.date : null;
    const time = (is_group) ? eventDetail.time : null;
    const rndDuration = (is_group) ? eventDetail.rndDuration : null;
    const { radius, minPrice, maxPrice, cuisineTypes } = preferences;

    const cuisineTypeData = [];
    for (var i = 0; i < preferences.cuisineTypes.length; i++) {
      cuisineTypeData.push(preferences.cuisineTypes[i].category);
    }

    const data = {
      is_group: is_group,
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

function fetchEventsSuccess(json) {
  return {
    type: actionTypes.FETCH_EVENTS_SUCCESS,
    events: json
  }
}

function joinEventSuccess(json) {
  return {
    type: actionTypes.JOIN_EVENT_SUCCESS,
    event: json
  }
}
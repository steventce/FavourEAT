import * as actionTypes from './actionTypes';

export function savePreferences(preferences) {
  return {
    type: actionTypes.SAVE_PREFERENCES,
    preferences: preferences 
  };  
};

// just an example
export function changeRadius(radius) {
  return {
    type: actionTypes.CHANGE_RADIUS,
    radius: radius
  };
};
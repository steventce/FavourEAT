import * as actionTypes from './actionTypes';

export function savePreferences(event_id, preferences) {
  return function (dispatch) {
    fetch('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'GET' 
    })
    .then((response) => response.json())
    .then((responseJson) => {
      const preferences = responseJson;
      console.log(preferences);
      // return {
      //   type: actionTypes.SAVE_PREFERENCES,
      //   preferences: preferences 
      // };  
    })
    .catch((error) => console.error(error));    
  }
};

// just an example
export function changeRadius(radius) {
  return {
    type: actionTypes.CHANGE_RADIUS,
    radius: radius
  };
};
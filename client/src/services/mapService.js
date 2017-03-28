import { GOOGLE_MAPS_API_KEY } from '../config/settings';

const GOOGLE_MAPS_DIRECTIONS_URL = 'https://maps.googleapis.com/maps/api/directions/json';

params = (obj) => {
  // Note: included 'fetch' function doesn't support object as params for GET REQUESTS
  // https://github.com/github/fetch/issues/256
  var esc = encodeURIComponent;
  var query = Object.keys(obj)
    .map(k => esc(k) + '=' + esc(obj[k]).replace(/%2C/, ','))
    .join('&');  
  return `?${query}`;
}


export function getRoutePoints(origin, dest) {
  var params = {
    origin: `${origin.latitude},${origin.longitude}`,
    destination: `${dest.latitude},${dest.longitude}`,
    key: GOOGLE_MAPS_API_KEY,
  };
  const queryString = this.params(params);
  return fetch(GOOGLE_MAPS_DIRECTIONS_URL + queryString, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });
};
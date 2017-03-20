import { getRoutePoints } from '../../services/mapService';
import Polyline from '@mapbox/polyline';

processRouteData = (routeData) => {
  const points = routeData.routes[0].overview_polyline.points;
  const steps = Polyline.decode(points);

  return steps.map((step) => {
    return {
      latitude: step[0],
      longitude: step[1],
    }
  });
};

export function getRoute(origin, dest, callback) {
  getRoutePoints(origin, dest)
  .then((response) => {
    if (!response.ok) throw Error();
    return response.json();
  })
  .then((routeData) => {
    console.log(routeData);
    return this.processRouteData(routeData);
  })
  .then((processedData) => {
    callback(processedData);
  })
  .catch((error) => {
    console.error(error);
  });
};
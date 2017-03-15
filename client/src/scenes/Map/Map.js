import React, { Component, PropTypes } from 'react';
import { Dimensions, PermissionsAndroid } from 'react-native';
import { Container, Content } from 'native-base';
import MapView from 'react-native-maps';

import styles from './styles';

const DEFAULT_LATITUDE_DELTA = 0.0922;
const DEFAULT_LONGITUDE_DELTA = 0.0421;

class Map extends Component {
  constructor(props) {
    super(props);
    
    const { restaurant } = this.props.navigation.state.params;

    this.state = {
      region: {
        latitude: restaurant.coordinates.latitude,
        longitude: restaurant.coordinates.longitude,
        latitudeDelta: DEFAULT_LATITUDE_DELTA,
        longitudeDelta: DEFAULT_LONGITUDE_DELTA,
      },
      position: null
    }
  }

  setUpWatchPosition = () => {
    this.watchID = navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      this.setState({position: { latitude, longitude }});
    });
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const { restaurant } = this.props.navigation.state.params;
        const rLatitude = restaurant.coordinates.latitude;
        const rLongitude = restaurant.coordinates.longitude;

        const region = {
          latitude: (rLatitude + latitude) / 2,
          longitude: (rLongitude + longitude) / 2,
          latitudeDelta: Math.abs(rLatitude - latitude) * 1.15,
          longitudeDelta: Math.abs(rLongitude - longitude) * 1.15,
        }

        this.setState({
          region: region,
          position: {latitude, longitude}
        }, this.setUpWatchPosition);
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  onRegionChange = (region) => {
    this.setState({region});
  }

  render() {
    const { restaurant } = this.props.navigation.state.params;

    return (
      <MapView
           style={styles.map}
           region={this.state.region}
           onRegionChange={this.onRegionChange}>
          <MapView.Marker 
              coordinate={restaurant.coordinates}
              title={restaurant.name} />
          {this.state.position && 
            <MapView.Marker
                coordinate={this.state.position}
                title='Me' />
          }
      </MapView>
    );
  }
}

export default Map;
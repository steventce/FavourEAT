import React, { Component, PropTypes } from 'react';
import { Dimensions, PermissionsAndroid } from 'react-native';
import { Container, Content } from 'native-base';
import MapView from 'react-native-maps';

import styles from './styles';

class Map extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
      position: {}
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
        console.log(restaurant)

        const region = {
          latitude: (rLatitude + latitude) / 2,
          longitude: (rLongitude + longitude) / 2,
          latitudeDelta: Math.abs(rLatitude - latitude),
          longitudeDelta: Math.abs(rLongitude - longitude),
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
    console.log("region", this.state.region);
    console.log("position", this.state.position);

    return (
      <MapView
           style={styles.map}
           region={this.state.region}
           onRegionChange={this.onRegionChange}>
      </MapView>
    );
  }
}

export default Map;
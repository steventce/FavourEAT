import React, { Component, PropTypes } from 'react';
import { View, Dimensions, PermissionsAndroid } from 'react-native';
import { Container, Content, Button, Icon, Spinner } from 'native-base';
import MapView from 'react-native-maps';

import { getRoute } from '../../reducers/Map/actions';

import styles from './styles';

class Map extends Component {

  static navigationOptions = {
    title: (navigation) => {
      return navigation.state.params.restaurant.name;
    }
  };

  constructor(props) {
    super(props);
    
    const { restaurant, currentLocation } = this.props.navigation.state.params;

    this.state = {
      region: this.getRegion(currentLocation, restaurant.coordinates),
      position: currentLocation,
      routePoints: [],
    }
  }

  getRoute = () => {
    if (this.state.position !== null) {
      const { restaurant } = this.props.navigation.state.params;
      const rLatitude = restaurant.coordinates.latitude;
      const rLongitude = restaurant.coordinates.longitude;

      getRoute(this.state.position, {latitude: rLatitude, longitude: rLongitude},
        (routes) => {
          this.setState({routePoints: routes});
        }
      );
    }
  };

  setUpWatchPosition = () => {
    this.watchID = navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      this.setState({position: { latitude, longitude }});
    });
  }

  getRegion = (currentLocation, restaurantLocation) => {
    const { latitude, longitude } = currentLocation;
    const { restaurant } = this.props.navigation.state.params;
    const rLatitude = restaurant.coordinates.latitude;
    const rLongitude = restaurant.coordinates.longitude;

    const region = {
      latitude: (rLatitude + latitude) / 2,
      longitude: (rLongitude + longitude) / 2,
      latitudeDelta: Math.abs(rLatitude - latitude) * 1.5,
      longitudeDelta: Math.abs(rLongitude - longitude) * 1.5,
    }

    return region;
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const region = this.getRegion(position.coords, this.props.navigation.state.params.restaurant.coordinates);
        const { latitude, longitude } = position.coords;

        this.setState({
          region: region,
          position: {latitude, longitude}
        }, this.setUpWatchPosition);
      },
      (error) => {},
      {enableHighAccuracy: false, timeout: 3000, maximumAge: 1000}
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
      <View style={styles.container}>
        <MapView
             style={styles.map}
             region={this.state.region}
             onRegionChange={this.onRegionChange}
             showsUserLocation={true}
             loadingEnabled={true}
             showsMyLocationButton={false}>
          <MapView.Marker 
              coordinate={restaurant.coordinates}
              title={restaurant.name} />
          <MapView.Polyline
              coordinates={this.state.routePoints}
              strokeWidth={2}
              strokeColor={'#4985E9'} />
        </MapView>
        <Button 
            style={{ position: 'absolute', bottom: 20, right: 20 }}
            onPress={this.getRoute}>
          <Icon name='navigate' />
        </Button>
      </View>
    );
  }
}

export default Map;
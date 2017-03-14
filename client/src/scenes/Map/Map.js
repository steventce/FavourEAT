import React, { Component, PropTypes } from 'react';
import { Dimensions } from 'react-native';
import { Container, Content } from 'native-base';
import MapView from 'react-native-maps';

import styles from './styles';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    }
  }

  onRegionChange = (region) => {
    this.setState({region});
  }

  render() {
     const screen = Dimensions.get('window');
     const screenSize = {
      width: screen.width,
      height: screen.height,
     };

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
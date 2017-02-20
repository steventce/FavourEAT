import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import styles from './styles';

import Preferences from '../Preferences/index';

class UserEvents extends Component {
  static navigationOptions = {
    title: 'Events'
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.event}>
          Events Screen
        </Text>
        <Preferences />
      </View>
    );
  }
}

export default UserEvents;

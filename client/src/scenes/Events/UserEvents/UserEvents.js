import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import styles from './styles';

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
      </View>
    );
  }
}

export default UserEvents;

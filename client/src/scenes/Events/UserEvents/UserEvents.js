import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import styles from './styles';

import Preferences from '../Preferences/index';

class UserEvents extends Component {
  static navigationOptions = {
    title: 'Events'
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text style={styles.event}>
          Events Screen
        </Text>
        <Button 
            onPress={() => navigate('Preferences')}
            title='Preferences' />
      </View>
    );
  }
}

export default UserEvents;

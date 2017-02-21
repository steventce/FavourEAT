import React, { Component } from 'react';
import {
  Text,
  Button,
  View
} from 'react-native';
import LoginButton from '../../components/LoginButton';
import styles from './styles';

class Login extends Component {
  static navigationOptions = {
    title: 'Welcome'
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Double tap R on your keyboard to reload,{'\n'}
          Shake or press menu button for dev menu
        </Text>
        <LoginButton />
        <Button onPress={() => navigate('Home')} title="Events" />
        <Button onPress={() => navigate('RestaurantDetails')} title="RestaurantDetails" />
      </View>
    );
  }
}

export default Login;

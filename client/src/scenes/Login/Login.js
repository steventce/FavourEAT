import React, { Component } from 'react';
import { Image, View, Button, Dimensions, StyleSheet } from 'react-native';
import { Container, Content } from 'native-base';
import LoginButton from '../../components/LoginButton';

import styles from './styles';
import { logo, splash } from '../../config/images';

class Login extends Component {
  static navigationOptions = { header: { visible: false } }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.container}>
          <Image source={splash} resizeMode="cover"
            style={styles.background}>
          </Image>
          <View style={{...StyleSheet.flatten(styles.background), backgroundColor: 'rgba(0,0,0,0.7)' }}>
          </View>
          <View style={styles.imageContainer}>
            <Image style={styles.logo} source={logo} />
          </View>
          <View style={styles.btnContainer}>
            <LoginButton handleFacebookLogin={this.props.handleFacebookLogin} />
          </View>
        </Content>
      </Container>
    );
  }
}

export default Login;

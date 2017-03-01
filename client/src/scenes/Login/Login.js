import React, { Component } from 'react';
import { Image, View, Button } from 'react-native';
import { Container, Content } from 'native-base';
import LoginButton from '../../components/LoginButton';

import styles from './styles';
import { logo } from '../../config/images';

class Login extends Component {
  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.container}>
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

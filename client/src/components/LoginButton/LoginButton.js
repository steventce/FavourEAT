import React, { Component } from 'react';
import { Button } from 'react-native';

class LoginButton extends Component {
  handleFacebookLogin() {
    // TODO
  }

  render() {
    return (
      <Button title="Login with Facebook" onPress={this.handleFacebookLogin}></Button>
    );
  }
}

export default LoginButton;

import React, { Component } from 'react';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { Button, Text, Icon } from 'native-base';

class LoginButton extends Component {
  static propTypes = {
    handleFacebookLogin: React.PropTypes.func.isRequired
  }

  render() {
    return (
      <Button block iconLeft style={{ backgroundColor: '#3b5998' }} onPress={this.props.handleFacebookLogin}>
        <Icon name="logo-facebook" />
        <Text>Sign in with Facebook</Text>
      </Button>
    );
  }
}

export default LoginButton;

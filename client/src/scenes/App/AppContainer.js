import React, { Component } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { MainStack } from '../../../index.android';
import { resetToLogout } from '../../reducers/Login/actions';

class AppContainer extends Component {
  componentWillReceiveProps(nextProps) {
    if (!nextProps.auth.isLoggedIn && this.props.auth.isLoggedIn) {
      this.app.dispatch(resetToLogout())
      Alert.alert('Session Expired. Please login again');
    }
  }

  render() {
    return <MainStack ref={(app) => {this.app = app}} />;
  }
}

const mapStateToProps = function(state) {
  return state;
}

export default connect(mapStateToProps)(AppContainer);

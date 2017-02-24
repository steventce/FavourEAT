import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, AsyncStorage } from 'react-native';
import CreateEvent from './CreateEvent';

class CreateEventContainer extends Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <CreateEvent />
    );
  }
}

export default CreateEventContainer;
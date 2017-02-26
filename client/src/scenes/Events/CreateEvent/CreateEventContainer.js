import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, AsyncStorage } from 'react-native';
import CreateEvent from './CreateEvent';

var moment = require('moment');

class CreateEventContainer extends Component {
  static navigationOptions = {
    title: 'Create an Event'
  }

  setPreferences() {
    const { navigate } = this.props.navigation;
    navigate('Preferences', { prev: 'CreateEvent' });
  }

  validate(name, date, time) {
    if (!name) {
      Alert.alert('Error', 'Please enter an event name.')
      return;      
    }
    var event = moment(date+" "+time, 'YYYY-MM-DD  HH:mm');
    if (!event.isValid() || moment().isAfter(event)) {
      Alert.alert('Error', 'Invalid date & time entered.')
      return;
    }

    console.log("valid");
  }

  render() {
    return (
      <CreateEvent validate={this.validate.bind(this)}
        setPreferences={this.setPreferences.bind(this)}
        {...this.props}/>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    preferences: state.event.preferences
  }
};

export default connect(mapStateToProps)(CreateEventContainer);
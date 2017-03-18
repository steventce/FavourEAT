import React, { Component } from 'react';
import { Alert } from 'react-native';
import CreateEvent from './CreateEvent';

var moment = require('moment');

class CreateEventContainer extends Component {
  static navigationOptions = {
    title: 'Create an Event'
  }

  validate(name, date, time, rndDuration) {
    console.log(name);
    console.log(date);
    console.log(time);
    console.log(rndDuration);
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
    // Proceed to setting the preferences
    const { navigate } = this.props.navigation;
    navigate('Preferences', { name, date, time, rndDuration });
  }

  render() {
    return (
      <CreateEvent validate={ this.validate.bind(this) } />
    );
  }
}


export default CreateEventContainer;
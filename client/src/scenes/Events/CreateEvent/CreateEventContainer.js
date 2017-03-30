import React, { Component } from 'react';
import { Alert } from 'react-native';
import CreateEvent from './CreateEvent';
import {
  validateEventName,
  validateEventDatetime,
  validateRndDuration
} from '../../../utils/common';
import moment from 'moment';

class CreateEventContainer extends Component {
  static navigationOptions = {
    title: 'Create an Event'
  }

  validate(name, date, time, rndDuration) {
    if (!validateEventName(name)) return;
    var event = moment(date+" "+time, 'YYYY-MM-DD  HH:mm');
    if (!validateEventDatetime(event)) return;
    if (!validateRndDuration(rndDuration)) return;

    // Proceed to setting the preferences
    const eventDetail = { name, datetime: event.toDate(), rndDuration };
    this.props.navigation.navigate('Preferences', { eventDetail });
  }

  render() {
    return (
      <CreateEvent validate={ this.validate.bind(this) } />
    );
  }
}


export default CreateEventContainer;

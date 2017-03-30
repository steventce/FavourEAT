import { Alert } from 'react-native';
import moment from 'moment';

export function isUpcoming(event) {
  return moment(event.event_detail.datetime).isSameOrAfter(moment(new Date()));
}

// True == successful validation
export function validateEventName(name) {
  if (!name) {
    Alert.alert('Error', 'Please enter an event name.')
  }
  return !!name;
}

export function validateEventDatetime(eventMoment) {
  if (!eventMoment.isValid() || moment().isAfter(eventMoment)) {
    Alert.alert('Error', 'Invalid date & time entered.')
    return false;
  }
  return true;
}

export function validateRndDuration(rndDuration) {
  if (!rndDuration) {
    Alert.alert('Error', 'Please select an option for round duration.')
  }
  return !!rndDuration;
}

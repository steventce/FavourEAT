import { connect } from 'react-redux';
import EventDetails from './EventDetails';
import { editEventDetails, cancelEvent, fetchEvents } from '../../../reducers/Events/actions';
import { getRound } from '../../../reducers/Tournament/actions';
import { eventRating } from '../../../reducers/Events/actions';
import {
  validateEventName,
  validateEventDatetime
} from '../../../utils/common';
import moment from 'moment';

const validateEditEvent = function(eventDetails) {
  const { name, datetime } = eventDetails
  return validateEventName(name) && validateEventDatetime(moment(datetime));
}

const mapStateToProps = function(state, props) {
  const { navigation } = props;
  const { userEvent } = navigation.state.params;
  const { status, msg } = state.event;

  return {
    auth: state.auth,
    navigation,
    userEvent: { ...userEvent, status, msg }
  };
};

const mapDispatchToProps = function(dispatch, props) {
  return {
    editEventDetails: (accessToken, userId, eventId, eventDetails) => {
      if (!validateEditEvent(eventDetails)) return;
      dispatch(editEventDetails(accessToken, userId, eventId, eventDetails));
    },
    cancelEvent: (accessToken, userId, eventId) => {
      dispatch(cancelEvent(accessToken, userId, eventId)).then(() => {
        props.navigation.goBack().then(dispatch(fetchEvents(accessToken, userId)));
      });
    },
    getRound: (accessToken, eventId) => {
      dispatch(getRound(accessToken, eventId));
    },
    eventRating: (accessToken, userId, eventId, rating) => {
      dispatch(eventRating(accessToken, userId, eventId, rating));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);

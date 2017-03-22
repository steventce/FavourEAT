import { connect } from 'react-redux';
import EventDetails from './EventDetails';
import { editEventDetails, cancelEvent } from '../../../reducers/Events/actions';

const mapStateToProps = function(state, props) {
  const { navigation } = props;
  const { userEvent } = navigation.state.params;
  const { status, msg } = state.event;

  return { navigation, userEvent: { ...userEvent, status, msg } };
};

const mapDispatchToProps = function(dispatch) {
  return {
    editEventDetails: (accessToken, userId, eventId, datetime) => {
      dispatch(editEventDetails(accessToken, userId, eventId, datetime));
    },
    cancelEvent: (accessToken, userId, eventId) => {
      dispatch(cancelEvent(accessToken, userId, eventId));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);

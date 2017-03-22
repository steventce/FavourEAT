import { connect } from 'react-redux';
import EventDetails from './EventDetails';
import { editEventDetails } from '../../../reducers/Events/actions';

const mapStateToProps = function(state, props) {
  const { navigation } = props;
  const { userEvent } = navigation.state.params;
  return { navigation, userEvent };
};

const mapDispatchToProps = function(dispatch) {
  return {
    editEventDetails: (accessToken, userId, eventId, datetime) => {
      dispatch(editEventDetails(accessToken, userId, eventId, datetime));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);

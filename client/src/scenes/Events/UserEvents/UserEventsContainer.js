import { connect } from 'react-redux';
import { fetchEvents } from '../../../reducers/Events/actions';
import UserEvents from './UserEvents';

const mapStateToProps = function(state) {
  const { auth, event } = state;
  return { auth, events: event.events };
};

const mapDispatchToProps = function(dispatch) {
  return {
    fetchEvents: (accessToken, userId) => {
      dispatch(fetchEvents(accessToken, userId));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(UserEvents);

import { connect } from 'react-redux';
import Preferences from './Preferences';
import { createEvent } from '../../../reducers/Events/actions';

const mapStateToProps = (state, ownProps) => {
  return {
    preferences: state.event.preferences,
    allCuisineTypes: state.event.allCuisineTypes
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createEvent: (access_token, user_id, preferences) => {
      let eventDetail = (ownProps.navigation.state.params) ? ownProps.navigation.state.params.eventDetail : null;
      dispatch(createEvent(access_token, user_id, eventDetail, preferences));
    },
    startTournament: () => {
      ownProps.navigation.navigate('Swipe');
    }
  }
};

const PreferencesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Preferences);

export default PreferencesContainer;

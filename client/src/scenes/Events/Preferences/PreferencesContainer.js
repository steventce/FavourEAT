import { connect } from 'react-redux';
import Preferences from './Preferences';
import {
  changeRadius,
  getPreferences,
  savePreferences
} from '../../../reducers/Events/Preferences/actions';

const mapStateToProps = (state, ownProps) => {
  return {
    eventId: state.event.eventId,
    eventCreateStatus: state.event.status,
    preferences: state.event.preferences,
    allCuisineTypes: state.event.allCuisineTypes
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeRadius: (radius) => {
      dispatch(changeRadius(radius));
    },
    savePreferences: (access_token, event_id, preferences) => {
      dispatch(savePreferences(access_token, event_id, preferences));
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

import { connect } from 'react-redux';
import Preferences from './Preferences';
import { changeRadius, savePreferences } from '../../../reducers/Events/actions';

const mapStateToProps = (state, ownProps) => {
  return {
    preferences: state.event.preferences,
    allCuisineTypes: state.event.allCuisineTypes
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeRadius: (radius) => {
      dispatch(changeRadius(radius));
    },
    savePreferences: (event_id, preferences) => {
      dispatch(savePreferences(event_id, preferences));
    }
  }
};

const PreferencesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Preferences);

export default PreferencesContainer;
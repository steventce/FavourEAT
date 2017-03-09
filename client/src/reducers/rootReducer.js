import { combineReducers } from 'redux';
import event from './Events/Preferences/reducer';
import userEvent from './Events/UserEvents/reducer';
import auth from './Login/reducer';
import swipe from './Swipe/reducer';
import rounds from './Tournament/reducer';

export default combineReducers({
  event,
  userEvent,
  auth,
  swipe,
  rounds
});

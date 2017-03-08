import { combineReducers } from 'redux';
import event from './Events/reducer';
import auth from './Login/reducer';
import swipe from './Swipe/reducer';
import rounds from './Tournament/reducer';

export default combineReducers({
  event,
  auth,
  swipe,
  rounds
});

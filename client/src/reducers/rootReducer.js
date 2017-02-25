import { combineReducers } from 'redux';
import event from './Events/reducer';
import auth from './Login/reducer';
import swipe from './Swipe/reducer';

export default combineReducers({
  event,
  auth,
  swipe
});

import { combineReducers } from 'redux';
import event from './Events/reducer';
import auth from './Login/reducer';

export default combineReducers({
  event,
  auth
});

import { combineReducers } from 'redux';
import event from './Events/reducer';
import login from './Login/reducer';

export default combineReducers({
  event,
  login
});

import * as actionTypes from './actionTypes';

const initialState = { token: {}, status: '', msg: '', isLoggedIn: false };

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        status: action.status,
        msg: action.msg,
        token: { ...action.token },
        isLoggedIn: action.isLoggedIn
      };
    case actionTypes.LOGIN_ERROR:
      return {
        ...state,
        status: action.status,
        msg: action.msg
      };
    case actionTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        status: action.status,
        msg: action.msg,
        isLoggedIn: action.isLoggedIn
      };
    case actionTypes.SET_TOKEN:
      return {
        ...state,
        token: { ...action.token }
      };
    case actionTypes.SET_PROFILE_PICTURE:
      return {
        ...state,
        imageUrl: action.imageUrl
      }
    default:
      return state;
  }
}

export default reducer;

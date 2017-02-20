import * as actionTypes from './actionTypes';

const initialState = {
  token: '',
  status: '',
  error: ''
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ACCESS_TOKEN_SUCCESS:
      return { ...state, ...action };
    case actionTypes.ACCESS_TOKEN_FAILURE:
      return { ...state, ...action };
    default:
      return state;
  }
}

export default reducer;

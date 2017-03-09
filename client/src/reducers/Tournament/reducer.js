import * as actionTypes from './actionTypes';

const initialState = { restaurants: [] }

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_SUCCESS:
      return {
        ...state,
        restaurants: action.restaurants
      }
    default:
      return state;
  }
}

export default reducer;
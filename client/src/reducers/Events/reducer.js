import * as actionTypes from './actionTypes';

const initialState = {
  preferences: {
    distance: 5,
    minPrice: 5,
    maxPrice: 30,
    cuisineTypes: []
  }
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.SAVE_PREFERENCES:
      return {
        ...state,
        preferences: action.preferences
      };
    case actionTypes.CHANGE_RADIUS:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          distance: action.radius
        }
      };
    default: 
      return state;
  }
};

export default reducer;
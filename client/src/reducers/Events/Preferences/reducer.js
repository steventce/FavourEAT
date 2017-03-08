import * as actionTypes from './actionTypes';

const initialState = {
  preferences: {
    radius: 5,
    minPrice: 5,
    maxPrice: 25,
    cuisineTypes: []
  },
  // TODO: need to fetch the list from server
  allCuisineTypes: [
    {value: 1, label: 'Chinese'},
    {value: 2, label: 'Japanese'},
    {value: 3, label: 'Indian'},
    {value: 4, label: 'Pizza'},
    {value: 5, label: 'Barbeque'}
  ],
  status: '',
  eventId: -1
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.SAVE_PREFERENCES_SUCCESS:
      return {
        ...state,
        status: action.status,
        eventId: action.eventId
      };
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

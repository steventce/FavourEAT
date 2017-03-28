import * as actionTypes from './actionTypes';

const initialState = {
  preferences: {
    radius: 5,
    minPrice: 5,
    maxPrice: 25,
    cuisineTypes: [],
    latitude: null,
    longitude: null,
  },
  // TODO: need to fetch the list from server
  allCuisineTypes: [
    {value: 1, label: 'Chinese', category: 'chinese'},
    {value: 2, label: 'Japanese', category: 'japanese'},
    {value: 3, label: 'Indian', category: 'indpak'},
    {value: 4, label: 'Pizza', category: 'pizza'},
    {value: 5, label: 'Barbeque', category: 'bbq'}
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

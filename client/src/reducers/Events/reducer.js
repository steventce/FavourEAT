import * as actionTypes from './actionTypes';

const initialState = {
  preferences: {
    radius: 5,
    minPrice: 5,
    maxPrice: 25,
    cuisineTypes: []
  },
  // TODO: need to fetch the list from server
  // list of cuisine options displayed to user
  allCuisineTypes: [
    {value: 1, label: 'Chinese', category: 'chinese'},
    {value: 2, label: 'Japanese', category: 'japanese'},
    {value: 3, label: 'Indian', category: 'indpak'},
    {value: 4, label: 'Pizza', category: 'pizza'},
    {value: 5, label: 'Barbeque', category: 'bbq'}
  ],
  // list of events user is participating
  events: [],
  status: '',
  msg: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_EVENTS_SUCCESS: {
      return { ...state, events: action.events };
    }
    case actionTypes.EDIT_EVENT_DETAILS_SUCCESS:
    case actionTypes.CANCEL_EVENT_SUCCESS: {
      const { status, msg } = action;
      return { ...state, status, msg };
    }
    default:
      return state;
  }
};

export default reducer;

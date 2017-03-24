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
  // used for forcing a change
  timestamp: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_EVENTS_SUCCESS: {
      return { ...state, events: action.events };
    }
    case actionTypes.JOIN_EVENT_SUCCESS: {
      // Check if store already contains this event
      for (var i=0; i < state.events.length; i++) {
        if (state.events[i].id === action.event.id) {
          // change timestamp to force trigger componentWillReceiveProps
          return { ...state, timestamp: !state.timestamp };
        }
      }
      // must add new element to last index of array (refer to JoinEventContainer)
      return { ...state, events: [...state.events, action.event] };
    }
    default:
      return state;
  }
};

export default reducer;
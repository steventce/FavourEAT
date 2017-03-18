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
  events: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default reducer;
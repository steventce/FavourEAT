import * as actionTypes from './actionTypes';

const initialState = {
  events: []
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCH_EVENTS_SUCCESS: {
      return { ...state, events: action.events };
    }
    default: {
      return state;
    }
  }
}

import * as actionTypes from './actionTypes';

const initialState = { eventId: '', tournamentArr: [] }

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_SUCCESS:
      return {
        ...state,
        eventId: action.eventId,
        tournamentArr: action.tournamentArr
      }
    default:
      return state;
  }
}

export default reducer;
import * as actionTypes from './actionType';

const initialState = {};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        // TODO: use for persistence
        /*case actionTypes.SAVE_SWIPE:
            return {
                ...state,
                swipe: action.swipe
            };*/
        default:
            return state;
    }
};

export default reducer;
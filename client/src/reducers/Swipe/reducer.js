import * as actionTypes from './actionType';

const reducer = (state, action) => {
    switch(action.type) {
        case actionTypes.SAVE_SWIPE:
            return {
                ...state,
                swipe: action.swipe
            };
        default:
            return state;
    }
};

export default reducer;
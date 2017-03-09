import { API_BASE_URL } from '../../config/env';
import * as actionTypes from './actionTypes';

export function getRound(accessToken, eventId) {
    return function (dispatch) {
        fetch(`${API_BASE_URL}v1/events/${eventId}/tournament/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then((response) => {
            if (!response.ok) throw Error();            
            return response.json()
        })
        // TODO hack since server side is returning it weird
        .then((json) => {
            return json.map((value) => value.restaurant);
        })
        .then((json) => {
            console.log(json);
            dispatch(getRoundSuccess(json));
        })
        .catch((error) => console.error(error))
    }
};

export function putRound(accessToken, eventId, tournamentId, isFinished=false, tournamentData=null) {
    var requestBody = null;
    if (isFinished) {
        requestBody = JSON.stringify({
            is_finished: 1,
            tournament_data: tournamentData
        })
    }
    return function (dispatch) {
        fetch(`${API_BASE_URL}v1/events/${eventId}/tournament/${tournamentId}/`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: requestBody
        })
        .then((response) => {
            console.log(response);
            if (!response.ok) throw Error();            
        })
        .catch((error) => console.error(error))
    }
};

function getRoundSuccess(json) {
    return {
        type: actionTypes.GET_SUCCESS,
        restaurants: json
    }
}
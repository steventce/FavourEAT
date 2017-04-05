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
        .then((json) => {
            dispatch(getRoundSuccess(eventId, json));
        })
        .catch((error) => console.error(error))
    }
};

export function putRound(accessToken, eventId, tournamentArr, tournamentData, callback) {
    return function (dispatch) {
        fetch(`${API_BASE_URL}v1/events/${eventId}/tournament/`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                is_finished: 1,
                tournament_data: tournamentData,
                tournaments: tournamentArr
            })
        })
        .then((response) => {
            if (!response.ok) throw Error();            
            return response.json();
        })
        .then((json) => {
            console.log(json.Next);
            if (callback)
                callback(json.Next);
        })
        .catch((error) => console.error(error))
    }
};

function getRoundSuccess(id, json) {
    return {
        type: actionTypes.GET_SUCCESS,
        eventId: id,
        tournamentArr: json
    }
}
import { API_BASE_URL } from '../../config/env';

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
            console.log(response);
            if (!response.ok) throw Error();            
        })
        .catch((error) => console.error(error))
    }
};

export function putRound(accessToken, eventId, tournamentId) {
    return function (dispatch) {
        fetch(`${API_BASE_URL}v1/events/${eventId}/tournament/${tournamentId}/`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                
            })
        })
        .then((response) => {
            console.log(response.status);
            if (!response.ok) throw Error();            
        })
        .catch((error) => console.error(error))
    }
};
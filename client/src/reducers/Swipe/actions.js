import { API_BASE_URL } from '../../config/env';

export function saveSwipe(userId, accessToken, swipesArr) {
    return function (dispatch) {
        fetch(`${API_BASE_URL}v1/users/${userId}/swipes/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                swipes: swipesArr
            })
        })
        .then((response) => {
            console.log(response.status);
            if (!response.ok) throw Error();            
        })
        .catch((error) => console.error(error))
    }
};
import { API_BASE_URL } from '../../config/env';

export function saveSwipe(userID) {
    return function (dispatch) {
        fetch(`${API_BASE_URL}v1/users/${userID}/swipes/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                /*leftArr: leftArr,
                rightArr: rightArr,*/
            })
        })
        .then((response) => {
            console.log(response.status);
            if (!response.ok) throw Error();            
        })
        .catch((error) => console.error(error))
    }
};
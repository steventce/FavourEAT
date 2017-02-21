export function saveSwipe() {
    return function (dispatch) {
        fetch('https://jsonplaceholder.typicode.com/posts/1', {
            method: 'POST'
        })
        .then((response) => {
            console.log(response.status);
        })
        .catch((error) => console.error(error))
    }
};
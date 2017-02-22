export function saveSwipe() {
    return function (dispatch) {
        fetch('https://jsonplaceholder.typicode.com/posts/1', {
            method: 'POST',
            body: JSON.stringify({
                /*leftArr: leftArr,
                rightArr: rightArr,*/
            })
        })
        .then((response) => {
            console.log(response.status);
        })
        .catch((error) => console.error(error))
    }
};
require('whatwg-fetch')

window.favoritesHandler = favoritesHandler

function favoritesHandler(id, checkFavorite){
    const favoritesList = document.getElementById('favoritesList')
    const path = "/favorites/favItem/" + id
    const res = (checkFavorite.checked)
        ? addTeam(path, favoritesList)
        : removeTeam(id, path, favoritesList)
    res.catch(err => alert(err))
}

function addTeam(path, favoritesList) {
    return fetch(path,  {
            method: 'PUT',
        })
        .then(data => data.text())
        .then(data => {
            favoritesList.innerHTML += data
        })
}

function removeTeam(id, path, favoritesList) {
    return fetch(path,  {method: 'DELETE'})
        .then(data => {
            const item = document.getElementById('favItem' + id)
            favoritesList.removeChild(item)
        })
}
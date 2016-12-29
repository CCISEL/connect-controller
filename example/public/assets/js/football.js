function favoritesHandler(id, checkFavorite){
    const favoritesList = document.getElementById('favoritesList')
    const path = "/favorites/favItem/" + id
    const res = (checkFavorite.checked)
        ? addTeam(path, favoritesList)
        : removeTeam(id, path, favoritesList)
    res.catch(err => alert(err))
}

function addTeam(path, favoritesList) {
    return ajaxRequest('PUT', path)
        .then(data => {
            favoritesList.innerHTML += data
        })
}

function removeTeam(id, path, favoritesList) {
    return ajaxRequest('DELETE', path)
        .then(data => {
            const item = document.getElementById('favItem' + id)
            favoritesList.removeChild(item)
        })
}

function ajaxRequest(meth, path) {
    const promise = new Promise((resolve, reject) => {
        const xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
                if (xmlhttp.status == 200) {
                    resolve(xmlhttp.responseText)
                }
                else {
                    reject(new Error(xmlhttp.status + ' -- ' + xmlhttp.statusText))
                }
            }
        }    
        xmlhttp.open(meth, path, true)
        xmlhttp.send()
    })
    return promise
}

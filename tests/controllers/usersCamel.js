'use strict'

module.exports = {
    'groups':  function (nr, res) {
        res.render('viewName', nr)
    },

    'index': function () {
        return 'I am index'
    },

    'indexTeamid': function (teamId, reqVar, resLocalVar, appLocalVar) {
        return { teamId, reqVar, resLocalVar, appLocalVar }
    },

    'indexIdMembers':  function () {
        return 'I am index_id_members'
    },

    'dummyBastofNrMembers':  function (nr) {
        return nr
    },

    /**
     * Arguments nr and str are parsed as route parameters because
     * they are part of the method's name.
     * The rest of arguments arg1, and arg2 will be searched in 
     * req, req.query, req.body, etc...
     */
    'dummyNrTeamsXptoStr':  function (nr, arg1, arg2, str) {
        return {nr, arg1, arg2, str}
    },

    'xoneStuff': function(stuff, req, next) {
        next()
    },

    'postXone': function(stuff) {
        return stuff
    }
}
'use strict'

const footballDb = require('./../db/footballDb')

module.exports = {
    /**
     * Every action parameter (e.g. id) taking part of method's name (e.g. _id_)
     * is bound to the corresponding argument of req.params (e.g. req.params.id).
     */
    'leagues_id_table': (id, req) => footballDb
        .leagueTable(id)
        .then(league => {
            league.favorites = req.favorites
            return league
        })
    ,
    
    /**
     * Every action parameter (e.g. name) that is NOT part of the method's name
     * is bound to the corresponding query-string argument (e.g. )
     */
    'leagues' : function(name, req) {
        if(name) name = name.toLowerCase()
        return footballDb
            .leagues()
            .then(leagues => leagues
                .filter(l => !name || l.caption.toLowerCase().includes(name))
                .map(addLeaguePath))
            .then(leagues => { return {
                'leagues': leagues,
                'favorites': req.favorites
            }})
        
        function addLeaguePath(league) {
            league.leagueHref = "/football/leagues/" + league.id + "/table"
            return league
        }
    },

    /**
     * Whenever an action receives the `res` parameter, the connect-controller
     * gets out of the way and delegates on that action the responsibility of
     * sending the response.
     * So whenever you want to do something different from the default behavior 
     * you just have to append res to your parameters.
     */
    'index' : function(res) {
        res.redirect('/football/leagues')
    }
}
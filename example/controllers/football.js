'use strict'

module.exports = (function(){
    const footballDb = require('./../db/footballDb')
    return {
        'leagues_id_table': leagues_id_table, // binds to /leagues/:id/table
        // <=> 'leagues_id_table': footballDb.leagueTable
        'leagues': leagues,                   // binds to /leagues
        'index': index                        // binds to /
    }

    /**
     * Every action parameter (e.g. id) taking part of method's name (e.g. _id_)
     * is bound to the corresponding argument of req.params (e.g. req.params.id).
     * In this case this function is useless and we could simply bound 
     * property 'leagues_id_table' to method footballDb.leagueTable.
     */
    function leagues_id_table(id){
        return footballDb.leagueTable(id)
    }
    
    /**
     * Every action parameter (e.g. name) that is NOT part of the method's name
     * is bound to the corresponding query-string argument (e.g. )
     */
    function leagues(name) {
        if(name) name = name.toLowerCase()
        return footballDb
            .leagues()
            .then(leagues => leagues
                .filter(l => !name || l.caption.toLowerCase().includes(name))
                .map(addLeaguePath))
        
        function addLeaguePath(league) {
            league.leagueHref = "/football/leagues/" + league.id + "/table"
            return league
        }
    }

    /**
     * Whenever an action receives the `res` parameter, the connect-controller
     * gets out of the way and delegates on that action the responsibility of
     * sending the response.
     * So whenever you want to do something different from the default behavior 
     * you just have to append res to your parameters.
     */
    function index(res) {
        res.redirect('/football/leagues')
    }
})()
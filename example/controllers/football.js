'use strict'


module.exports = (function(){
    /**
     * Import modules
     */
    const footballDb = require('./../db/footballDb')
    /**
     * football module API
     */
    return {
        'leagues': leagues,
        'leagueTable_id': leagueTable_id
    }
    /**
     * football module API -- leagueTable
     */
    function leagueTable_id(id) { // Auto parses id from query-string
        return footballDb
            .leagueTable(id)
            .then(league => {
                league.title = 'League Table'
                return league
            })
    }
    /**
     * football module API -- leagues
     */
    function leagues() {
        return footballDb
            .leagues()
            .then(leagues => {
                leagues = leaguesWithLinks(leagues)
                return {
                    'title':'Leagues',
                    'leagues': leagues
                }
            })
    }

    /**
     * Utility auxiliary function
     */
    function leaguesWithLinks(leagues) {
        return leagues.map(item => {
            item.leagueHref = "/football/leagueTable/" + item.id
            return item 
        })
    }
})()
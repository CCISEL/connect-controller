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
        'leagueTable': leagueTable
    }
    /**
     * football module API -- leagueTable
     */
    function leagueTable(id, req, res, next) { // Auto parses id from query-string
        footballDb.leagueTable(id, (err, league) => {
            if(err) return next(err)
            res.json(league)
        })    
    }
    /**
     * football module API -- leagues
     */
    function leagues(req, res, next) {
        const query = req.query
        footballDb.leagues((err, leagues) => {
            if(err) return next(err)
            leagues = leaguesWithLinks(leagues)
            res.json(leagues)
        })    
    }

    /**
     * Utility auxiliary function
     */
    function leaguesWithLinks(leagues) {
        return leagues.map(item => {
            item.leagueHref = "/leagueTable?id=" + item.id
            return item 
        })
    }
})()
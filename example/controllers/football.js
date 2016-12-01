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
            league.title = 'League Table'
            res.render('football/leagueTable', league)
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
            res.render('football/leagues', {
                'title':'Leagues',
                'leagues': leagues
            })
        })    
    }

    /**
     * Utility auxiliary function
     */
    function leaguesWithLinks(leagues) {
        return leagues.map(item => {
            item.leagueHref = "/football/leagueTable?id=" + item.id
            return item 
        })
    }
})()
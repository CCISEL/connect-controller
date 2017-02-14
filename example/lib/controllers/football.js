'use strict'

const footballDb = require('./../db/footballDb')

module.exports = {
    getLeaguesIdTable, // binds to /football/leagues/:id/table
    getLeagues,        // binds to /football/leagues
    index,             // binds to /football/
    indexId            // binds to /football/:id
}

/**
 * Every action parameter (e.g. id) taking part of method's name (e.g. _id_)
 * is bound to the corresponding argument of req.params (e.g. req.params.id).
 * In this case this function is useless and we could simply bound 
 * property 'leagues_id_table' to method footballDb.leagueTable.
 */
function getLeaguesIdTable(id){
    return footballDb.leagueTable(id)
}

/**
 * Every action parameter (e.g. name) that is NOT part of the method's name
 * will be searched on req.query, req.body, req, res.locals and req.app.locals.
 */
function getLeagues(name) {
    if(name) name = name.toLowerCase()
    return footballDb
        .leagues()
        .then(leagues => leagues
            .filter(l => !name || l.caption.toLowerCase().indexOf(name) >= 0)
            .map(addLeaguePath))
    
    function addLeaguePath(league) {
        league.leagueHref = '/football/leagues/' + league.id + '/table'
        return league
    }
}

/**
 * Whenever an action receives the `res` parameter, the connect-controller
 * gets out of the way and delegates on that action the responsibility of
 * sending the response.
 * So whenever you want to do something different from the default behavior 
 * you just have to append `res` to your parameters.
 */
function index(res) {
    /**
     * If this controller is loaded with an options object set with
     * the property `redirectOnStringResult` then this is equivalent
     * to removing the `res` parameter and just return the destination
     * string path '/football/leagues'.
     */
    res.redirect('/football/leagues')
}

/**
 * If this controller is loaded with an options object set with the property 
 * `redirectOnStringResult` then this action method redirects to 
 * `/football/leagues/:id/table`.
 */
function indexId(id) {
    return '/football/leagues/' + id + '/table'
}

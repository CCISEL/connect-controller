'use strict'

module.exports = (function(){
    const footballDb = require('./../db/footballDb')
    const express = require('express')
    const router = express.Router()
    
    router.get('/leagueTable/:id', (req, res, next) => {
        const id = req.params.id
        footballDb
            .leagueTable(id)
            .then(league => {
                league.title = 'League Table'
                res.render('football/leagueTable', league)
            })
    })

    router.get('/leagues', (req, res, next) => {
        footballDb
            .leagues()
            .then(leagues => {
                leagues = leaguesWithLinks(leagues)
                res.render('football/leagues', {
                    'title':'Leagues',
                    'leagues': leagues
                })
            })
    })
    return router
    
    /**
     * Utility auxiliary function
     */
    function leaguesWithLinks(leagues) {
        return leagues.map(item => {
            item.leagueHref = "/leagueTable/" + item.id
            return item 
        })
    }
})()
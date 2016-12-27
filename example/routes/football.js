'use strict'

module.exports = (function(){
    const footballDb = require('./../db/footballDb')
    const express = require('express')
    const router = express.Router()
    
    router.get('/leagues/:id/table', (req, res, next) => {
        const id = req.params.id
        footballDb
            .leagueTable(id)
            .then(league => {
                league.favorites = req.favorites
                res.render('football/leagues/table', league)
            })
            .catch(err => next(err))
    })

    router.get('/leagues', (req, res, next) => {
        let name
        if(req.query.name) name = req.query.name.toLowerCase()
        footballDb
            .leagues()
            .then(leagues => {
                leagues = leagues
                    .filter(l => !name || l.caption.toLowerCase().includes(name))
                    .map(addLeaguePath)
                const ctx = {
                    'leagues': leagues,
                    'favorites': req.favorites
                }
                res.render('football/leagues', ctx)
            })
            .catch(err => next(err))

        function addLeaguePath(league) {
            league.leagueHref = "/router/leagues/" + league.id + "/table"
            return league
        }
    })

    router.get('/', (req, res, next) => {
        res.redirect('/router/leagues')
    })

    return router
    
})()
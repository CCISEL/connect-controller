'use strict'

const footballDb = require('./../db/footballDb')
const express = require('express')

module.exports = (function(){
    const router = express.Router()    
    router.get('/leagues/:id/table', leagues_id_table)
    router.get('/leagues', leagues)
    router.get('/', index)
    return router

    function leagues_id_table(req, res, next) {
        const id = req.params.id
        footballDb
            .leagueTable(id)
            .then(league => {
                res.render('football/leagues/table', league)
            })
            .catch(err => next(err))
    }

    function leagues(req, res, next) {
        let name
        if(req.query.name) name = req.query.name.toLowerCase()
        footballDb
            .leagues()
            .then(leagues => {
                leagues = leagues
                    .filter(l => !name || l.caption.toLowerCase().indexOf(name) >= 0)
                    .map(addLeaguePath)
                res.render('football/leagues', leagues)
            })
            .catch(err => next(err))

        function addLeaguePath(league) {
            league.leagueHref = "/router/leagues/" + league.id + "/table"
            return league
        }
    }

    function index(req, res, next) {
        res.redirect('/router/leagues')
    }

})()
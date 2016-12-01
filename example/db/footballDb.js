'use strict'

module.exports = (function(){
    /**
     * Import npm modules
     */
    const fs = require('fs')
    const fetch = require('node-fetch')
    /**
     * Constants
     */
    const FOOTBALL_HOST = 'http://api.football-data.org'
    const FOOTBALL_PATH = '/v1/soccerseasons/'
    const FOOTBALL_CREDENTIALS = loadCredentials(__dirname +  '/footballCredentials.js')
    /**
     * footballDb module API
     */
    return {
        'leagues': leagues,
        'leagueTable': leagueTable
    }

    function leagues() {
        const path = FOOTBALL_HOST + FOOTBALL_PATH
        const options = { 'headers': FOOTBALL_CREDENTIALS }
        return fetch(path, options)
            .then(res => res.json())
            .then(arr => {
                if(arr.error) throw new Error("No leagues !!!! You probably reached your request limit. Get your free API token from http://api.football-data.org/!!! --------- Message from football-data.org:" + arr.error)
                return arr.map(item => new League(item))
            })
    }

    function leagueTable(id) {
        const path =  FOOTBALL_HOST + FOOTBALL_PATH + id + '/leagueTable'
        const options = { 'headers': FOOTBALL_CREDENTIALS }
        return fetch(path, options)
            .then(res => res.json())
            .then(obj => {
                if(obj.error) throw new Error("There is no League with id = " + id)
                if(!obj.standing) throw new Error("There is no Table for id = " + id)
                return new LeagueTable(id, obj)
            })
    }

    /**
     * Domain Entity -- League 
     */
    function League(obj) {
        this.id = obj.id
        this.caption = obj.caption
        this.year = obj.year
    }

    /**
     * Domain Entity -- LeagueTable 
     */
    function LeagueTable(id, obj) {
        this.id = id
        this.caption = obj.leagueCaption
        this.teams  = obj.standing.map(std => new Team(std))
    }

    /**
     * Domain Entity -- Team 
     */
    function Team(obj) {
        const path = obj._links.team.href.split('/')
        this.id = path[path.length - 1]
        this.position = obj.position
        this.name = obj.teamName
        this.points = obj.points
        this.goals = obj.goals
    }

    /**
     * Utility auxiliary function -- loadCredentials
     */
    function loadCredentials(file) {
        /**
         * Change it if you find a better way of synchronously 
         * check whether a file exists, or not !!!!!!
         */
        try {
            const stats = fs.statSync(file);
            // it existsSync
            return require(file)
        }
        catch(err) {
            // it does not existsSync
            return undefined
        } 
    }
})()
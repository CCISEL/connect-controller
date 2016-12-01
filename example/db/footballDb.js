'use strict'

module.exports = (function(){
    /**
     * Import npm modules
     */
    const http = require('http')
    const fs = require('fs')
    /**
     * Constants
     */
    const FOOTBALL_HOST = 'api.football-data.org'
    const FOOTBALL_PATH = '/v1/soccerseasons/'
    const FOOTBALL_CREDENTIALS = loadCredentials(__dirname +  '/footballCredentials.js')
    /**
     * footballDb module API
     */
    return {
        'leagues': leagues,
        'leagueTable': leagueTable
    }

    function leagues(cb) {
        const path = FOOTBALL_PATH
        const headers = FOOTBALL_CREDENTIALS
        httpGetAsJson(FOOTBALL_HOST, path, headers, (err, arr) => {
            if(err) return cb(err)
            if(arr.error) return cb(new Error("No leagues !!!! You probably reached your request limit. Get your free API token from http://api.football-data.org/!!! --------- Message from football-data.org:" + arr.error))
            cb(null, arr.map(item => new League(item)))
        })
    }

    function leagueTable(id, cb) {
        const path = FOOTBALL_PATH + id + '/leagueTable'
        const headers = FOOTBALL_CREDENTIALS
        httpGetAsJson(FOOTBALL_HOST, path, headers, (err, obj) => {
            if(err) return cb(err)
            if(obj.error) return cb(new Error("There is no League with id = " + id))
            if(!obj.standing) return cb(new Error("There is no Table for id = " + id))
            cb(null, new LeagueTable(id, obj))
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
     * Utility auxiliary function -- httpGetAsJson
     */
    function httpGetAsJson(host, path, headers, cb) {
        const options = {
            'host': host,
            'path': path
        }
        if(headers) options.headers = headers
        http.get(options, (resp) => {
            let res = ''
            resp.on('error', cb)
            resp.on('data', chunck => res += chunck.toString())
            resp.on('end', () => {
                cb(null, JSON.parse(res))
            })
        })    
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
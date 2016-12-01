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

    function LeagueTable(id, obj) {
        this.id = id
        this.caption = obj.leagueCaption
        this.teams  = obj.standing.map(std => new Team(std))
    }

    function Team(obj) {
        const path = obj._links.team.href.split('/')
        this.id = path[path.length - 1]
        this.position = obj.position
        this.name = obj.teamName
        this.points = obj.points
        this.goals = obj.goals
    }

    function httpGetAsJson(host, path, headers, cb) {
        options = {
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
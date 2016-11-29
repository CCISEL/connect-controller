'use strict'

const reflectParameters = require('./reflectParameters')

module.exports = RouteInfo

/**
 * @constructor
 *
 * @property {Object}   target  Instance containing the method (property)  
 * @property {String}   prop    Property name
 * @property {Function} handler Method
 */
function RouteInfo(target, prop, ctrMethod) {
    const paramsParser = {
        'req': (req) => req,
        'res': (req, res, next) => res,
        'next': (req, res, next) => next,
    }
    const GET = 'get', POST = 'post', PUT = 'put', DELETE = 'delete'
    const keysMethods = [ GET, POST, PUT, DELETE ]
    /**
     * keywordsMaps turns in { 'get' : '', 'post' : '', ...} 
     */
    const keywordsMaps = keysMethods.reduce((obj, curr) => {
        obj[curr] = ''; return obj;
    }, {}) 
    keywordsMaps.index = '/'

    /**
     * Fields
     */
    this.target = target
    this.name = prop
    this.handler = ctrMethod
    this.path = parseMethodName(prop)
    this.method = parseHttpMethod(prop)
    this.view = parseView(prop)
    this.argsParser = initArgsParser(this) // DON'T change the assignment order!!!!

    /**
     * Returns the route path for the corresponding controller
     * method name.
     * Controller methods naming convention interleaves path names and
     * route parameters.  
     */
    function parseMethodName(name) {
        let parts = name.toLowerCase().split('_')
        /**
         * Supresses HTTP method if exists
         */
        if(keysMethods.indexOf(parts[0]) >= 0)
            parts = parts.slice(1)
        /**
         * Converts each method part into route path  
         */
        let isRouteParam = false
        return parts.reduce((prev, curr) => {
            if(keywordsMaps[curr]) prev += keywordsMaps[curr] 
            else {
                if(prev.slice(-1) != '/') prev += '/'
                if(isRouteParam) prev += ':'
                prev += curr
            }
            isRouteParam = !isRouteParam
            return prev
        }, '')
    }

    /**
     * Gets the HTTP method from the Controller method name.
     * Otherwise returns 'get'. 
     */
    function parseHttpMethod(name) {
        const parts = name.toLowerCase().split('_')
        if(keysMethods.indexOf(parts[0]) >= 0)
            return parts[0]
        else 
            return GET
    }

    /**
     * @return {Array} Arrays of functions (req, res, next) => value. Each function
     * looks for an argument in req object.
     */
    function initArgsParser(info) {
        const paramsNames = reflectParameters(info.handler)
        return paramsNames.map(name => {
            if(paramsParser[name]) return paramsParser[name]
            if(info.name.split('_').indexOf(name) >= 0) return req => req.params[name]
            if(info.method == POST) return req => req.body[name]
            return req => req.query[name]
        })
    }

    function parseView(name) {

    }
}
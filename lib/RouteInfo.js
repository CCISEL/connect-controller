'use strict'

const reflectParameters = require('./reflectParameters')

module.exports = RouteInfo

/**
 * @constructor
 *
 * @param {Object}   target  Instance containing the method (property)
 * @param {String}   name    controller name
 * @param {String}   prop    Property name which is the action's name
 * @param {Function} action  Method of controller object
 */
function RouteInfo(target, name, prop, action) {
    /**
     * A Parameter Parser is a function with desc: (req, res, next) => void,
     * which is responsible for extracting an Action parameter from the req,
     * res or next objects.
     * Whenever an Action receives a plain req, res or next, the parser just 
     * forwards that argument to the action.
     * Otherwise, the parser must look for the Action parameter in req.params,
     * req.query or req.body.
     */
    const defaultParamsParser = {
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
    this.controllerPath = name || ''
    this.target = target
    this.name = prop
    this.action = action
    this.actionParts = splitActionName(prop)
    /**
     * DON'T change the assignment order!!!!
     */
    this.argsNames = reflectParameters(action)
    this.path = parseMethodName(this.actionParts, this.argsNames)
    this.method = parseHttpMethod(this.actionParts)
    this.view = parseView(this.controllerPath, this.actionParts, this.argsNames)
    this.argsParser = initParamsParser(this.argsNames, this.actionParts)

    /**
     * Returns an array with the action's name split by underscores
     * or lowerCamelCase.
     */
    function splitActionName(actionName) {
        if(actionName.indexOf('_') > 0) return actionName.split('_');
        else return actionName.split(/(?=[A-Z])/).map(p => p.toLowerCase())
    }

    /**
     * Returns the route path for the corresponding controller
     * method name.
     */
    function parseMethodName(parts, argsNames) {
        /**
         * argsName could be in different case from that
         * of function's name.
         */
        const argsNamesLower = argsNames.map(arg => arg.toLowerCase())
        /**
         * Supresses HTTP method if exists
         */
        if(keysMethods.indexOf(parts[0].toLowerCase()) >= 0)
            parts = parts.slice(1)
        /**
         * Converts each method part into route path  
         */
        return parts.reduce((prev, curr) => {
            if(keywordsMaps[curr]) prev += keywordsMaps[curr] 
            else {
                if(prev.slice(-1) != '/') prev += '/'
                const index = argsNamesLower.indexOf(curr.toLowerCase())
                if(index >= 0) {
                    prev += ':'
                    prev += argsNames[index] // Preserve argument Case
                } else {
                    prev += curr
                }
            }
            return prev
        }, '')
    }

    /**
     * Gets the HTTP method from the Controller method name.
     * Otherwise returns 'get'. 
     */
    function parseHttpMethod(parts) {
        const prefix = parts[0].toLowerCase()
        if(keysMethods.indexOf(prefix) >= 0)
            return prefix
        else 
            return GET
    }

    /**
     * @return {Array} Arrays of functions (req, res, next) => value. 
     * Each function looks for its Action parameter in req, res or next
     * object.
     */
    function initParamsParser(argsNames, parts) {
        /**
         * arguments could be in different case from that
         * of function's name.
         */
        parts = parts.map(p => p.toLowerCase())
        /**
         * For each Action parameter returns a new  parser, 
         * which is responsible for getting the corresponding argument
         * from the req object.
         */
        return argsNames.map(name => {
            if(defaultParamsParser[name]) return defaultParamsParser[name]
            if(parts.indexOf(name.toLowerCase()) >= 0) return req => req.params[name]
            return lookupParameterOnReq(name)
        })
    }

    /**
     * Given the name of a parameter search for it in req, req.query,
     * req.body, res.locals, app.locals.
     */
    function lookupParameterOnReq(name) {
        return (req, res) => {
            if(req[name]) return req[name]
            if(req.query && req.query[name]) return req.query[name]
            if(req.body && req.body[name]) return req.body[name]
            if(res.locals && res.locals[name]) return res.locals[name]
            if(req.app.locals && req.app.locals[name]) return req.app.locals[name]
        }
    }

    /**
     * @param {String} name controller name path with prefix /  
     * @property {String} prop Property name
     */
    function parseView(controllerPath, parts, argsNames) {
        /**
         * argsName could be in different case from that
         * of function's name.
         */
        argsNames = argsNames.map(arg => arg.toLowerCase())

        const actionPath = parts
            .filter(p => argsNames.indexOf(p.toLowerCase()) < 0)   // Removes route parameters
            .filter(p => keysMethods.indexOf(p) < 0)               // Removes prefix get, or put, etc
            .join('/')
        return controllerPath != ''
            ? controllerPath + '/' + actionPath
            : actionPath
    }
}
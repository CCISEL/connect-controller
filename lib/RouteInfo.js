'use strict'

const reflectParameters = require('./reflectParameters')

module.exports = RouteInfo

/**
 * @constructor
 *
 * @param {Object}   target  Instance containing the method (property)
 * @param {String}   name    controller name
 * @param {String}   prop    Property name
 * @param {Function} handler Method
 */
function RouteInfo(target, name, prop, ctrMethod) {
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
    this.controllerName = name || ''
    this.target = target
    this.name = prop
    this.handler = ctrMethod
    this.argsNames = reflectParameters(ctrMethod) // // DON'T change the assignment order!!!!
    this.path = parseMethodName(prop, this.argsNames)
    this.method = parseHttpMethod(prop)
    this.view = parseView(this) // DON'T change the assignment order!!!!
    this.argsParser = initParamsParser(this) // DON'T change the assignment order!!!!

    /**
     * Returns the route path for the corresponding controller
     * method name.
     */
    function parseMethodName(name, argsNames) {
        let parts = name.split('_')
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
                if(argsNames.includes(curr)) prev += ':'
                prev += curr
            }
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
     * @return {Array} Arrays of functions (req, res, next) => value. 
     * Each function looks for its Action parameter in req, res or next
     * object.
     */
    function initParamsParser(info) {
        const paramsNames = info.argsNames
        /**
         * For each Action parameter returns a new  parser, 
         * which is responsible for getting the corresponding argument
         * from the req object.
         */
        return paramsNames.map(name => {
            if(defaultParamsParser[name]) return defaultParamsParser[name]
            if(info.name.split('_').indexOf(name) >= 0) return req => req.params[name]
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
            return undefined
        }
    }

    /**
     * @param {String} name controller name path with prefix /  
     * @property {String} prop Property name
     */
    function parseView(info) {
        const parts = info.path.split('/');
        const actionPath = parts
            .filter(p => p != '')
            .reduce((prev, curr) => {
                if(!curr.startsWith(':')) prev += '/' + curr 
                return prev
            }, '')
        return info.controllerName != '' && actionPath != ''
            ? info.controllerName + '/' + actionPath
            : info.controllerName + actionPath
    }
}
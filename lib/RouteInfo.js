'use strict'

module.exports = RouteInfo

/**
 * @constructor
 *
 * @property {Object}   target  Instance containing the method (property)  
 * @property {String}   prop    Property name
 * @property {Function} handler Method
 */
function RouteInfo(target, prop, ctrMethod) {

    const keysMethods = [ 'get', 'post', 'put', 'delete' ]
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
    this.path = parseMethodName(prop)
    this.method = parseHttpMethod(prop)
    this.handler = ctrMethod
    this.view = parseView(prop)
    this.argsParser = initArgsParser(ctrMethod)

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
                if(isRouteParam) prev += ':'
                else prev += '/' 
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
            return keysMethods[0]
    }

    /**
     * @return {Array} Arrays of functions (req) => value. Each function
     * looks for an argument in req object.
     */
    function initArgsParser(ctrMethod) {

    }

    function parseView(name) {

    }
}
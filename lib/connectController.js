'use strict'

const fs = require('fs')
const path = require('path')
const express = require('express')

module.exports = (function () {
    const keysMethods = [ 'get', 'post', 'put', 'delete' ]
    /**
     * keywordsMaps turns in { 'get' : '', 'post' : '', ...} 
     */
    const keywordsMaps = keysMethods.reduce((obj, curr) => {
        obj[curr] = ''; return obj;
    }, {}) 
    keywordsMaps.index = '/'
    
    loadControllersFrom.parseMethodName = parseMethodName
    return loadControllersFrom   

    /**
     * Creates a new Middleware based on the parameter src controller or
     * all controllers located in src path.  
     * If src is undefined then load controllers from  __dirname + '/controllers'
     * Otherwise, argument can be one of the following:
     * @param {String} src The controllers path
     * @param {Object} src Controller instance itself
     * @return {Array} Array of Middleware objects (Router instances)
     */
    function loadControllersFrom(src) {
        /**
         * If argument is a controller instance itself
         */
        const ctrs = src && !(src instanceof String)
            ? [src]
            : loadControllersFromFolder(src)
        
        return ctrs.map(buildMw)
    }

    function loadControllersFromFolder(src) {
        const folder = src ? 
            src
            : path.join(__dirname, '/controllers')

        return fs.readdirSync(folder)
            .map(item => require(path.join(folder, item)))
    }

    /**
     * For each method of ctr object creates a new Middleware.
     * Route, query or body parameters are automatically mapped
     * to method arguments. 
     * @param {Object} ctr Controller instance
     * @return {Router} express.Router instance
     */
    function buildMw(ctr) {
        const router = express.Router()
        for(let prop in ctr) {
            if(ctr[prop] instanceof Function) {
                const info = new RouteInfo(prop, ctr[prop])
                /**
                 * e.g. router.get(path, Middleware).
                 * And then Middleware redirects to info.handler and 
                 * renders the corresponding view.
                 */
                router[info.method].call(router, info.path, (req, res, next) => {
                    res.render(info.view, info.handler())
                })
            }
        }
        return router
    }

    /**
     * @return  
     */
    function getRoutesFromMethods(ctr) {

    }

    function getRoutesFromArraySpec(ctr) {

    }

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

    function parseView(name) {

    }

    /**
     * @constructor
     * 
     * @property {String}   path
     * @property {Function} handler
     */
    function RouteInfo(prop, ctrMethod) {
        this.path = parseMethodName(prop)
        this.method = parseHttpMethod(prop)
        this.handler = ctrMethod
        this.view = parseView(prop)
    }

})();
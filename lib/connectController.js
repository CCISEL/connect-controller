'use strict'

const fs = require('fs')
const path = require('path')
const express = require('express')
const RouteInfo = require('./RouteInfo')

module.exports = (function () {

    loadControllersFrom.RouteInfo = RouteInfo
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
                const info = new RouteInfo(ctr, prop, ctr[prop])
                /**
                 * e.g. router.get(path, Middleware).
                 * And then Middleware redirects to info.handler and 
                 * renders the corresponding view.
                 */
                router[info.method].call(router, info.path, (req, res, next) => {
                    const args = info.argsParser.map(parser => parser(req, res, next))
                    const ctx = info.handler.apply(info.target, args)
                    res.render(info.view, ctx)
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

})();
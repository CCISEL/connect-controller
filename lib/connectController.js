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
     * @return {Middleware} Middleware of Middleware objects (Router instances)
     */
    function loadControllersFrom(src) {
        /**
         * If src argument is a controller instance itself
         * returns a Mw with routes for each controller action.
         */
        if(src && !(src instanceof String))
            return buildMw(src, express.Router())
        /**
         * If src argument is a path or undefined, loads all
         * controllers from /controllers folder
         */
        return loadControllersFromFolder(src)
    }

    function loadControllersFromFolder(src) {
        const folder = src ? 
            src
            : path.join(process.cwd(), '/controllers')
        
        return fs
            .readdirSync(folder)
            .reduce((router, item) => {
                const ctr = require(path.join(folder, item))
                const name = item.substring(0, item.length - 3) // FIX !! Remove .js extension
                return buildMw(ctr, router, '/' + name) // Add build Mw to router
            }, express.Router())
    }

    /**
     * For each method of ctr object creates a new Middleware that 
     * is added to router argument.
     * Route, query or body parameters are automatically mapped
     * to method arguments. 
     * @param {Object} ctr Controller instance
     * @return {Router} express.Router instance
     */
    function buildMw(ctr, router, name) {
        for(let prop in ctr) {
            if(ctr[prop] instanceof Function) {
                const info = new RouteInfo(ctr, prop, ctr[prop])
                /**
                 * e.g. router.get(path, Middleware).
                 * And then Middleware redirects to info.handler and 
                 * renders the corresponding view.
                 */
                const path = name ? name + info.path : info.path 
                router[info.method].call(router, path, (req, res, next) => {
                    const args = info.argsParser.map(parser => parser(req, res, next))
                    const ctx = info.handler.apply(info.target, args)
                    if(!res.finished)
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
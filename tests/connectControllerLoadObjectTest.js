'use strict'

const controller = require('./../index')
const userCtr = require('./controllers/users.js')

/**
 * mws is a Middleware of Middlewares (Router objects).
 * Each mws element is a Router corresponding to each controller.
 * In this case there is a single Router corresponding to userCtr source.
 * In turn, each Router contains a Middleware for each method of the controller. 
 */
const mws = controller(
    userCtr,
    { name: 'users'} )

module.exports = require('./units/connectControllerLoadTest')(mws)
'use strict'

/**
 * Import npm packages
 */
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fs = require('fs')
const favoritesDb = require('./db/favoritesDb')
const hbs = require('hbs')
hbs.registerPartials(__dirname + '/views/partials');
require('./views/hbs-helpers')

/**
 * Import local libraries
 */
const routeFootball = require('./routes/football')
const controller = require('./../index')

/**
 * Instantiate...
 */
const app = express()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

/**
 * Add Middlewares
 */
app.use(favicon(path.join(__dirname, 'public', 'R2D2.ico')))
//app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use((req, res, next) => { req.favorites = favoritesDb; next(); })

/**
 * Add controller
 */
const mws = controller()
app.use(mws)

/**
 * Add Routes
 */
app.use('/router', routeFootball) // <=> Route on '/routes' with same features of /football controller  

/**
 * Error-handling middlewares
 */
// catch 404 and forward to default error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// print stacktrace
app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: err
    })
})

module.exports = app
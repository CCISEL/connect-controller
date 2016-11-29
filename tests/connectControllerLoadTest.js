'use strict'

const controller = require('./../lib/connectController')

const userCtr = {
    'index': function () {return 'I am index'},
    'index_id': function () {return 'I am index_id'}, 
    'index_id_members':  function () {return 'I am index_id_members'}
}

/**
 * mws is an Array of Middlewares (Router objects).
 * Each mws element is a Router corresponding to each controller.
 * In this case there is a single Router corresponding to userCtr source.
 * In turn, each Router contains a Middleware for each method of the controller. 
 */
const mws = controller(userCtr)

module.exports.testLoadControllers = function(test) {
    test.expect(1)
    test.equal(mws.length, 1)    // 1 controller for userCtr object
    test.done() 
}

module.exports.testControllerIndex = function(test) {
    test.expect(1)
    const router = mws[0]
    const req = { 'url': '/', 'method': 'get'}
    const res = { 'render': (view, ctx) => test.equal(ctx, 'I am index')}
    router(req, res)
    test.done()
}

module.exports.testControllerIndexId = function(test) {
    test.expect(1)
    const router = mws[0]
    const req = { 'url': '/27', 'method': 'get'}
    const res = { 'render': (view, ctx) => test.equal(ctx, 'I am index_id')}
    router(req, res)
    test.done()
}

module.exports.testControllerIndexIdMembers = function(test) {
    test.expect(1)
    const router = mws[0]
    const req = { 'url': '/31/members', 'method': 'get'}
    const res = { 'render': (view, ctx) => test.equal(ctx, 'I am index_id_members')}
    router(req, res)
    test.done()
}

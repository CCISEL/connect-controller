'use strict'

const controller = require('./../lib/connectController')

const userCtr = {
    'index': function () {return 'I am index'},
    'index_id': function (id) {return id}, 
    'index_id_members':  function () {return 'I am index_id_members'},
    'dummy_nr_members':  function (nr) {return nr},
    'dummy_nr_teams':  function (nr, arg1, arg2) {return {
        'nr': nr, 'arg1': arg1, 'arg2': arg2
    }},
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
    const res = { 'render': (view, ctx) => test.equal(ctx, '27')}
    router(req, res)
    test.done()
}

module.exports.testControllerDummyNrMembers = function(test) {
    test.expect(1)
    const router = mws[0]
    const req = { 'url': '/dummy/31/members', 'method': 'get'}
    const res = { 'render': (view, ctx) => test.equal(ctx, '31')}
    router(req, res)
    test.done()
}

module.exports.testControllerRouteAndQueryParameters = function(test) {
    test.expect(3)
    const router = mws[0]
    const req = { 
        'url': '/dummy/71/teams?arg1=abc&arg2=super', 
        'method': 'get',
        'query': {'arg1': 'abc', 'arg2': 'super'}
    }
    const res = { 'render': (view, ctx) => {
        test.equal(ctx.nr, '71')
        test.equal(ctx.arg1, 'abc')
        test.equal(ctx.arg2, 'super')
        test.done()
    }}
    router(req, res)
}

'use strict'

module.exports = function(controller){
    const router = require('connect')()
    router.locals = { 'appLocalVar': 'appLocalValue' }
    router.use((req, res, next) => {
        req.app = router
        req.reqVar = 'reqValue'
        res.locals = { 'resLocalVar': 'resLocalValue' }
        next()
    })
    router.use(controller)
    router.use((err, req, res, next) => {console.log(err)})

    return {
        testLoadControllers: function(test) {
            test.expect(1)
            test.equal(controller.stack.length, 8)    // 5 actions/handlers for userCtr object
            test.done() 
        },

        testControllerIndex : function(test) {
            test.expect(1)
            const req = { 'url': '/users', 'method': 'get'}
            const res = { 'render': (view, ctx) => test.equal(ctx, 'I am index')}
            router(req, res)
            test.done()
        },

        testControllerIndexId : function(test) {
            test.expect(4)
            const req = { 'url': '/users/27', 'method': 'get'}
            const res = { 'render': (view, ctx) => { 
                test.equal(ctx.teamId, '27')
                test.equal(ctx.appLocalVar, 'appLocalValue')
                test.equal(ctx.resLocalVar, 'resLocalValue')
                test.equal(ctx.reqVar, 'reqValue')
                test.done()
            }}
            router(req, res)
        },

        testControllerDummyNrMembers : function(test) {
            test.expect(2)
            const req = { 'url': '/users/dummy/bastof/31/members', 'method': 'get'}
            const res = { 'render': (view, ctx) => {
                test.equal(view, 'users/dummy/bastof/members')
                test.equal(ctx, '31')
            }}
            router(req, res)
            test.done()
        },

        testControllerGroups : function(test) {
            test.expect(1)
            const req = { 
                'url': '/users/groups?nr=24', 
                'method': 'get',
                'query': {'nr': '24' }
            }
            const res = { 'render': (view, ctx) =>
                test.equal(ctx, '24')}
            router(req, res)
            test.done()
        },

        testControllerRouteAndQueryParameters : function(test) {
            test.expect(4)
            const req = { 
                'url': '/users/dummy/71/teams/xpto/ola?arg1=abc&arg2=super', 
                'method': 'get',
                'query': {'arg1': 'abc', 'arg2': 'super'}
            }
            const res = { 'render': (view, ctx) => {
                test.equal(ctx.nr, '71')
                test.equal(ctx.arg1, 'abc')
                test.equal(ctx.arg2, 'super')
                test.equal(ctx.str, 'ola')
                test.done()
            }}
            router(req, res)
        },
        testControllerActionWithReqAndNext: function(test) {
            const req = { 'url': '/users/xone/67', 'method': 'get'}
            const res = { 'render': (view, ctx) => {} }
            controller.use((req, res, next) => {
                test.expect(1);
                test.ok(true, "this assertion should pass");
                test.done();
            })
            router(req, res)
        },
        testControllerActionPost: function(test) {
            test.expect(1)
            const req = { 
                'url': '/users/xone', 
                'method': 'post',
                'body': { 'stuff': 73 }
            }
            const res = { 'render': (view, ctx) => {
                test.equal(ctx, '73')
                test.done()
            } }
            router(req, res)
        }
    }
}
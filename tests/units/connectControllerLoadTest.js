'use strict'

module.exports = function(router){
    return {
        testLoadControllers: function(test) {
            test.expect(1)
            test.equal(router.stack.length, 6)    // 5 actions/handlers for userCtr object
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
            test.expect(1)
            const req = { 'url': '/users/27', 'method': 'get'}
            const res = { 'render': (view, ctx) => test.equal(ctx, '27')}
            router(req, res)
            test.done()
        },

        testControllerDummyNrMembers : function(test) {
            test.expect(1)
            const req = { 'url': '/users/dummy/31/members', 'method': 'get'}
            const res = { 'render': (view, ctx) => test.equal(ctx, '31')}
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
            test.expect(3)
            const req = { 
                'url': '/users/dummy/71/teams?arg1=abc&arg2=super', 
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
        },

    }
}
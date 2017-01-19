'use strict'

module.exports = function(PromiseCtor){
    const dummyCtr = {
        'xone_id': function(id) {
            return new PromiseCtor((resolve) => {
                resolve({
                    'msg': 'Some Stuff',
                    'myId': id
                })
            })
        },
        'excep': function() {
            return new PromiseCtor((resolve, reject) => {
                reject(new Error('Illegal action'))
            })
        }
    }

    const controller = require('./../../index')
    const router = controller(dummyCtr)

    return {
        testAsyncAction : function(test) {
            test.expect(2)
            const req = { 'url': '/xone/27', 'method': 'get'}
            const res = { 'render': (view, ctx) => {
                test.equal(ctx.msg, 'Some Stuff')
                test.equal(ctx.myId, 27)
                test.done()
            }}
            router(req, res)
        },
        testExceptionalAction : function(test) {
            test.expect(1)
            const req = { 'url': '/excep', 'method': 'get'}
            const res = { 'render': () => { test.ok(false) }}
            router.use((err, req, res, next) => { 
                test.equal(err.message, 'Illegal action')
                test.done()
            })
            router(req, res)
        },
    }
}
'use strict'

const controller = require('./../index')

module.exports.testParseMethodNameWithoutParameters = function(test) {
    testParseMethodName(
        function get_members() {}, // actual
        '/members',                // expected 
        test)
}

module.exports.testParseMethodNameWithoutParametersNorPrefix = function(test) {
    testParseMethodName(
        function members() {},   // actual
        '/members',              // expected 
        test)
}

module.exports.testParseMethodNameWithoutGetPrefix = function(test) {
    testParseMethodName(
        function index_id_members(id) {},   // actual
        '/:id/members',                   // expected 
        test)
}

module.exports.testParseMethodNameWithGet = function(test) {
    testParseMethodName(
        function get_index_id_members(id) {},   // actual
        '/:id/members',                       // expected 
        test)
}

function testParseMethodName(method, expected, test) {
    /**
     * Act
     */
    test.expect(3)
    const routeInfo = new controller.RouteInfo(null, '', method.name, method) // (target, method name, method)
    /**
     * Assert
     */
    test.equal(routeInfo.path, expected)
    test.equal(routeInfo.handler, method)
    test.equal(routeInfo.method, 'get')
    test.done()   
}
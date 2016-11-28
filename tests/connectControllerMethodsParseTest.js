'use strict'

const controller = require('./../lib/connectController')

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
        function index_id_members() {},   // actual
        '/:id/members',                   // expected 
        test)
}

module.exports.testParseMethodNameWithGet = function(test) {
    testParseMethodName(
        function get_index_id_members() {},   // actual
        '/:id/members',                       // expected 
        test)
}

function testParseMethodName(method, expected, test) {
    /**
     * Act
     */
    test.expect(1)
    const routePath = controller.parseMethodName(method)
    /**
     * Assert
     */
    test.equal(routePath, expected)
    test.done()   
}
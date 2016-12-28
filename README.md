# connect-controller

[![Build](https://travis-ci.org/CCISEL/connect-controller.svg?branch=master)](https://travis-ci.org/CCISEL/connect-controller)
[![Coverage Status](https://coveralls.io/repos/github/CCISEL/connect-controller/badge.svg?branch=master)](https://coveralls.io/github/CCISEL/connect-controller?branch=master)

[connect-controller](https://www.npmjs.com/package/connect-controller) allows you to
create **Plain Controller Objects** with NO [express](https://www.npmjs.com/package/express)
boilerplate code. 
We call them _Plain_ because they require NO additional configuration,
NOR annotations, NOR a specific base class, NOR `req`, `res` or `next` arguments, etc.
The [connect-controller](https://www.npmjs.com/package/connect-controller) suppresses
all the [express](https://www.npmjs.com/package/express) web server boilerplate code
from a web controller, such as:
`router.get(...)`; paths specification e.g. `/path/subPath/:routeParam`;
arguments lookup on `res.query`, `res.params`, etc;  rendering views
`res.render(<viewPath>, <context>)`; specifying views paths; etc.

For instance, given a domain service [`footballDb`](https://github.com/CCISEL/connect-controller/blob/master/example/db/footballDb.js)
with a promises based API, **compare** the two approaches of building a `football` router
with a single endpoint to the path `/league/:id/table`.
In the following, the former example uses the `connect-controller` and the latter the express `Router`.

```js
const connectCtr = require('connect-controller')
const controller = {
  leagues_id_table: (id) => footballDb.leagueTable(id) // <=> leagues_id_table: footballDb.leagueTable
}
app.use('football', connectCtr(controller))
```  
(see full [example/controllers/football.js](https://github.com/CCISEL/connect-controller/blob/master/example/controllers/football.js))

```js
const router = express.Router()
router.get('/leagues/:id/table', (req, res, next) => {
    const id = req.params.id
    footballDb
      .leagueTable(id)
      .then(league => {
        res.render('football/leagues/table', league)
      })
      .catch(err => next(err))
})
app.use('football', router)
```
(see full [example/routes/football.js](https://github.com/CCISEL/connect-controller/blob/master/example/routes/football.js))

**Note** that the former example suppresses all boilerplate code:
  1. NO need of `router.get`. Methods bind to http GET, by default. For different verbs 
  just prefix `<verb>_`to method's name.
  2. NO path definition `/leagues/:id/table`. Router paths are mapped to methods names.
  2. NO need of `req`, `res`, `next` arguments.
  3. NO arguments lookup, such as `req.params.id`. Just add `id` as a method parameter.
  4. NO explicit renderization. `res.render(...)` is implicit.
  5. NO view path specification. By default, the view path is `/controllerName/actionName`.
  6. NO error handler.

The [connect-controller](https://www.npmjs.com/package/connect-controller)
builds a connect/express Middleware from a Plain Controller Object.
By default, every controller method (_Action_) is mapped to a route with the path
`/controllerName/actionName`, following the server-side controller conventions
(according to the [Controller definition of Rails]( https://en.wikipedia.org/wiki/Ruby_on_Rails#Technical_overview))

The [connect-controller](https://www.npmjs.com/package/connect-controller) binds any
plain controller object without requiring any dependencies of `http`, or `express`, or
anything related with web application domain, like `req.query`,  or
`res.render(viewPath, context)`, or something else. Put it simply, a _query-string_ or body parameter is just a method
argument and `resp.render(viewPath, context)` is just a continuation appended to an action method,
where the `context` is just the method result, or the content of the returned `Promise`, and `viewPath` corresponds to 
`/controllerName/actionName`, which is located inside the `views` folder by default.
If you want to bind the action parameters to the route parameters (instead of the _query-string_) 
you just need to include the parameters names in the method's name interleaved by `_` (underscores).
If your action method handles an HTTP method (i.e. verb) different from GET you just need to
prefix the name of the method with `verb_`.
Finally, if you want to take a different response other than `res.render(data)` you just need to add the
`res` parameter to the action method and do whatever you want. In this case the 
[connect-controller](https://www.npmjs.com/package/connect-controller) gets out of the way and delegates
to the action method the responsibility of sending the response.

There are additional keywords that can be used to parametrize _Actions_
following additional conventions, such as: 
   * prefix HTTP method, e.g. `get_<action name>`, `post_<action name>`, etc; 
   * `req`, `res` and `next` are reserved parameters names (optional in action arguments
   list) binding to Middleware `req`, `res` and `next`.
   * `index` reserved method name, which maps to a route corresponding to the Controller's
   name

   
## Installation

    $ npm install connnect-controller

## Usage

Given for example a controller [`football.js`](https://github.com/CCISEL/connect-controller/blob/master/example/controllers/football.js)
located in application root `/controllers`
folder you may add all `football.js` actions as routes of an express `app` just doing:

```js
const express = require('express')
const connectCtr = require('connect-controller')
const app = express()
app.use(connectCtr()) // loads all controllers located in controllers folder
/**
 * Alternatives:
 * app.use(connectCtr(path))                                  // loads from a different path
 * app.use(connectCtr(require('./controllers/football.js')))  // loads a single controller object
 * app.use(connectCtr(                                        // loads a single controller object with name soccer
 *   require('./controllers/football.js'),
 *   { name: 'soccer'} 
 * ))  
 */
```

In this case `football.js` could be for example:

```js
module.exports = (function(){
    const footballDb = require('./../db/footballDb')
    return {
        'leagues_id_table': leagues_id_table, // binds to /leagues/:id/table
        // <=> 'leagues_id_table': footballDb.leagueTable
        'leagues': leagues,                   // binds to /leagues
        'index': index                        // binds to /
    }

    /**
     * Every action parameter (e.g. id) taking part of method's name (e.g. _id_)
     * is bound to the corresponding argument of req.params (e.g. req.params.id).
     * In this case this function is useless and we could simply bound 
     * property 'leagues_id_table' to method footballDb.leagueTable.
     */
    function leagues_id_table(id){
        return footballDb.leagueTable(id)
    }
    
    /**
     * Every action parameter (e.g. name) that is NOT part of the method's name
     * is bound to the corresponding query-string argument (e.g. )
     */
    function leagues(name) {
        if(name) name = name.toLowerCase()
        return footballDb
            .leagues()
            .then(leagues => leagues
                .filter(l => !name || l.caption.toLowerCase().includes(name))
                .map(addLeaguePath))
        
        function addLeaguePath(league) {
            league.leagueHref = "/football/leagues/" + league.id + "/table"
            return league
        }
    }

    /**
     * Whenever an action receives the `res` parameter, the connect-controller
     * gets out of the way and delegates on that action the responsibility of
     * sending the response.
     * So whenever you want to do something different from the default behavior 
     * you just have to append res to your parameters.
     */
    function index(res) {
        res.redirect('/football/leagues')
    }
})()
```

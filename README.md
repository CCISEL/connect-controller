# connect-controller

[![Build](https://travis-ci.org/CCISEL/connect-controller.svg?branch=master)](https://travis-ci.org/CCISEL/connect-controller)
[![Coverage Status](https://coveralls.io/repos/github/CCISEL/connect-controller/badge.svg?branch=master)](https://coveralls.io/github/CCISEL/connect-controller?branch=master)

The [connect-controller](https://www.npmjs.com/package/connect-controller)
lets you create a connect or express middleware handler from a plain controller object.
By default, every controller method (_Action_) is mapped to a route with the path
`/controllerName/actionName`, following the server-side controller conventions
(according to the [Controller definition of Rails]( https://en.wikipedia.org/wiki/Ruby_on_Rails#Technical_overview))

The [connect-controller](https://www.npmjs.com/package/connect-controller) binds any
plain object without requiring any dependencies of `http`, or `express`, or
anything related with web application domain, like `req.query`,  or
`res.render(data)`, or something else. Put it simply, a _query-string_ parameter is just a method
argument and `resp.render(data)` is just the method returned data (`return data`), or the
content of the returned `Promise`.
If you want to bind the action parameters to the route parameters (instead of the _query-string_) 
you just need to include the parameters names in the method's name interleaved by `_` (underscores).
If your action method handles an HTTP method (i.e. verb) different from GET you just need to append the 
corresponding prefix `verb_`to the name of the method. In this case 
[connect-controller](https://www.npmjs.com/package/connect-controller) will look for the parameters
in `req.body`.
Finally, if you want to take a different response other than `res.render(data)` you just need to add the
`res` parameter to the action method and do whatever you want. In this case the 
[connect-controller](https://www.npmjs.com/package/connect-controller) gets out of the way and delegates
to the action method the responsibility of sending the response.

For instance, given a domain service `footballDb` with a promises based API, **compare** the 
two approaches of implementing a `football` route with a single action `leagueTable`.
In the following, the former example uses the `connect-controller` and the latter the express `Router`.

```js
const controller = {
  league_id_table: (id) => footballDb.leagueTable(id)
}
app.use('football', connectCtr(controller))
```  
(see full [example/controllers/football.js](https://github.com/CCISEL/connect-controller/blob/master/example/controllers/football.js))

```js
const router = express.Router()
router.get('/league/:id/table', (req, res, next) => {
  const id = req.params.id
  footballDb
      .leagueTable(id)
      .then(league => {
          res.render('football/leagueTable', league)
      })
      .catch(err => next(err))
})
app.use('football', router)
```
(see full [example/routes/football.js](https://github.com/CCISEL/connect-controller/blob/master/example/routes/football.js))

**Note** in the former example, there is no need of arguments `req`, `res`, `next`. Moreover, 
the `id` argument is automatically bound to the corresponding route parameter. You do not need
either to render the view. By default the `connectCtr` consider the view with the same name
of the action method and located in a folder `views` (and sub folder with the controller
module name). Finally you do not need to handle errors too.


Besides that there are some keywords that can be used to parametrize _Actions_
following additional conventions, such as: 
   * prefix HTTP method, e.g. `get_<action name>`, `post_<action name>`, etc; 
   * `req`, `res` and `next` are reserved parameters names (optional in action arguments
   list) binding to Middleware `req`, `res` and `next`.
   * `index` reserved method name, which maps to a route corresponding to the Controller's
   name

   
## Installation

    $ npm install connnect-controller

## Usage

Given for example a controller `forums.js` located in application root `/controller`
folder you may add all `forums.js` actions as routes of an express `app` just doing:

```js
const express = require('express')
const connectCtr = require('connect-controller')
const app = express()
app.use(connectCtr()) // loads all controllers located in controllers folder
/**
 * Alternatives:
 * app.use(connectCtr(path))                                  // loads from a different path
 * app.use(connectCtr(require('./controllers/forums.js')))    // loads a single controller object
 */
```

In this case `forums.js` could be for example:

```js
module.exports = {
  'index': index,                      // bind to /forums
  'index_id': index_id,                // bind to /forums/:id
  'index_id_members': index_id_members // bind to /forums/:id/members
}

function index(name, date) { // bind to req.query.name and req.query.date
  const ctx = {              
    title: 'Forums list',
    forums: listOfForums.filterBy(name, date)
  }
  return ctx  // <=> res.render(ctx, 'view /views/forums/index.__')
}

function index_id(id, res) { // bind to req.params.id
  const forum = forumsDb[id] 
  res.json({                 // Turns res.finished to true and suppress further responses
    'title': 'Details',
    'id': id 
  })
}

function index_id_members(id) { ... }
```

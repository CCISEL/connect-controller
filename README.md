The connect-controller let you create a connect or express middleware handler
from a plain object without requiring any dependencies of http, or express, or
anything related with web application domain, like `resp.query.someArg`,  or
`resp.send(data)`, or something else. Put it simply, `someArg` is just a method
argument and `resp.send(data)` is just the returned data (`return data`), or the
content of the returned `Promise`.

By default, every controller method (_Action_) is mapped to a route, following the
server-side controller convention (according to the
[Controller definition of Rails]( https://en.wikipedia.org/wiki/Ruby_on_Rails#Technical_overview))

Besides that there are some keywords that can be used to parametrize _Actions_
following additional conventions, such as: 
   * prefix HTTP method, e.g. `get_<action name>`, `post_<action name>`, etc; 
   * `req`, `res` and `next` are reserved parameters names (optional in action arguments
   list) mapping to Middleware `req`, `res` and `next`.
   * `index` reserved method name, which maps to a route corresponding to the Controller's
   name

   
## Installation

    $ npm install connnect-controller

## Usage

Given for example a controller `forums.js` located in application route `/controller`
folder you may add all `forums.js` actions as routes of an express `app` just doing:

```js
const express = require('express')
const connectCtr = require('connect-controller')
const app = express()
app.use(connectCtr()) // loads all controllers located in controllers folder
/**
 * Alternatives:
 * app.use(connectCtr(path)) // loads from a different path
 * app.use(connectCtr(require('./controllers/forums.js'))) // loads from a different path
 */
```

In this case `forums.js` could be defined as:

```js
module.exports = {
  'index': index,                      // bind to /forums
  'index_id': index_id,                // bind to /forums/:id
  'index_id_members': index_id_members // bind to /forums/:id/members
}

function index(name, date) { // bind to req.query.name and req.query.date
  const ctx = {              // <=> res.render(ctx, 'view /views/forums/index.__')
    title: 'Forums list',
    forums: listOfForums.filterBy(name, date)
  }
  return ctx
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
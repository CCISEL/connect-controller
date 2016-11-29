The connect-controller  let you create a connect or express middleware handler
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
   * `req`, `res` and `next` are reserved parameters names (optional in arguments
   list) mapping to Middleware `req`, `res` and `next`.
   * `index` reserved method name, which maps to a route corresponding to the Controller's
   name
   
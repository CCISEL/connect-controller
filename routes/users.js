'use strict'

const express = require('express')
const router = express.Router()
const usersDb = require('./usersDb')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users/index', { 
    title: 'Users listings',
    users: usersDb 
  })
})

router.get('/:id', function(req, res, next) {
  const user = usersDb[req.params.id]
  if(user == undefined) return next()
  res.render('users/edit', { 
    'title': 'edit',
    'user': user,
  })
})

router.get('/:id/teams', function(req, res, next) {
  const user = usersDb[req.params.id]
  res.render('users/teams', { 
    title: user.username + 'Favourite Teams',
    teams: user.teams 
  })
})


module.exports = router
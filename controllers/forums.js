'use strict'

const forumsDb = require('./forumsDb')

module.exports = {
  'index': index, // <=> get <=> get_index
  'index_id': index_id,  // <=> get_id <=> get_index_id 
  'index_id_teams': index_id_teams
}

/* GET forums listing. */
function index() {
  return { 
    title: 'Forums',
    forums: forumsDb 
  }
}

/* GET forum details. */
function index_id(id) {
  const forum = forumsDb[id]
  // To Do: if error throw error
  return { 
    title: 'Details',
    forum: forum 
  }
}

/* GET members */
function index_id_teams(id) {
  const forum = forumsDb[id]
  return { 
    title: forum.groupname + " Members",
    members: forum.members 
  }
}
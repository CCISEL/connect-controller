'use strict'

const forumsDb = require('./../db/forumsDb')

module.exports = {
  'index': index, // <=> get_index
  'index_id': index_id,  // <=> get_index_id 
  'index_id_members': index_id_members
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
function index_id_members(id) {
  const forum = forumsDb[id]
  return { 
    title: forum.groupname + " Members",
    members: forum.members 
  }
}
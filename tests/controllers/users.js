'use strict'

module.exports = {
    'groups':  function (nr, res) { res.render('viewName', nr) },
    'index': function () {return 'I am index'},
    'index_teamId': function (teamId) {return teamId}, 
    'index_id_members':  function () {return 'I am index_id_members'},
    'dummy_bastof_nr_members':  function (nr) {return nr},
    'dummy_nr_teams_xpto_str':  function (nr, arg1, arg2, str) {return {
        'nr': nr, 'arg1': arg1, 'arg2': arg2, 'str': str
    }},
    'xone_stuff': function(stuff, req, next) {
        next(req.params.stuff)
    },
    'post_xone': function(stuff) {
        return stuff
    }
}
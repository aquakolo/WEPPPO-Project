'use strict';
var express = require('express');
var router = express.Router();
let db = require('../dboperations');

/* GET users listing. */
router.get('/', function (req, res, next) {
    if (req.session.admin) {
        db.getAllUsers()
            .then(users => {
                res.render('users', {
                    title: 'Użytkownicy',
                    session: req.session,
                    users
                });
            });
    } else {
        res.redirect('/');
    }
});

module.exports = router;

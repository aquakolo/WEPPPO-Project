'use strict';
var express = require('express');
var router = express.Router();
let db = require('../dboperations');
const bcrypt = require('bcrypt');

router.get('/', function (req, res, next) {
    if (req.session.valid) {
        res.redirect('/');
    }
    res.render('login', { title: 'Login', session: req.session });
});

router.post('/', (req, res) => {
    username = req.body.username;
    password = req.body.password;
    db.findUser(username).then(user => {
        if (user) {
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (isMatch) {
                    req.session.user = user.username;
                    req.session.userid = user.id;
                    req.session.admin = user.admin;
                    req.session.valid = true;
                    req.session.cart = {};
                    req.session.amount = 0;
                    res.redirect('/');
                } else {
                    console.log(err);
                    res.render('login', {
                        title: 'Błędne hasło lub nazwa użytkownika',
                        session: req.session
                    });
                }
            })
        } else {
            res.render('login', {
                title: 'Błędne hasło lub nazwa użytkownika',
                session: req.session
            })
        }
    })
})

module.exports = router;
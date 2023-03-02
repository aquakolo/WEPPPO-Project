let express = require('express');
let router = express.Router();
let db = require('../dboperations');

router.get('/', function (req, res, next) {
    if (req.session.valid) {
        res.redirect('/');
    }
    res.render('login', { title: 'Logowanie', session: req.session });
});

router.post('/', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    db.findUser(username).then(user => {
        let error = [];
        if (user[0]) {
            if (password == user[0].password) {
                req.session.user = user[0].username;
                req.session.userid = user[0].Id;
                req.session.admin = user[0].admin;
                req.session.valid = true;
                req.session.amount = 0;
                res.redirect('/');
            } else {
                error.push({ msg: 'Błędne hasło lub nazwa użytkownika' });
                res.render('login', {
                    title: 'Logowanie',
                    session: req.session,
                    error
                });
            }
        } else {
            error.push({ msg: 'Błędne hasło lub nazwa użytkownika' });
            res.render('login', {
                title: 'Logowanie',
                session: req.session,
                error
            })
        }
    })
})

module.exports = router;
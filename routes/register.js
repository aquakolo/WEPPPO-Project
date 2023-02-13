let express = require('express');
let router = express.Router();
let db = require('../dboperations');
let bcrypt = require('bcrypt');
let User=require("../model/user");

router.get('/', function (req, res, next) {
    if (req.session.valid) {
        res.redirect('/');
    }
    res.render('register', { title: 'Zarejestruj', session: req.session });
});

router.post('/', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log(username);
    let errors = [];
    if (!username || !password) {
        errors.push({ msg: 'Uzypełnij login i hasło' });
    }
    if (password.length < 6) {
        errors.push({ msg: 'Hasło musi zawierać 6 liter/cyfr/znaków' });
    }
    if (errors.length > 0) {
        res.render('register', {
            title: 'Zarejestruj',
            session: req.session,
            errors
        })
    } else {    
        db.findUser(username).then(user => {
            if (user[0]) {
                errors.push({ msg: 'Nazwa użytkownika jest zajęta' });
                res.render('register', {
                    title: 'Zajerestruj',
                    session: req.session,
                    errors
                });
            } else {
                var newUser = new User({
                    username: username,
                    password: password,
                    admin: false,
                    card: 1
                });
                db.addUser(newUser);
                res.redirect('/login');
            }
        });
    }
})

module.exports = router;
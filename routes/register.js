let express = require('express');
let router = express.Router();
let db = require('../dboperations');
let bcrypt = require('bcrypt');

router.get('/', function (req, res, next) {
    if (req.session.valid) {
        res.redirect('/');
    }
    res.render('register', { title: 'Zarejestruj', session: req.session });
});

router.post('/', (req, res) => {
    const { username, password } = req.body;
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
                console.log(user);
                errors.push({ msg: 'Nazwa użytkownika jest zajęta' });
                res.render('register', {
                    title: 'Zajerestruj',
                    session: req.session,
                    errors
                });
            } else {
                let admin = false;
                const newUser = new User({
                    username,
                    password,
                    admin
                })

                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.redirect('/login'));
                }))
            }
        });
    }
})

module.exports = router;
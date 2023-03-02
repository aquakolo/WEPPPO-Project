'use strict';
var express = require('express');
var router = express.Router();
let db = require('../dboperations');

router.get('/details/:id', (req, res, next) => {
    db.getProduct(req.params.id).then(product => {
        if (product.length<1) res.send('<h1>404</h1>');
        res.render('product', {
            title: "Szczegóły",
            product: product[0],
            session: req.session
        });
    });
});

router.get('/add', (req, res, next) => {
    if (req.session.admin) {
        res.render('addproduct', { title: 'Dodaj produkt', session: req.session });
    } else {
        res.redirect('/')
    }
});

router.post('/add', (req, res) => {

    var title = req.body.title;
    var description = req.body.description;
    var image = "/images/" + req.body.image;
    var value = req.body.value;
    let errors = [];
    if (req.session.admin) {
        if (!title || !value) {
            errors.push({ msg: 'Uzupełnij nazwę i cenę' });
        }
        if (errors.length > 0) {
            res.render('addproduct', {
                title: 'Dodaj produkt',
                session: req.session,
                errors
            });
        } else {
            db.addProduct({
                title: title,
                description: description,
                value: value,
                image: image,
                status: 1
            }).then(p => {
                res.redirect('/');
            });
        }
    } else {
        res.redirect('/');
    }
});

router.get('/remove/:id', (req, res, next) => {
    if (req.session.admin) {
        db.deleteProduct(req.params.id).then(() => {
            res.redirect('/');
        })
    } else {
        res.redirect('/');
    }
});

router.get('/edit/:id', function (req, res, next) {
    if (req.session.admin) {
        db.getProduct(req.params.id).then(p => {
            if (p) {
                console.log(p);
                res.render('editproduct', {
                    title: 'Edytuj produkt',
                    product: p,
                    session: req.session
                });
            } else {
                res.redirect('/');
            }
        });
    } else {
        res.redirect('/')
    }
});

router.post('/edit/:id', (req, res) => {
    const { title, description, value, image } = req.body;
    let errors = [];
    if (req.session.admin) {
        if (!title || !image || !value) {
            errors.push({ msg: 'Uzupełnij nazwę, cenę i URL obrazka' });
        }
        db.getProduct(req.params.id).then(product => {
            if (product) {
                product.title = title;
                product.image = image;
                product.description = description;
                product.value = value;

                product.save()
                    .then(p => res.redirect('/'));
            } else {
                errors.push({ msg: 'Nie znaleziono produktu' });
            }
            if (errors.length > 0) {
                res.render('editproduct', {
                    title: 'Edytuj produkt',
                    product: product,
                    session: req.session
                });
            }
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;
'use strict';
var express = require('express');
var router = express.Router();
let db = require('../dboperations');

router.get('/details/:id', (req, res, next) => {
    db.getProduct(req.params.id).then(p => {
        if (!p) res.send('<h1>404</h1>');
        res.render('product', {
            title: "p.title",
            products: [p],
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
    const { title, description, value,image} = req.body;
    let errors = [];
    if (req.session.admin) {
        if (!title || !image || !value) {
            errors.push({ msg: 'Uzupełnij nazwę, cenę i URL obrazka' });
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
                image: image
            }).then(p => res.redirect('/product/details/' + p.id));
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
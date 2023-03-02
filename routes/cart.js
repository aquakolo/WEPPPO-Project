'use strict';
var express = require('express');
const { findProductInOrder, deleteProductFromOrder } = require('../dboperations');
var router = express.Router();
let db = require('../dboperations');

router.get('/', (req, res, next) => {
    res.redirect('/cart/checkout');
});

router.get('/add/:id', (req, res, next) => {
    if (!req.session.valid) {
        res.redirect('/login');
    }
    let productId = req.params.id;
    db.findUser(req.session.user).then(user => {
        let orderId = user[0].cartID;
        db.addProductToOrder(productId, orderId).then(() => {
            res.redirect('/cart/checkout');
        });
    });

});

router.get('/remove/:id', (req, res, next) => {
    if (!req.session.valid) {
        res.redirect('/login');
    }
    let productId = req.params.id;
    db.findUser(req.session.user).then(user => {
        let orderId = user[0].cartID;
        db.deleteProductFromOrder(productId, orderId).then(() => {
            res.redirect('/cart/checkout');
        });
    });
    
});

router.get('/checkout', (req, res, next) => {
    if (req.session.valid) {
        db.findUser(req.session.user).then(user => {
            db.getOrder(user[0].cartID).then(order => {
                db.getProductsfromOrder(order[0].Id).then(products => {
                    res.render('cart', {
                        title: 'Wózek',
                        products: products,
                        order: order[0],
                        session: req.session,
                    });
                });
            });
        });
    } else {
        res.redirect('/login');
    }
});


router.get('/make_order', (req, res, next) => {
    if (req.session.valid) {
        db.findUser(req.session.user).then(user => {
            db.getOrder(user[0].cartID).then(order => {
                if (order[0].sumValue > 0)
                    db.saveCart(user[0].cartID).then(() => {
                        res.redirect('/orders');
                    });
                else
                    res.redirect('/cart/checkout');
            });
        })
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
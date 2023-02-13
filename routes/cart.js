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
    let orderId = db.findUser(req.session.username).cartID;
    db.addProductToOrder(productId, orderId);
    res.redirect('/cart/checkout');
});

router.get('/remove/:id', (req, res, next) => {
    if (!req.session.valid) {
        res.redirect('/login');
    }
    let productId = req.params.id;
    let orderId = db.findUser(req.session.username).cartID;
    if (productId)
        if (findProductInOrder(productId, orderId)) {
            deleteProductFromOrder(productId, orderId);
        }
    res.redirect('/cart/checkout');
});

router.get('/checkout', (req, res, next) => {
    if (req.session.valid) {
        let order = db.findUser(req.session.username);
        db.getProductsfromOrder(order.Id).then(products => {
            res.render('cart', {
                title: 'Wózek',
                products: products,
                order: order,
                session: req.session,
            });
        });
    } else {
        res.redirect('/login');
    }
});


router.get('/make_order', (req, res, next) => {
    let session = req.session;
    if (session.valid) {
        db.findUser(req.session.username).then(user => {
            db.getOrder(user.cartID).value.then(value => {
                if (value > 0)
                    db.saveCart(user.cartID).then(() => {
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
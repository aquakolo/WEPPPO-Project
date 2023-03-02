var express = require('express');
var router = express.Router();
let db = require('../dboperations');

/* GET orders listing. */
router.get('/', function (req, res, next) {
    if (req.session.admin) {
        db.getAllOrders()
            .then(orders => {
                res.render('orders', {
                    title: 'Wszystkie Zamówienia',
                    session: req.session,
                    orders
                });
            });
    } else if (req.session.valid) {
        db.getUserOrders(req.session.userid)
            .then(orders => {
                res.render('orders', {
                    title: 'Twoje Zamówienia',
                    session: req.session,
                    orders
                });
        });
    } else {
        res.redirect('/login');
    }
});

router.get('/:id', function (req, res, next) {
    let id = req.params.id;
    if (req.session.valid) {
        db.getOrder(id).then(order => {
            db.getProductsfromOrder(order[0].Id).then(products => {
                    res.render('cart', {
                        title: 'Wózek',
                        products: products,
                        order: order[0],
                        session: req.session,
                    });
             });
        });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;

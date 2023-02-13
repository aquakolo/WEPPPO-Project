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
        db.getUserOrders(req.session.userId)
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

router.get('/:id', (req, res, next) => {
    let order = db.getOrder(id);
        db.getProductsfromOrder(id).then(products => {
            res.render('order', {
                title: 'Zamówienie',
                products: products,
                order: order,
                session: req.session,
            });
        });
});

module.exports = router;

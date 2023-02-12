'use strict';
var express = require('express');
var router = express.Router();
let db = require('../dboperations');

/* GET home page. */
router.get('/', function (req, res) {
    db.getVisibleProducts()
        .then(products =>
            res.render('index',
                {
                    title: 'WEPPO Shop',
                    products,
                    session: req.session
                }))
        .catch(err => console.log(err));
});

module.exports = router;

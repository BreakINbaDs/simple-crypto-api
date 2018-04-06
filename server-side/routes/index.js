var express = require('express');
var router = express.Router();

var db = require('../queries');


router.get('/getCoin/:id', db.getCoin);
router.get('/addCoin', db.addCoin);
router.get('/removeCoin', db.removeCoin);
router.get('/getPrices/:id', db.getCoinsPrices);
  
module.exports = router;

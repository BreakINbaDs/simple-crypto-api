var promise = require('bluebird');
const request = require('request');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/cryptodb';
var db = pgp(connectionString);

// add query functions

module.exports = {
  getCoin: getCoin,
  addCoin: addCoin,
  removeCoin: removeCoin,
  updatePrices: updatePrices,
  getCoinsPrices: getCoinsPrices
};


///////////////______ADD____COIN________//////////////////
function addCoin(req, res, next){

  var userID = req.param('user_id');
  var code = req.param('code');
  var price = myCache.get(code);


  db.none('insert into coins(user_id, code, price)' +
    'values($1, $2, $3)',
  [userID, code, price.EUR])
  .then(function () {
    res.status(200)
      .json({
        status: 'success',
        message: 'Inserted one coin',
        price: price.EUR
      });
  })
  .catch(function (err) {
    return next(err);
  });

}


///////////////______GET____COIN________//////////////////
function getCoin(req, res, next){

	var userID = parseInt(req.params.id);

  	db.any('select * from coins where user_id = $1 order by id', userID)
  		.then(function (data) {
      		res.status(200)
        		.json({
		          status: 'success',
		          data: data,
		          message: 'Retrieved  User coins'
        		});
    	})
    	.catch(function (err) {
      		return next(err);
    	});
}


///////////////_________GET_____PRICES______/////////////////
function getCoinsPrices(req, res, next){

	var userID = parseInt(req.params.id);

  	db.any('select prices from coins where user_id = $1 order by id', userID)
  		.then(function (data) {
      		res.status(200)
        		.json({
		          status: 'success',
		          data: data,
		          message: 'Retrieved  User coins'
        		});
    	})
    	.catch(function (err) {
      		return next(err);
    	});
}

///////////////______DELETE____COIN________//////////////////
function removeCoin(req, res, next){

  var userID = req.param('user_id');
  var code = req.param('code');


  	db.none('delete from coins where user_id = $1 and code = $2', [userID, code])
  		.then(function (data) {
      		res.status(200)
        		.json({
		          status: 'success',
		          message: 'Coin deleted'
        		});
    	})
    	.catch(function (err) {
      		return next(err);
    	});
}

///////////////______UPDATE____COIN________//////////////////
function updateCoin(code){
  request('https://min-api.cryptocompare.com/data/price?fsym='+code+'&tsyms=EUR', { json: true }, (err, res, body) => {
    if (err)
      res.send(err);
    db.any('update coins set price=$1 ' +
      'where code = $2',
    [body.EUR, code]).catch(function (err) {
        return next(err);
    });
  });
}

///////////////_________CACHE_____PRICES_________////////////
function collectPrices(){
  request('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP,BCH,ADA,XLM,NEO,LTC,EOS,XEM&tsyms=EUR',
  { json: true }, (err, res, body) => {
      if (err)
        res.send(err);
      var keys = Object.keys(body);
      var i = 0;
      for (elem in body){
        success = myCache.set( keys[i], body[elem], 300 );
        if (success)
          i++;
      }
  });
}

/////////////////______UPDATE____PRICES_______///////////////
function updatePrices(){
  console.log('Starting update prices!');
  collectPrices();
  db.any('select distinct code from coins').then(function(data){
    for (elem in data){
      updateCoin(data[elem].code.toString());
    }
  }).catch(function (err) {
      return next(err);
  });
}

// Generated by LiveScript 1.5.0
(function(){
  var request, cheerio, bigNumber;
  request = require('request');
  cheerio = require('cheerio');
  bigNumber = require('big.js');
  module.exports = function(key, callback){
    return request("https://blockchain.info/address/" + key, function(err, response){
      var $, tr;
      if (err != null) {
        return callback(null);
      }
      $ = cheerio.load(response.body);
      tr = $('#final_balance span').html().replace(/[^0-9.]/g, "");
      callback(bigNumber(tr));
    });
  };
}).call(this);

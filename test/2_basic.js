// Generated by LiveScript 1.5.0
(function(){
  var main, bigNumber, p, expect, slice$ = [].slice;
  main = require('../main/main.js');
  bigNumber = require('big.js');
  p = require('prelude-ls');
  expect = require('expect');
  describe('Basic', function(){
    it('exists', function(){
      var i$, ref$, len$, coin, provider, results$ = [];
      for (i$ = 0, len$ = (ref$ = ['eth', 'btc', 'ltc']).length; i$ < len$; ++i$) {
        coin = ref$[i$];
        provider = main.newAddr[coin];
        expect(provider().address).toBeA("string", "Not string Address " + coin);
        results$.push(expect(provider().privateKey).toBeA("string", "Not string Private Key " + coin));
      }
      return results$;
    });
    it('unique', function(){
      var i$, ref$, len$, coin, provider, results$ = [];
      for (i$ = 0, len$ = (ref$ = ['eth', 'btc', 'ltc']).length; i$ < len$; ++i$) {
        coin = ref$[i$];
        provider = main.newAddr[coin];
        expect(provider().address).toNotBe(provider().address, "Not unique Private Key " + coin);
        results$.push(expect(provider().privateKey).toNotBe(provider().privateKey, "Not unique Private Key " + coin));
      }
      return results$;
    });
    it('valid', function(){
      var i$, ref$, len$, coin, provider, ref1$, address, privateKey, valid, message, signature, results$ = [];
      for (i$ = 0, len$ = (ref$ = ['eth', 'btc', 'ltc']).length; i$ < len$; ++i$) {
        coin = ref$[i$];
        provider = main.newAddr[coin];
        ref1$ = provider(), address = ref1$.address, privateKey = ref1$.privateKey;
        valid = provider.verify(address);
        expect(valid).toBe(true, "Invalid Ethereum Address " + coin);
        message = "Test Message";
        signature = main.sign[coin].sign(message, privateKey);
        results$.push(expect(main.sign[coin].verify(message, address, signature)).toBe(true));
      }
      return results$;
    });
    it('balance', function(done){
      var accs, checkBalance, checkBalances;
      this.timeout(15000);
      accs = {
        eth: {
          address: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
          balance: bigNumber("802672.276608465139479303")
        },
        ltc: {
          address: "34Ae29qWAhGGTw3cSNkPygiwsgKbbCatou",
          balance: bigNumber("402474.2484")
        },
        btc: {
          address: '1HQ3Go3ggs8pFnXuHVHRytPCq5fGG8Hbhx',
          balance: bigNumber("69370.10701994")
        }
      };
      checkBalance = function(coin, callback){
        var acc, provider;
        acc = accs[coin];
        provider = main.balance[coin];
        return provider(acc.address, function(balance){
          var err;
          try {
            expect(balance).toNotBe(null, "Balance is null for " + coin);
            expect(balance.eq(acc.balance)).toBe(true, "real balance " + balance.toString() + " is not expected " + acc.balance.toString() + " for " + coin);
          } catch (e$) {
            err = e$;
            console.log(err);
          }
          callback();
        });
      };
      checkBalances = function(coins, callback){
        if (coins.length === 0) {
          return callback();
        }
        return checkBalance(coins[0], function(){
          var tail;
          tail = p.tail(
          coins);
          if (tail.length === 0) {
            return callback();
          }
          checkBalances(tail, function(){
            callback();
          });
        });
      };
      checkBalances(['eth', 'btc', 'ltc'], function(){
        console.log('done');
        done();
      });
    });
    return it('rates', function(done){
      var coins, checkRate, checkRates;
      this.timeout(5000);
      coins = ['eth', 'btc', 'ltc'];
      checkRate = function(coin, callback){
        var provider;
        provider = main.rate[coin];
        return provider(function(rate){
          expect(rate).toBeA('number');
          callback(rate);
        });
      };
      checkRates = function(coins, callback){
        var head, tail;
        head = coins[0], tail = slice$.call(coins, 1);
        return checkRate(head, function(){
          if (tail.length === 0) {
            return callback();
          }
          checkRates(tail, callback);
        });
      };
      return checkRates(coins, done);
    });
  });
}).call(this);

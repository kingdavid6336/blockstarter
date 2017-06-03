require! { 
    expect 
    \../main/main.js
    \big.js
    \prelude-ls : \p
    \moment
}

all-coins = [\eth, \btc, \ltc]

run <-! describe \Rate

_ = JSON.stringify

d = (date)->
    moment(date, "YYYY-MM-DD HH:mm").to-date!.get-time! / 1000

it \rate-history-0, (done)->
  @timeout 25000
  err, result <-! main.rate-history d "2017-05-28 4:30"
  expect _ result .to-be _ { ETH: { BTC: '0.07846300', CHF: '167.00000000' } }
  done!

it \rate-history-1, (done)->
  @timeout 15000
  err, result <-! main.rate-history d "2017-05-30 4:30"
  expect _ result .to-be _ { ETH: { BTC: '0.08900010', CHF: '199.50000001' } }
  done!

it \rate-history-2, (done)->
  @timeout 15000
  err, result <-! main.rate-history d "2017-06-01 4:30"
  expect _ result .to-be _ { ETH: { BTC: '0.09699600', CHF: '219.46044850' } }
  done!

it \rate-history-3, (done)->
  @timeout 15000
  err, result <-! main.rate-history d "2017-06-01 22:30"
  expect _ result .to-be _ { ETH: { BTC: '0.09276898', CHF: '211.50000000' } }
  done!

it \rate-history-3-duplicate, (done)->
  @timeout 15000
  err, result <-! main.rate-history d "2017-06-01 22:30"
  expect _ result .to-be _ { ETH: { BTC: '0.09276898', CHF: '211.50000000' } }
  done!

it \rate-history-4, (done)->
  @timeout 8000
  err, result <-! main.rate-history d "2017-06-01 23:30"
  expect _ result .to-be _ { ETH: { BTC: '0.09198971', CHF: '211.30000058' } }
  done!

it \rate-history-4-duplicate, (done)->
  @timeout 8000
  err, result <-! main.rate-history d "2017-06-01 23:30"
  expect _ result .to-be _ { ETH: { BTC: '0.09198971', CHF: '211.30000058' } }
  done!
  
  
it \rate-history-smarter-1, (done)->
  @timeout 8000
  run = (count, cb)->
      err, result <-! main.rate-history.smarter d "2017-06-01 23:30"
      expect _ result .to-be _ { ETH: { BTC: '0.09198971', CHF: '211.30000058' } }
      next-count = count - 1
      return cb err, result if next-count is 0
      err, next-result <-! run next-count
      expect _ result .to-be _ next-result
      cb err, result
      
  err, result <-! run 50
  done!

it \rates-cryptocompare, (done)->
  @timeout 5000
  coins = all-coins
  check-rate = (coin, cb)->
      provider = main.rate[coin]
      err, rate <-! provider!
      expect err .to-be null
      expect rate .to-be-a \number
      cb null, rate
  check-rates = ([head, ...tail], cb)->
    return cb null if not head?
    err <-! check-rate head
    expect(err).to-be null
    check-rates tail, cb
  check-rates coins, done
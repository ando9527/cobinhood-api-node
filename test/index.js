import test from 'ava'
import dotenv from 'dotenv'

import Cobinhood from 'index'
import { candleFields } from 'http'
import { userEventHandler } from 'websocket'

import { checkFields } from './utils'

dotenv.load()

const client = Cobinhood()

/**System
 * https://cobinhood.github.io/api-public/#system
 */

// test.serial('[REST][System] Get System Time', async t => {
//   const ts = await client.systemTime()
//   t.truthy(new Date(ts).getTime() > 0, 'The returned timestamp should be valid')
// })

// test.serial('[REST][System] Get System Information', async t => {
//   const res = await client.systemInfo()
//   t.is(res.success, true)
// })

/**Market
 * https://cobinhood.github.io/api-public/#market
 */

// test.serial('[REST][Market] Get All Currencies', async t => {
//   const res = await client.allCurrencies()
//   t.is(res.success, true)
// })

// test.serial('[REST][Market] Get All Trading Pairs', async t => {
//     const res = await client.allTradingPairs()
//     t.is(res.success, true)
// })

// test.serial('[REST][Market] Get Order Book', async t => {
//     try {
//         await client.orderBooks()
//       } catch (e) {
//         t.is(e.message, 'Method orderBooks requires trading_pair_id parameter.')
//     }
//     try {
//         await client.orderBooks({})
//       } catch (e) {
//         t.is(e.message, 'Method orderBooks requires trading_pair_id parameter.')
//     }

//     const book = await client.orderBooks({trading_pair_id: 'EOS-ETH'})
//     t.truthy(book.asks.length)
//     t.truthy(book.bids.length)
  
//     const [bid] = book.bids
//     t.truthy(typeof bid.price === 'string')
//     t.truthy(typeof bid.count === 'string')
//     t.truthy(typeof bid.size === 'string')
// })

// test.serial('[REST][Market] Get Trading Statistics', async t => {
//     const res = await client.marketState()
//     t.is(res.success, true)
// })

// test.serial('[REST][Market] Get Ticker', async t => {
//     const res = await client.systemInfo()
//     checkFields(t, res, ['success', 'result'])
// })

// test.serial('[REST][Market] Get Recent Trades', async t => {
//     const res = await client.systemInfo()
//     checkFields(t, res, ['success', 'result'])
// })


// test.serial('[REST] book', async t => {
//   try {
//     await client.book()
//   } catch (e) {
//     t.is(e.message, 'You need to pass a payload object.')
//   }

//   try {
//     await client.book({})
//   } catch (e) {
//     t.is(e.message, 'Method book requires trading_pair_id parameter.')
//   }

//   const book = await client.book({ trading_pair_id: 'ETH-USD' })
//   t.truthy(book.asks.length)
//   t.truthy(book.bids.length)

//   const [bid] = book.bids
//   t.truthy(typeof bid.price === 'string')
//   t.truthy(typeof bid.quantity === 'string')
//   t.truthy(typeof bid.count === 'string')
// })

// none in cobinhood
// test.serial('[REST] candles', async t => {
//   try {
//     await client.candles({})
//   } catch (e) {
//     t.is(e.message, 'Method candles requires symbol parameter.')
//   }

//   const candles = await client.candles({ symbol: 'ETHBTC' })

//   t.truthy(candles.length)

//   const [candle] = candles
//   checkFields(t, candle, candleFields)
// })
    //none in cobinhood
// test.serial('[REST] aggTrades', async t => {
//   try {
//     await client.aggTrades({})
//   } catch (e) {
//     t.is(e.message, 'Method aggTrades requires symbol parameter.')
//   }

//   const trades = await client.aggTrades({ symbol: 'ETHBTC' })
//   t.truthy(trades.length)

//   const [trade] = trades
//   t.truthy(trade.aggId)
// })

// done
// test.serial('[REST] trades', async t => {
//   const trades = await client.trades({ trading_pair_id: 'ETH-USD' })
//   t.is(trades.result.trades.length, 50)
// })


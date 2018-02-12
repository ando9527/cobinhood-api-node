import test from 'ava'

import Binance from 'index'

import { checkFields } from './utils'

const client = Binance({
  apiSecret: process.env.COBINHOOD_API_SECRET2,
})

// test.serial('[REST] order', async t => {
//   await client.orderTest({
//     symbol: 'ETHBTC',
//     side: 'BUY',
//     quantity: 1,
//     price: 1,
//   })

//   await client.orderTest({
//     symbol: 'ETHBTC',
//     side: 'BUY',
//     quantity: 1,
//     type: 'MARKET',
//   })

//   t.pass()
// })

/**DONE */
// test.serial('[REST] allOrders / getOrder', async t => {
//   try {
//     await client.getOrder({})
    
//   } catch (e) {
//     t.is(
//       e.message,
//       "Param 'origClientOrderId' or 'orderId' must be sent, but both were empty/null!",
//     )
//   }
//   t.pass()
// })


  // try {
  //   await client.getOrder({ symbol: 'ETHBTC', orderId: 1 })
  // } catch (e) {
  //   t.is(e.message, 'Order does not exist.')
  // }

  // // Note that this test will fail if you don't have any ENG order in your account ;)
  // const orders = await client.allOrders({
  //   symbol: 'ENGETH',
  // })

  // t.true(Array.isArray(orders))
  // t.truthy(orders.length)

  // const [order] = orders

  // checkFields(t, order, ['orderId', 'symbol', 'price', 'type', 'side'])

  // const res = await client.getOrder({
  //   symbol: 'ENGETH',
  //   orderId: order.orderId,
  // })

  // t.truthy(res)
  // checkFields(t, res, ['orderId', 'symbol', 'price', 'type', 'side'])
  // })

// test.serial('[REST] getOrder with useServerTime', async t => {
//   const orders = await client.allOrders({
//     symbol: 'ENGETH',
//     useServerTime: true,
//   })

//   t.true(Array.isArray(orders))
//   t.truthy(orders.length)
// })

// test.serial('[REST] openOrders', async t => {
//   const orders = await client.openOrders({
//     symbol: 'ETHBTC',
//   })

//   t.true(Array.isArray(orders))
// })

// test.serial('[REST] cancelOrder', async t => {
//   try {
//     await client.cancelOrder({ symbol: 'ETHBTC', orderId: 1 })
//   } catch (e) {
//     t.is(e.message, 'UNKNOWN_ORDER')
//   }
// })

// test.serial('[REST] accountInfo', async t => {
//   const account = await client.accountInfo()
//   t.truthy(account)
//   checkFields(t, account, ['makerCommission', 'takerCommission', 'balances'])
//   t.truthy(account.balances.length)
// })



// test.serial('[REST] myTrades', async t => {
//   const trades = await client.myTrades({ id })
//   console.log(trades);
  
//   t.true(Array.isArray(trades))
//   const [trade] = trades
//   // checkFields(t, trade, ['id', 'orderId', 'qty', 'commission', 'time'])
// })

//DONE
// test.serial('[REST] tradesHistory', async t => {
//   // const trades = await client.tradesHistory({ symbol: 'ETHBTC', fromId: 28457 })
//   const trades = await client.tradesHistory({ symbol: 'BDG-ETH', limit: 5 })
//   t.is(trades.result.trades.length, 5)
// })


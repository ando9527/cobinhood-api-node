import test from 'ava'

import Cobinhood from 'index'

import { checkFields } from './utils'

const client = Cobinhood({
  apiSecret: process.env.COBINHOOD_API_SECRET,
})
//Done
// test.serial('[REST] order', async t => {
//   try{
//     await client.order({
//       trading_pair_id: 'ETHBTC',
//       side: 'bid',
//       quantity: 1,
//       type: 'FAPFAP',
//     })
//   }catch(e){
//     t.is(
//       e.message,
//       "Order type should be MARKET/LIMIT/STOP/STOP_LIMIT/TRAILING_STOP/FILL_OR_KILL",
//     )
//   }
//   await client.order({
//     trading_pair_id: 'EOS-ETH',
//     side: 'bid',
//     type: 'limit',
//     price: '0.000111',
//     size: '100'
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
//     let kk = await client.cancelOrder({ order_id: '777bbb84-f1ad-44df-9bc2-3cc33cd62299' })
//     console.log(kk);
    
//   } catch (e) {
//     t.is(e.message, 'UNKNOWN_ORDER')
//   }
//   t.pass()
// })

// test.serial('[REST] cancelOrder', async t => {
//   try {
//     let kk = await client.modifyOrder({ order_id: 'eacca07b-7429-49c4-bd37-862246815e88' })
//     console.log(kk);
    
//   } catch (e) {
//     t.is(e.message, 'UNKNOWN_ORDER')
//   }
//   t.pass()
// })

// Done
// test.serial('[REST] accountInfo', async t => {
//   const account = await client.accountInfo({currency:'EOS', limit:10})
//   t.truthy(account)
//   checkFields(t, account.result.ledger[0], ['currency', 'balance', 'timestamp'])
//   t.truthy(account.result.ledger)
// })


// DONE
// test.serial('[REST] myTrades', async t => {
//   const trades = await client.myTrades({ trade_id: '1995697c-b7a2-4a66-8b7b-bb610cb36130' })
  
//   checkFields(t, trades.result.trade, ['ask_order_id', 'bid_order_id', 'id', 'price', 'size'])
// })

//DONE
// test.serial('[REST] tradesHistory', async t => {
//   // const trades = await client.tradesHistory({ symbol: 'ETHBTC', fromId: 28457 })
//   const trades = await client.tradesHistory({ trading_pair_id: 'BDG-ETH', limit: 5 })
   
//   t.is(trades.result.trades.length, 5)
// })


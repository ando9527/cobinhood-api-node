import test from 'ava'
import dotenv from 'dotenv'
import Cobinhood from 'index'

import { checkFields } from './utils'
dotenv.load()
const client = Cobinhood({
  apiSecret: process.env.COBINHOOD_API_SECRET,
})


/**
 * Trading [AUTH]
 * https://cobinhood.github.io/api-public/#traiding
 */

test.serial('[REST][AUTH] Get information for a single order', async t => {  
    try {
      const mo = await client.myOrderId({order_id: 'a9201323-c50a-4658-9b03-e23a93ece7800'})
      t.is(mo.success, true)
      
    } catch (e) {
      t.is(e.message, 'Order does not exist.')
    }
})

// TODO
// test.serial('[REST][AUTH] Get Trades of An Order', async t => {  
// })

// test.serial('[REST][AUTH] All of My Orders', async t => {

//   const mo = await client.myOrderSymbol({trading_pair_id: 'EOS-ETH', limit: '5'})
//   console.log(mo)
//   t.is(mo.success, true)

// })
test.serial('[REST][AUTH] All of My Orders', async t => {
  const mo = await client.myOrderSymbol({limit: '5'})
  t.is(mo.success, true)

})


// // **size should be larger
// test.serial('[REST][AUTH] order & modifyOrder &cancelOrder', async t => {
//   try{
//     await client.order({
//       trading_pair_id: 'ETHBTC',
//       side: 'bid',
//       price: '0.00011',
//       size: '1',
//       quantity: '1',
//       type: 'FAPFAP',
//     })
//   }catch(e){
//     t.is(
//       e.message,
//       "Order type should be MARKET/LIMIT/STOP/STOP_LIMIT/TRAILING_STOP/FILL_OR_KILL",
//     )
//   }
//   const order = await client.order({
//     trading_pair_id: 'EOS-ETH',
//     side: 'bid',
//     type: 'limit',
//     price: '0.000111',
//     size: '100'
//   })
  
//   try {
//     const modify = await client.modifyOrder({ order_id: order.result.order.id, trading_pair_id: 'EOS-ETH', price:'0.000110', size: '105'})
//     t.is(modify.success, true)

//   } catch (e) {
//     t.is(e.message, 'UNKNOWN_ORDER')
//   }

//   try {
//     const del = await client.cancelOrder({ order_id: order.result.order.id })
//     t.is(del.success, true)
    
//   } catch (e) {
//     t.is(e.message, 'UNKNOWN_ORDER')
//   }

//   t.pass()
// })

// test.serial('[REST][AUTH] Get trade information. A user only can get their own trade.', async t => {
//     try {
//       const mo = await client.myTrade({trade_id: '1995697c-b7a2-4a66-8b7b-bb610cb361300'})
//       t.is(mo.success, true)
//     } catch (e) {
//       t.is(e.message, 'Trade does not exist.')
//     }
// })

// test.serial('[REST][AUTH] Get Trade History.', async t => {
//     const mo = await client.myTradeHistory({trading_pair_id: 'COB-USD', limit: '5'})
//     t.is(mo.success, true)
// })

// /**
//  * Wallet [AUTH]
//  * https://cobinhood.github.io/api-public/#wallet
//  */

// test.serial('[REST][AUTH] Get balances of the current user', async t => {
//   const mo = await client.balances()
//   t.is(mo.success, true)
// })

// test.serial('[REST][AUTH] Get balance history for the current user', async t => {
//   const mo = await client.balanceHistory({currency: 'EOS', limit: '5'})  
//   t.is(mo.success, true)
// })



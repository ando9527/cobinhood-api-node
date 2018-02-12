import crypto from 'crypto'
import zip from 'lodash.zipobject'

import 'isomorphic-fetch'

const BASE = 'https://api.cobinhood.com'

/**
 * Build query string for uri encoded url based on json object
 */
const makeQueryString = q =>
  q
    ? `?${Object.keys(q)
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(q[k])}`)
        .join('&')}`
    : ''

/**
 * Finalize APi response
 */
const sendResult = call =>
  call.then(res => Promise.all([res, res.json()])).then(([res, json]) => {
    if (!res.ok) {
      throw new Error(json.msg || `${res.status} ${res.statusText}`)
    }

    return json
  })

/**
 * Util to validate existence of required parameter(s)
 */
const checkParams = (name, payload, requires = []) => {
  if (!payload) {
    throw new Error('You need to pass a payload object.')
  }

  requires.forEach(r => {
    if (!payload[r] && isNaN(payload[r])) {
      throw new Error(`Method ${name} requires ${r} parameter.`)
    }
  })

  return true
}


/**
 * Make public calls against the api
 *
 * @param {string} path Endpoint path
 * @param {object} data The payload to be sent
 * @param {string} method HTTB VERB, GET by default
 * @param {object} headers
 * @returns {object} The api response
 */
const publicCall = (path, data, method = 'GET', headers = {}) =>{
  console.log(`${BASE}${path}${makeQueryString(data)}`);
  console.log('method', method);
  console.log('headers', headers);
  return sendResult(
    fetch(`${BASE}${path}${makeQueryString(data)}`, {
      method,
      json: true,
      headers,
    }),
  )
}

/**
 * Factory method for partial private calls against the api
 *
 * @param {string} path Endpoint path
 * @param {object} data The payload to be sent
 * @param {string} method HTTB VERB, GET by default
 * @returns {object} The api response
 */
// const keyCall = ({ apiSecret }) => (path, data, method = 'GET') => {
//   if (!apiSecret) {
//     throw new Error('You need to pass an API secret to make this call.')
//   }

//   return publicCall(path, data, method, {
//     headers: { 'authorization': apiSecret },
//   })
// }

/**
 * Factory method for private calls against the api
 *
 * @param {string} path Endpoint path
 * @param {object} data The payload to be sent
 * @param {string} method HTTB VERB, GET by default
 * @param {object} headers
 * @returns {object} The api response
 */
const privateCall = ({ apiSecret }) => (
  path,
  data = {},
  method = 'GET',
  noData,
  noExtra,
) => {
  if (!apiSecret) {
    throw new Error('You need to pass an API secret to make authenticated calls.')
  }
  console.log(`${BASE}${path}${makeQueryString(data)}`);
  console.log('method', method);
  // console.log('headers', headers);
  return sendResult(
    fetch(`${BASE}${path}${makeQueryString(data)}`, {
      method,
      json: true,
      headers: { 'authorization': apiSecret,
                 "nonce": new Date()*1000000 },
    }),
  )
}

const privateDataCall = ({ apiSecret }) => (
  path,
  data = {},
  method = 'GET',
  noData,
  noExtra,
) => {
  if (!apiSecret) {
    throw new Error('You need to pass an API secret to make authenticated calls.')
  }
  console.log(`${BASE}${path}`);
  console.log('method', method);
  console.log(data)
  // console.log('headers', headers);
  return sendResult(
    fetch(`${BASE}${path}`, {
      method,
      body: JSON.stringify(data),
      json: true,
      headers: { 'authorization': apiSecret,
                 "nonce": new Date()*1000000 },
      
    }),
  )
}

export const candleFields = [
  'openTime',
  'open',
  'high',
  'low',
  'close',
  'volume',
  'closeTime',
  'quoteAssetVolume',
  'trades',
  'baseAssetVolume',
  'quoteAssetVolume',
]

/**
 * Get candles for a specific pair and interval and convert response
 * to a user friendly collection.
 */
// const candles = payload =>
//   checkParams('candles', payload, ['symbol']) &&
//   publicCall('/v1/klines', { interval: '5m', ...payload }).then(candles =>
//     candles.map(candle => zip(candleFields, candle)),
//   )

/**
 * Create a new order wrapper for market order simplicity
 */
const order = (pDCall, url, payload = {}) => {
  // const newPayload =
    if (!['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT', 'TRAILING_STOP, FILL_OR_KILL'].includes(payload.type.toUpperCase())){
      throw new Error("Order type should be MARKET/LIMIT/STOP/STOP_LIMIT/TRAILING_STOP/FILL_OR_KILL")
    }
  return (
    checkParams('order', payload, ['trading_pair_id', 'side', 'type', 'price', 'size']) &&
    pDCall(url, payload, 'POST')
  )
}

/**
 * Zip asks and bids reponse from order book
 * publicCall(,parames split)
 * TODO: ADD Query
 */
const book = payload =>
  checkParams('book', payload, ['trading_pair_id']) &&
  publicCall('/v1/market/orderbooks/'+ payload.trading_pair_id).then(({ success, result }) => ({
    asks: result.orderbook.asks.map(a => zip(['price', 'quantity', 'count'], a)),
    bids: result.orderbook.bids.map(b => zip(['price', 'quantity', 'count'], b)),
  }))
  
// const aggTrades = payload =>
//   checkParams('aggTrades', payload, ['symbol']) &&
//   publicCall('/v1/aggTrades', payload).then(trades =>
//     trades.map(trade => ({
//       aggId: trade.a,
//       price: trade.p,
//       quantity: trade.q,
//       firstId: trade.f,
//       lastId: trade.l,
//       timestamp: trade.T,
//       isBuyerMaker: trade.m,
//       wasBestPrice: trade.M,
//     })),
//   )

export default opts => {
  const pCall = privateCall(opts)
  const pDCall = privateDataCall(opts)
  // const kCall = keyCall(opts)

  return {
    // ping: () => publicCall('/v1/ping').then(() => true),
    time: () => publicCall('/v1/system/time').then(r => r.result.time),
    exchangeInfo: () => publicCall('/v1/system/info'),

    book,
    // aggTrades,
    // candles,

    //TODO query param
    trades: payload =>
      checkParams('trades', payload, ['trading_pair_id']) && publicCall('/v1/market/trades/' + payload.trading_pair_id),

    tradesHistory: payload =>
      checkParams('tradesHitory', payload, ['trading_pair_id']) && pCall('/v1/trading/trades/', payload),

    // dailyStats: payload => publicCall('/v1/ticker/24hr', payload),
    // prices: () =>
    //   publicCall('/v1/ticker/allPrices').then(r =>
    //     r.reduce((out, cur) => ((out[cur.symbol] = cur.price), out), {}),
    //   ),
    // allBookTickers: () =>
    //   publicCall('/v1/ticker/allBookTickers').then(r =>
    //     r.reduce((out, cur) => ((out[cur.symbol] = cur), out), {}),
    //   ),

    order: payload => order(pDCall, '/v1/trading/orders', payload, 'POST'),
    // orderTest: payload => order(pCall, payload, '/v3/order/test'),
    getOrder: payload => pCall('/v1/trading/orders/', payload),
    cancelOrder: payload => pCall('/v1/trading/orders/'+payload.order_id, {}, 'DELETE'),
    // modifyOrder: payload => pCall('/v1/trading/orders/'+payload.order_id, {}, 'PUT'),

    // openOrders: payload => pCall('/v3/openOrders', payload),
    // allOrders: payload => pCall('/v3/allOrders', payload),

    accountInfo: payload => pCall('/v1/wallet/ledger', payload),
    myTrades: payload => pCall('/v1/trading/trades/' + payload.trade_id),

    // withdraw: payload => pCall('/wapi/v3/withdraw.html', payload, 'POST'),
    // withdrawHistory: payload => pCall('/wapi/v3/withdrawHistory.html', payload),
    // depositHistory: payload => pCall('/wapi/v3/depositHistory.html', payload),
    // depositAddress: payload => pCall('/wapi/v3/depositAddress.html', payload),

    // getDataStream: () => pCall('/v1/userDataStream', null, 'POST', true),
    // keepDataStream: payload => pCall('/v1/userDataStream', payload, 'PUT', false, true),
    // closeDataStream: payload => pCall('/v1/userDataStream', payload, 'DELETE', false, true),
  }
}

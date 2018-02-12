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
  // console.log('method', method);
  // console.log('headers', headers);
  return sendResult(
    fetch(`${BASE}${path}${makeQueryString(data)}`, {
      method,
      json: true,
      headers: { 'authorization': apiSecret },
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
const candles = payload =>
  checkParams('candles', payload, ['symbol']) &&
  publicCall('/v1/klines', { interval: '5m', ...payload }).then(candles =>
    candles.map(candle => zip(candleFields, candle)),
  )

/**
 * Create a new order wrapper for market order simplicity
 */
const order = (pCall, payload = {}, url) => {
  const newPayload =
    ['LIMIT', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT_LIMIT'].includes(payload.type) || !payload.type
      ? { timeInForce: 'GTC', ...payload }
      : payload

  return (
    checkParams('order', newPayload, ['symbol', 'side', 'quantity']) &&
    pCall(url, { type: 'LIMIT', ...newPayload }, 'POST')
  )
}

/**
 * Zip asks and bids reponse from order book
 * publicCall(,parames split)
 */
const book = payload =>
  checkParams('book', payload, ['symbol']) &&
  publicCall('/v1/market/orderbooks/'+ payload.symbol).then(({ success, result }) => ({
    asks: result.orderbook.asks.map(a => zip(['price', 'quantity', 'count'], a)),
    bids: result.orderbook.bids.map(b => zip(['price', 'quantity', 'count'], b)),
  }))
  
const aggTrades = payload =>
  checkParams('aggTrades', payload, ['symbol']) &&
  publicCall('/v1/aggTrades', payload).then(trades =>
    trades.map(trade => ({
      aggId: trade.a,
      price: trade.p,
      quantity: trade.q,
      firstId: trade.f,
      lastId: trade.l,
      timestamp: trade.T,
      isBuyerMaker: trade.m,
      wasBestPrice: trade.M,
    })),
  )

export default opts => {
  const pCall = privateCall(opts)
  // const kCall = keyCall(opts)

  return {
    ping: () => publicCall('/v1/ping').then(() => true),
    time: () => publicCall('/v1/system/time').then(r => r.result.time),
    exchangeInfo: () => publicCall('/v1/system/info'),

    book,
    aggTrades,
    candles,

    trades: payload =>
      checkParams('trades', payload, ['symbol']) && publicCall('/v1/market/trades/' + payload.symbol),
    tradesHistory: payload =>
      checkParams('tradesHitory', payload, ['symbol']) && pCall('/v1/trading/trades/', payload),

    dailyStats: payload => publicCall('/v1/ticker/24hr', payload),
    prices: () =>
      publicCall('/v1/ticker/allPrices').then(r =>
        r.reduce((out, cur) => ((out[cur.symbol] = cur.price), out), {}),
      ),
    allBookTickers: () =>
      publicCall('/v1/ticker/allBookTickers').then(r =>
        r.reduce((out, cur) => ((out[cur.symbol] = cur), out), {}),
      ),

    order: payload => order(pCall, payload, '/v3/order'),
    orderTest: payload => order(pCall, payload, '/v3/order/test'),
    getOrder: payload => pCall('/v1/trading/orders/', payload),
    cancelOrder: payload => pCall('/v3/order', payload, 'DELETE'),

    openOrders: payload => pCall('/v3/openOrders', payload),
    allOrders: payload => pCall('/v3/allOrders', payload),

    accountInfo: payload => pCall('/v3/account', payload),
    myTrades: payload => pCall('/v3/myTrades', payload),

    withdraw: payload => pCall('/wapi/v3/withdraw.html', payload, 'POST'),
    withdrawHistory: payload => pCall('/wapi/v3/withdrawHistory.html', payload),
    depositHistory: payload => pCall('/wapi/v3/depositHistory.html', payload),
    depositAddress: payload => pCall('/wapi/v3/depositAddress.html', payload),

    getDataStream: () => pCall('/v1/userDataStream', null, 'POST', true),
    keepDataStream: payload => pCall('/v1/userDataStream', payload, 'PUT', false, true),
    closeDataStream: payload => pCall('/v1/userDataStream', payload, 'DELETE', false, true),
  }
}

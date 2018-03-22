import crypto from 'crypto'
import zip from 'lodash.zipobject'

import 'isomorphic-fetch'
const BASE = 'https://api.cobinhood.com'
// const BASE = 'https://sandbox-api.cobinhood.com'
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
  return sendResult(
    fetch(`${BASE}${path}${makeQueryString(data)}`, {
      method,
      json: true,
      headers,
    }),
  )
}


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


const removeProperty = (obj, property) => {
  return  Object.keys(obj).reduce((acc, key) => {
    if (key !== property) {
      return {...acc, [key]: obj[key]}
    }
    return acc;
  }, {})
}

/**
 * Create a new trades wrapper for market order simplicity
 */
const trades = (publicCall, url, payload = {}, method) => {
  checkParams('trades', payload, ['trading_pair_id'])
  const newUrl = url + payload.trading_pair_id
  const newPayload =  removeProperty(payload, 'trading_pair_id')

  return (
    publicCall(newUrl, newPayload, method)
  )
}

/**
 * Create a new trades wrapper for market order simplicity
 */
const candles = (publicCall, url, payload = {}, method) => {
  checkParams('candles', payload, ['trading_pair_id', "timeframe"])
  const newUrl = url + payload.trading_pair_id
  const newPayload =  removeProperty(payload, 'trading_pair_id')

  return (
    publicCall(newUrl, newPayload, method)
  )
}

/**
 * Create a new order books wrapper for market order simplicity
 */
const orderBooks = (publicCall, url, payload = {}, method) => {
  checkParams('orderBooks', payload, ['trading_pair_id'])
  const newUrl = url + payload.trading_pair_id
  const newPayload =  removeProperty(payload, 'trading_pair_id')

  return (
    // publicCall(newUrl, newPayload, method)
    publicCall(newUrl, newPayload, method).then(({ success, result }) => ({
      asks: result.orderbook.asks.map(a => zip(['price', 'count', 'size'], a)),
      bids: result.orderbook.bids.map(b => zip(['price', 'count', 'size'], b)),
  }))
  )
}

/**
 * Create a new order wrapper for market order simplicity
 */
const order = (pDCall, url, payload = {}, method) => {
    checkParams('order', payload, ['trading_pair_id', 'side', 'type', 'price', 'size'])
  // const newPayload =
    if (!['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT', 'TRAILING_STOP, FILL_OR_KILL'].includes(payload.type.toUpperCase())){
      throw new Error("Order type should be MARKET/LIMIT/STOP/STOP_LIMIT/TRAILING_STOP/FILL_OR_KILL")
    }
  return (
    pDCall(url, payload, method)
  )
}



const modifyOrder = (pDCall, url, payload = {}, method = 'PUT') => {
  checkParams('modifyOrder', payload, ['order_id', 'trading_pair_id', 'price', 'size'])
  const newUrl = url + payload.order_id 
  const newPayload = removeProperty(payload, 'order_id')
  return (
    pDCall(newUrl, newPayload, method)
  )
}

const myOrderSymbol = async(pCall, url, payload = {}, method = 'GET') => {
  try {
    const data =await pCall(url, payload, method)
    const {success, result} = data
    if (success===false)return data
    const {orders} = result
    const newOrders = orders.map(o=>Object.assign(o,{trading_pair: o.trading_pair_id}))
    const newResult = Object.assign(result, {orders:newOrders} )
    const response = Object.assign(data, {result:newResult})
    return response
  } catch (error) {
    return data
  }
    

}

/**
 * Zip asks and bids reponse from order book
 * publicCall(,parames split)
 * TODO: ADD Query
 */
const book = payload =>
  checkParams('book', payload, ['trading_pair_id']) &&
  publicCall(`/v1/market/orderbooks/${ payload.trading_pair_id}`).then(({ success, result }) => ({
    asks: result.orderbook.asks.map(a => zip(['price', 'quantity', 'count'], a)),
    bids: result.orderbook.bids.map(b => zip(['price', 'quantity', 'count'], b)),
}))

export default opts => {
  const pCall = privateCall(opts)
  const pDCall = privateDataCall(opts)
  // const kCall = keyCall(opts)

  return {
    /**
     * System Request
     */
    systemTime: () => publicCall('/v1/system/time').then(r => r.result.time),
    systemInfo: () => publicCall('/v1/system/info'),

    /**
     * Market Request
     */
    allCurrencies: payload =>
      publicCall('/v1/market/currencies'),

    allTradingPairs: payload =>
      publicCall('/v1/market/trading_pairs'),

    orderBooks: payload => orderBooks(publicCall, '/v1/market/orderbooks/', payload, 'GET'),

    marketState: payload =>
      publicCall('/v1/market/stats'),
    
    ticker: payload =>
      checkParams('ticker', payload, ['trading_pair_id']) &&
      publicCall(`/v1/market/tickers/${ payload.trading_pair_id}`),  

    candles: payload => candles(publicCall, '/v1/chart/candles/', payload, 'GET'),

    trades: payload => trades(publicCall, '/v1/market/orderbooks/', payload, 'GET'),
    
    /**
     * Trading [Auth]
     */
    myOrderId: payload => 
      checkParams('myOrderId', payload, ['order_id']) &&
      pCall(`/v1/trading/orders/${ payload.order_id}`)
      .catch(err=>{if (err.message==="400 Bad Request") throw new Error('Order does not exist.')}),

    // myOrderSymbol: payload => 
    //   pCall('/v1/trading/orders', payload),

    myOrderSymbol: payload => myOrderSymbol(pCall, '/v1/trading/orders/', payload, 'GET'),
    
    order: payload => order(pDCall, '/v1/trading/orders', payload, 'POST'),
    modifyOrder: payload => modifyOrder(pDCall, '/v1/trading/orders/', payload, 'PUT'),
    cancelOrder: payload => pCall(`/v1/trading/orders/${payload.order_id}`, {}, 'DELETE'),

    // TODO: not working
    // myOrderHistory: payload => 
    // checkParams('myOrderHistory', payload, ['trading_pair_id', 'limit']) &&
    // pCall('/v1/trading/order_history ', payload)
    // .catch(err=>{if (err.message==="404 Not Found") throw new Error('Order does not exist.')}),

    myTrade: payload => 
    checkParams('myTrade', payload, ['trade_id']) &&
    pCall(`/v1/trading/trades/${  payload.trade_id}`)
    .catch(err=>{if (err.message==="400 Bad Request") throw new Error('Trade does not exist.')}),

    myTradeHistory: payload => 
    checkParams('myTradeHistory', payload, ['trading_pair_id']) &&
    pCall('/v1/trading/trades/',  payload),

    /**
     * Wallet [Auth]
     */
    balances: payload => 
      pCall('/v1/wallet/balances',  payload),
 
    balanceHistory: payload => 
      checkParams('balanceHistory', payload, ['currency', 'limit']) &&
      pCall('/v1/wallet/ledger',  payload)
  }
}

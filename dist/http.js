'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _lodash = require('lodash.zipobject');

var _lodash2 = _interopRequireDefault(_lodash);

require('isomorphic-fetch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BASE = 'https://api.cobinhood.com';
// const BASE = 'https://sandbox-api.cobinhood.com'
/**
 * Build query string for uri encoded url based on json object
 */
var makeQueryString = function makeQueryString(q) {
  return q ? '?' + Object.keys(q).map(function (k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(q[k]);
  }).join('&') : '';
};

/**
 * Finalize APi response
 */
var sendResult = function sendResult(call) {
  return call.then(function (res) {
    return Promise.all([res, res.json()]);
  }).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        res = _ref2[0],
        json = _ref2[1];

    if (!res.ok) {
      throw new Error(json.msg || res.status + ' ' + res.statusText);
    }

    return json;
  });
};

/**
 * Util to validate existence of required parameter(s)
 */
var checkParams = function checkParams(name, payload) {
  var requires = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if (!payload) {
    throw new Error('You need to pass a payload object.');
  }

  requires.forEach(function (r) {
    if (!payload[r] && isNaN(payload[r])) {
      throw new Error('Method ' + name + ' requires ' + r + ' parameter.');
    }
  });

  return true;
};

/**
 * Make public calls against the api
 *
 * @param {string} path Endpoint path
 * @param {object} data The payload to be sent
 * @param {string} method HTTB VERB, GET by default
 * @param {object} headers
 * @returns {object} The api response
 */
var publicCall = function publicCall(path, data) {
  var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
  var headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  return sendResult(fetch('' + BASE + path + makeQueryString(data), {
    method: method,
    json: true,
    headers: headers
  }));
};

/**
 * Factory method for private calls against the api
 *
 * @param {string} path Endpoint path
 * @param {object} data The payload to be sent
 * @param {string} method HTTB VERB, GET by default
 * @param {object} headers
 * @returns {object} The api response
 */
var privateCall = function privateCall(_ref3) {
  var apiSecret = _ref3.apiSecret;
  return function (path) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
    var noData = arguments[3];
    var noExtra = arguments[4];

    if (!apiSecret) {
      throw new Error('You need to pass an API secret to make authenticated calls.');
    }
    return sendResult(fetch('' + BASE + path + makeQueryString(data), {
      method: method,
      json: true,
      headers: { 'authorization': apiSecret,
        "nonce": new Date() * 1000000 }
    }));
  };
};

var privateDataCall = function privateDataCall(_ref4) {
  var apiSecret = _ref4.apiSecret;
  return function (path) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
    var noData = arguments[3];
    var noExtra = arguments[4];

    if (!apiSecret) {
      throw new Error('You need to pass an API secret to make authenticated calls.');
    }
    return sendResult(fetch('' + BASE + path, {
      method: method,
      body: JSON.stringify(data),
      json: true,
      headers: { 'authorization': apiSecret,
        "nonce": new Date() * 1000000 }

    }));
  };
};

var removeProperty = function removeProperty(obj, property) {
  return Object.keys(obj).reduce(function (acc, key) {
    if (key !== property) {
      return _extends({}, acc, _defineProperty({}, key, obj[key]));
    }
    return acc;
  }, {});
};

/**
 * Create a new trades wrapper for market order simplicity
 */
var _trades = function _trades(publicCall, url) {
  var payload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var method = arguments[3];

  checkParams('trades', payload, ['trading_pair_id']);
  var newUrl = url + payload.trading_pair_id;
  var newPayload = removeProperty(payload, 'trading_pair_id');

  return publicCall(newUrl, newPayload, method);
};

/**
 * Create a new trades wrapper for market order simplicity
 */
var _candles = function _candles(publicCall, url) {
  var payload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var method = arguments[3];

  checkParams('candles', payload, ['trading_pair_id', "timeframe"]);
  var newUrl = url + payload.trading_pair_id;
  var newPayload = removeProperty(payload, 'trading_pair_id');

  return publicCall(newUrl, newPayload, method);
};

/**
 * Create a new order books wrapper for market order simplicity
 */
var _orderBooks = function _orderBooks(publicCall, url) {
  var payload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var method = arguments[3];

  checkParams('orderBooks', payload, ['trading_pair_id']);
  var newUrl = url + payload.trading_pair_id;
  var newPayload = removeProperty(payload, 'trading_pair_id');

  return (
    // publicCall(newUrl, newPayload, method)
    publicCall(newUrl, newPayload, method).then(function (_ref5) {
      var success = _ref5.success,
          result = _ref5.result;
      return {
        asks: result.orderbook.asks.map(function (a) {
          return (0, _lodash2.default)(['price', 'count', 'size'], a);
        }),
        bids: result.orderbook.bids.map(function (b) {
          return (0, _lodash2.default)(['price', 'count', 'size'], b);
        })
      };
    })
  );
};

/**
 * Create a new order wrapper for market order simplicity
 */
var _order = function _order(pDCall, url) {
  var payload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var method = arguments[3];

  checkParams('order', payload, ['trading_pair_id', 'side', 'type', 'price', 'size']);
  // const newPayload =
  if (!['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT', 'TRAILING_STOP, FILL_OR_KILL'].includes(payload.type.toUpperCase())) {
    throw new Error("Order type should be MARKET/LIMIT/STOP/STOP_LIMIT/TRAILING_STOP/FILL_OR_KILL");
  }
  return pDCall(url, payload, method);
};

var _modifyOrder = function _modifyOrder(pDCall, url) {
  var payload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var method = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'PUT';

  checkParams('modifyOrder', payload, ['order_id', 'trading_pair_id', 'price', 'size']);
  var newUrl = url + payload.order_id;
  var newPayload = removeProperty(payload, 'order_id');
  return pDCall(newUrl, newPayload, method);
};

var _myOrderSymbol = function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(pCall, url) {
    var payload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var method = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'GET';
    var data, success, result, orders, newOrders, newResult, response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return pCall(url, payload, method);

          case 3:
            data = _context.sent;
            success = data.success, result = data.result;

            if (!(success === false)) {
              _context.next = 7;
              break;
            }

            return _context.abrupt('return', data);

          case 7:
            orders = result.orders;
            newOrders = orders.map(function (o) {
              return Object.assign(o, { trading_pair: o.trading_pair_id });
            });
            newResult = Object.assign(result, { orders: newOrders });
            response = Object.assign(data, { result: newResult });
            return _context.abrupt('return', response);

          case 14:
            _context.prev = 14;
            _context.t0 = _context['catch'](0);
            throw _context.t0;

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 14]]);
  }));

  return function _myOrderSymbol(_x14, _x15) {
    return _ref6.apply(this, arguments);
  };
}();

/**
 * Zip asks and bids reponse from order book
 * publicCall(,parames split)
 * TODO: ADD Query
 */
var book = function book(payload) {
  return checkParams('book', payload, ['trading_pair_id']) && publicCall('/v1/market/orderbooks/' + payload.trading_pair_id).then(function (_ref7) {
    var success = _ref7.success,
        result = _ref7.result;
    return {
      asks: result.orderbook.asks.map(function (a) {
        return (0, _lodash2.default)(['price', 'quantity', 'count'], a);
      }),
      bids: result.orderbook.bids.map(function (b) {
        return (0, _lodash2.default)(['price', 'quantity', 'count'], b);
      })
    };
  });
};

exports.default = function (opts) {
  var pCall = privateCall(opts);
  var pDCall = privateDataCall(opts);
  // const kCall = keyCall(opts)

  return {
    /**
     * System Request
     */
    systemTime: function systemTime() {
      return publicCall('/v1/system/time').then(function (r) {
        return r.result.time;
      });
    },
    systemInfo: function systemInfo() {
      return publicCall('/v1/system/info');
    },

    /**
     * Market Request
     */
    allCurrencies: function allCurrencies(payload) {
      return publicCall('/v1/market/currencies');
    },

    allTradingPairs: function allTradingPairs(payload) {
      return publicCall('/v1/market/trading_pairs');
    },

    orderBooks: function orderBooks(payload) {
      return _orderBooks(publicCall, '/v1/market/orderbooks/', payload, 'GET');
    },

    marketState: function marketState(payload) {
      return publicCall('/v1/market/stats');
    },

    ticker: function ticker(payload) {
      return checkParams('ticker', payload, ['trading_pair_id']) && publicCall('/v1/market/tickers/' + payload.trading_pair_id);
    },

    candles: function candles(payload) {
      return _candles(publicCall, '/v1/chart/candles/', payload, 'GET');
    },

    trades: function trades(payload) {
      return _trades(publicCall, '/v1/market/orderbooks/', payload, 'GET');
    },

    /**
     * Trading [Auth]
     */
    myOrderId: function myOrderId(payload) {
      return checkParams('myOrderId', payload, ['order_id']) && pCall('/v1/trading/orders/' + payload.order_id).catch(function (err) {
        if (err.message === "400 Bad Request") throw new Error('Order does not exist.');
      });
    },

    // myOrderSymbol: payload => 
    //   pCall('/v1/trading/orders', payload),

    myOrderSymbol: function myOrderSymbol(payload) {
      return _myOrderSymbol(pCall, '/v1/trading/orders/', payload, 'GET');
    },

    order: function order(payload) {
      return _order(pDCall, '/v1/trading/orders', payload, 'POST');
    },
    modifyOrder: function modifyOrder(payload) {
      return _modifyOrder(pDCall, '/v1/trading/orders/', payload, 'PUT');
    },
    cancelOrder: function cancelOrder(payload) {
      return pCall('/v1/trading/orders/' + payload.order_id, {}, 'DELETE');
    },

    // TODO: not working
    // myOrderHistory: payload => 
    // checkParams('myOrderHistory', payload, ['trading_pair_id', 'limit']) &&
    // pCall('/v1/trading/order_history ', payload)
    // .catch(err=>{if (err.message==="404 Not Found") throw new Error('Order does not exist.')}),

    myTrade: function myTrade(payload) {
      return checkParams('myTrade', payload, ['trade_id']) && pCall('/v1/trading/trades/' + payload.trade_id).catch(function (err) {
        if (err.message === "400 Bad Request") throw new Error('Trade does not exist.');
      });
    },

    myTradeHistory: function myTradeHistory(payload) {
      return checkParams('myTradeHistory', payload, ['trading_pair_id']) && pCall('/v1/trading/trades/', payload);
    },

    /**
     * Wallet [Auth]
     */
    balances: function balances(payload) {
      return pCall('/v1/wallet/balances', payload);
    },

    balanceHistory: function balanceHistory(payload) {
      return checkParams('balanceHistory', payload, ['currency', 'limit']) && pCall('/v1/wallet/ledger', payload);
    }
  };
};
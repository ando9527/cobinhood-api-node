# binance-api-node 

### Installation

    yarn add https://bitbucket.org/uselessmining/cobinhood-api-node

### Getting started

Import the module and create a new client. Passing api keys is optional only if
you don't plan on doing authenticated calls. You can create an api key
[here](https://www.binance.com/userCenter/createApi.html).

```js
import Cobinhood from 'cobinhood-api-node'

const client = Cobinhood()

// Authenticated client, can make signed calls
const client2 = Cobinhood({
  apiSecret: 'xxx',
})

client.systemTime().then(time => console.log(time))
```

If you do not have an appropriate babel config, you will need to use the basic commonjs requires.

```js
const Cobinhood = require('cobinhood-api-node').default
```

Every REST method returns a Promise, making this library [async await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) ready.
Following examples will use the `await` form, which requires some configuration you will have to lookup.

### Table of Contents

- [Public REST Endpoints](#public-rest-endpoints)
    - [systemTime](#systemTime)
    - [systemInfo](#systemInfo)
    - [allCurrencies](#allCurrencies)
    - [allTradingPairs](#allTradingPairs)
    - [candles](#candles)
    - [orderBooks](#orderBooks)
    - [marketState](#marketState)
    - [ticker](#ticker)
    - [trades](#trades)
- [Authenticated REST Endpoints](#authenticated-rest-endpoints)
    - [myOrderId](#myOrderId)
    - [myOrderSymbol](#myOrderSymbol)
    - [order](#order)
    - [modifyOrder](#modifyOrder)
    - [cancelOrder](#cancelOrder)
    - [myTrade](#myTrade)
    - [myTradeHistory](#myTradeHistory)
    - [balances](#balances)
    - [balanceHistory](#balanceHistory)


### Public REST Endpoints


#### systemTime

Test connectivity to the Rest API and get the current server time.

```js
console.log(await client.systemTime())
```

<details>
<summary>Output</summary>

```js
1508478457643
```

</details>

#### exchangeInfo

Get the current exchange trading rules and symbol information.

```js
console.log(await client.exchangeInfo())
```

<details>
<summary>Output</summary>

```js
{ success: true,
  result: { info: { phase: 'production', revision: '475c11' } } }
```

</details>

### allCurrencies

Info for all currencies available for trade

```js
console.log(await client.allCurrencies())
```

<details>
<summary>Output</summary>

```js
{ success: true,
  result:
   { currencies:
      [ [Object],
        [Object],
        [Object],
        [Object],
        [Object],
```

</details>


### candles
|Param|Type|Required|Default|
|--- |--- |--- |--- |
|trading_pair_id|String|true|
|timeframe|String|true|
|start_time|int|false|0|
|end_time|int|false|0 current server time|

### allTradingPairs

Get All Trading Pairs

```js
console.log(await client.allTradingPairs())
```

<details>
<summary>Output</summary>

```js
{ success: true,
  result:
   { trading_pairs:
      [ [Object],
        [Object],
        [Object],
```

</details>

### orderBooks
|Param|Type|Required|Default|
|--- |--- |--- |--- |
|trading_pair_id|String|true|

trading_pair_id
  * enum[BTC-USDT, ...]

### marketState

### ticker
|Param|Type|Required|Default|
|--- |--- |--- |--- |
|trading_pair_id|String|true|
trading_pair_id
  * enum[BTC-USDT, ...]


### trades
|Param|Type|Required|Default|
|--- |--- |--- |--- |
|trading_pair_id|String|true|
trading_pair_id
  * enum[BTC-USDT, ...]


trading_pair_id
  * enum[BTC-USDT, ...]

### myOrderId
|Param|Type|Required|Default|
|--- |--- |--- |--- |
|order_id|String|true|

### myOrderSymbol
|Param|Type|Required|Default|
|--- |--- |--- |--- |
|trading_pair_id|String|false|
|limit|String|---|20|false

### order
|Param|Type|Required|Default|
|--- |--- |--- |--- |
|trading_pair_id|String|true|---|
|side|String|true|---|
|type|String|true|---|
|price|String|true|---|
|size|String|true|---|

trading_pair_id
  * enum[BTC-USDT, ...]
side
  * enum[bid, ask]
type
  * enum[market, limit, stop, stop_limit]

### modifyOrder
|Param|Type|Required|Default|
|--- |--- |--- |--- |
|order_id|String|true|---|
|trading_pair_id|String|true|---|
|price|String|true|---|
|size|String|true|---|

### cancelOrder
|Param|Type|Required|Default|
|--- |--- |--- |--- |
|order_id|String|true|---|

### myTrade
|Param|Type|Required|Default|
|--- |--- |--- |--- |
|trade_id|String|true|---|

### myTradeHistory
|Param|Type|Required|Default|
|--- |--- |--- |--- |
|trading_pair_id|String|true|---|
|limit|String|true|20|

### balances

### balanceHistory
|Param|Type|Required|Default|
|--- |--- |--- |--- |
|currency|String|true|---|
|limit|String|true|20|






















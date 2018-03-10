import test from 'ava'
import dotenv from 'dotenv'

import Cobinhood from 'index'
import { candleFields } from 'http'
import { userEventHandler } from 'websocket'
import moment from 'moment'
import { checkFields } from './utils'

dotenv.load()

const client = Cobinhood({apiSecret:process.env.BOT_API_SECRET})



test.serial('[REST][AUTH] All of My Orders', async t => {
    const param= {limit: '50'}
    const param2= {limit: '50', page:3}
    const mo = await client.myOrderSymbol(param2)
    console.log(mo)
    t.is(mo.success, true)

  
  })
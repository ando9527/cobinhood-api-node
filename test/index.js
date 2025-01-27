import test from 'ava'
import dotenv from 'dotenv'

import Cobinhood from 'index'
import { candleFields } from 'http'
import { userEventHandler } from 'websocket'
import moment from 'moment'
import { checkFields } from './utils'
import * as auth from './authenticated'
/**
 * System
 * https://cobinhood.github.io/api-public/#system
 */

/*************************************************
 * GUMO
 * @exports
 * store.js
 * Created by Jagadish Sellamuthu on 11/11/2019
 * Copyright © 2019 GUMUGO. All rights reserved.
 *************************************************/

'use strict';

import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import reducers from './reducers/index';

// const logger = createLogger();

/**
 * Creates a store with given reducers
 */
export default createStore(reducers, applyMiddleware(thunk));

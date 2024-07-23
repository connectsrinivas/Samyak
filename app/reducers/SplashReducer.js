/*************************************************
 * GUMO
 * @exports
 * @class SplashReducer.js
 * Created by Jagadish Sellamuthu on 11/11/2019
 * Copyright © 2019 GUMUGO. All rights reserved.
 *************************************************/

'use strict';

import Constants from '../util/Constants';

let initialState = {
  isLoading: true,
  errorMessage: '',
  oneSignalId: '',
};
const {
  ACTIONS: {
    SPLASH_SHOW_LOADING,
    SPLASH_HIDE_LOADING,
    SPLASH_ERROR_UPDATE,
    UPDATE_ONE_SIGNAL_DETAILS,
  },
} = Constants;

export const splashState = (state = initialState, action) => {
  const {type, oneSignalId, errorMessage} = action;
  switch (type) {
    case SPLASH_SHOW_LOADING:
      return {...state, isLoading: true};
    case SPLASH_HIDE_LOADING:
      return {...state, isLoading: false};
    case UPDATE_ONE_SIGNAL_DETAILS:
      return {...state, oneSignalId: oneSignalId};
    case SPLASH_ERROR_UPDATE:
      return {...state, isLoading: false, errorMessage: errorMessage};
    default:
      return state;
  }
};

/*************************************************
 * SukraasLIS
 * DashboardReducer.js
 * Created by Abdul on 22/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  isLoginLoading: false,
};

export const loginState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LOGIN_SHOW_LOADING:
      return {...state, isLoginLoading: true};
    case ACTIONS.LOGIN_HIDE_LOADING:
      return {...state, isLoginLoading: false};
    case ACTIONS.FORGET_PWD_SHOW_LOADING:
      return {...state, isLoginLoading: true};
    case ACTIONS.FORGET_PWD_HIDE_LOADING:
      return {...state, isLoginLoading: false};
    default:
      return state;
  }
};

/*************************************************
 * GUMO
 * SignupReducer.js
 * Created by Jagadish Sellamuthu on 11/11/2019
 * Copyright © 2019 GUMUGO. All rights reserved.
 *************************************************/

import Constants from '../util/Constants';

const {ACTIONS} = Constants;

let initialState = {
  isPageLoading: false,
  isSingupLoading: false,
  needDOB: false,
  checkingStatus: 0,
};

export const signupState = (state = initialState, action) => {
  const {type, needDOB, checkingStatus} = action;

  switch (type) {
    case ACTIONS.SIGNUP_SHOW_PAGE_LOADING:
      return {...state, isPageLoading: true};
    case ACTIONS.SIGNUP_HIDE_PAGE_LOADING:
      return {...state, isPageLoading: false};
    case ACTIONS.SIGNUP_SHOW_LOADING:
      return {...state, isSingupLoading: true};
    case ACTIONS.SIGNUP_HIDE_LOADING:
      return {...state, isSingupLoading: false};
    case ACTIONS.SIGNUP_SET_DOB_NEED_OR_NOT:
      return {...state, needDOB};
    case ACTIONS.SIGNUP_SET_CHECKING_STATUS:
      return {...state, checkingStatus};
    case ACTIONS.SIGNUP_RESET_TO_INITIAL:
      return {...initialState};
    default:
      return state;
  }
};

/*************************************************
 * GUMO
 * SignInReducer.js
 * Created by Jagadish Sellamuthu on 11/11/2019
 * Copyright © 2019 GUMUGO. All rights reserved.
 *************************************************/

import Constants from '../util/Constants';

const {ACTIONS} = Constants;

let initialState = {
  isPageLoading: false, // Used to show loading when the auto login invoked.
  isLoginLoading: false, // Used to show loading when the login api invoked.
};

export const signInState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LOGIN_SHOW_PAGE_LOADING:
      return {...state, isPageLoading: true};
    case ACTIONS.LOGIN_HIDE_PAGE_LOADING:
      return {...state, isPageLoading: false};
    case ACTIONS.LOGIN_SHOW_LOADING:
      return {...state, isLoginLoading: true};
    case ACTIONS.LOGIN_HIDE_LOADING:
      return {...state, isLoginLoading: false};
    default:
      return state;
  }
};

let loggedInUserInitialState = {
  loggedInUserDetails: {},
  loggedInUserToken: {},
};

export const loggedInUserDetailsState = (
  state = loggedInUserInitialState,
  action,
) => {
  switch (action.type) {
    case ACTIONS.LOGGEDIN_USER_DETAILS_SUCCESS:
      // hide loader, set user data from api
      return {
        ...state,
        loggedInUserDetails: action.payload.userDetails,
      };
    case ACTIONS.LOGGEDIN_USER_TOKENS_SUCCESS:
      // set user tokens from api
      return {...state, loggedInUserToken: action.payload};

    case ACTIONS.LOGGEDIN_USER_DETAILS_UPDATE:
      return {...state, loggedInUserDetails: action.payload};

    case ACTIONS.LOGGEDIN_USER_DETAILS_RESET:
      return {...loggedInUserInitialState};

    case ACTIONS.LOGOUT_USER:
      return {...loggedInUserInitialState};

    default:
      return state;
  }
};

/*************************************************
 * SukraasLIS
 * @exports
 * @class ContactScreenReducers.js
 * Created by Shive Sankar on 09/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  isContactScreenLoading: false,
  arrContactInfo: {},
};

export const contactScreenState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_CONTACT_SCREEN_LOADING:
      return {...state, isContactScreenLoading: true};
    case ACTIONS.HIDE_CONTACT_SCREEN_LOADING:
      return {...state, isContactScreenLoading: false};
    case ACTIONS.GET_CONTACT_SCREEN_INFO:
      return {...state, arrContactInfo: action.payload};
    default:
      return state;
  }
};

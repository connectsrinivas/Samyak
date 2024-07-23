'use strict';

import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  isTermsScreenLoading: false,
  arrTermsInfo: {},
};

export const termsScreenState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_TERMS_SCREEN_LOADING:
      return {...state, isTermsScreenLoading: true};
    case ACTIONS.HIDE_TERMS_SCREEN_LOADING:
      return {...state, isTermsScreenLoading: false};
    case ACTIONS.GET_TERMS_SCREEN_INFO:
      return {...state, arrTermsInfo: action.payload};
    default:
      return state;
  }
};

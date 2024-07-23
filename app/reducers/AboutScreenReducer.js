'use strict';

import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  isAboutScreenLoading: false,
  arrAboutInfo: {},
};

export const aboutScreenState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_ABOUTSCREEN_LOADING:
      return {...state, isAboutScreenLoading: true};
    case ACTIONS.HIDE_ABOUTSCREEN_LOADING:
      return {...state, isAboutScreenLoading: false};
    case ACTIONS.GET_ABOUTSCREEN_INFO:
      return {...state, arrAboutInfo: action.payload};
    default:
      return state;
  }
};

'use strict';

import Constants from '../util/Constants';
const { ACTIONS } = Constants;

let initialState = {
  isSubmitButtonLoading: false,
};

export const addAddressState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SUBMIT_BUTTON_CLICKED:
      return { ...state, isSubmitButtonLoading: true };
    case ACTIONS.SUBMIT_BUTTON_SUCCESS:
      return {
        ...state,
        isSubmitButtonLoading: false,
      };
    case ACTIONS.SUBMIT_BUTTON_FAILED:
      return {
        ...state,
        isSubmitButtonLoading: false,
      };
    default:
      return state;
  }
};

let initialUpdateState = {
  isUpdateButtonLoading: false,
};

export const updateAddressState = (state = initialUpdateState, action) => {
  switch (action.type) {
    case ACTIONS.UPDATE_BUTTON_CLICKED:
      return { ...state, isUpdateButtonLoading: true };
    case ACTIONS.UPDATE_BUTTON_SUCCESS:
      return {
        ...state,
        isUpdateButtonLoading: false,
      };
    case ACTIONS.UPDATE_BUTTON_FAILED:
      return {
        ...state,
        isUpdateButtonLoading: false,
      };
    default:
      return state;
  }
};
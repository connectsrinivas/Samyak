/*************************************************
 * SukraasLIS
 * LabTestPaymentDetailsReducer.js
 * Created by Sankar on 2/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  isPaymentDetailLoading: false,
  Service_Reg_Data: [],
  bookingSuccessData: {},
  sampleCollectionData: {},
  sampleCollectionArr: [],
  sampleCollectionCartAmount: 0,
};

export const labTestPaymentDetailsState = (state = initialState, action) => {
  const {
    Service_Reg_Data,
    bookingSuccessData,
    sampleCollectionData,
    sampleCollectionArr,
    sampleCollectionCartAmount,
  } = action;
  switch (action.type) {
    case ACTIONS.PAYMENT_DETAIL_SHOW_LOADING:
      return {...state, isPaymentDetailLoading: true};
    case ACTIONS.PAYMENT_DETAIL_HIDE_LOADING:
      return {...state, isPaymentDetailLoading: false};
    case ACTIONS.PAYMENT_SET_CART_ARRAY:
      return {...state, Service_Reg_Data};
    case ACTIONS.PAYMENT_ORDER_BOOKING_SUCCESS_DATA:
      return {...state, bookingSuccessData};
    case ACTIONS.GET_SAMPLE_AND_DISCOUNT_CHARGE:
      return {...state, sampleCollectionData};
    case ACTIONS.SAMPLE_COLLECTED_AMOUNT_ADDED_IN_ARRAY:
      return {...state, sampleCollectionArr};
    case ACTIONS.SAMPLE_COLLECTED_AMOUNT_ADDED_IN_TOTAL_AMOUNT:
      return {...state, sampleCollectionCartAmount};

    default:
      return state;
  }
};

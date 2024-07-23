/*************************************************
 * SukraasLIS
 * LabTestSummaryReducer.js
 * Created by Sankar on 09/06/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

import Constants from '../util/Constants';
import {Actions} from 'react-native-router-flux';
const {ACTIONS} = Constants;

let initialState = {
  isLoading: false,
  isCalenderLoading: false,
  cartCount: 0,
  cartArray: [],
  cartAmount: 0,
  bookingTime: '',
  bookingDate: '',
  bookingType: -1,
  bookingHomeorWalkIn: [],
  bookingTimeSlot: [],
};

export const labTestSummaryState = (state = initialState, action) => {
  const {
    cartCount,
    cartArray,
    cartAmount,
    bookingDate,
    bookingTime,
    bookingType,
    bookingHomeorWalkIn,
    bookingTimeSlot,
  } = action;
  switch (action.type) {
    case ACTIONS.SUMMARY_CART_COUNT:
      return {...state, cartCount};
    case ACTIONS.SUMMARY_CART_AMOUNT:
      return {...state, cartAmount};
    case ACTIONS.SUMMARY_CART_ARRAY:
      return {...state, cartArray};
    case ACTIONS.SUMMARY_CART_BOOKING_DATE:
      return {...state, bookingDate};
    case ACTIONS.SUMMARY_CART_BOOKING_TIME:
      return {...state, bookingTime};
    case ACTIONS.SUMMARY_CART_BOOKING_TYPE:
      return {...state, bookingType};
    // Calender screen
    case ACTIONS.BOOKING_HOME_WALKIN:
      return {...state, bookingHomeorWalkIn};
    case ACTIONS.BOOKING_DAYWISE_TIMESLOT:
      return {...state, bookingTimeSlot};

    case ACTIONS.SHOW_CALENDER_LOADING:
      return {...state, isCalenderLoading: true};
    case ACTIONS.HIDE_CALENDER_LOADING:
      return {...state, isCalenderLoading: false};
    default:
      return state;
  }
};

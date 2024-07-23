/*************************************************
 * Sukraas
 * @exports
 * @class LabTestSumaryAction.js
 * Created by Sankar on 09/06/2020
 * Copyright © 2020 Sukraas. All rights reserved.
 *************************************************/

'use strict';
import _ from 'lodash';
import Constants from '../util/Constants';
import {useCallback} from 'react';
import HttpBaseClient from '../util/HttpBaseClient';
import Utility from '../util/Utility';
import {handleError} from './NetworkAction';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const setCartCount = cartCount => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SUMMARY_CART_COUNT,
      cartCount: cartCount,
    });
  };
};

export const setCartAmount = cartAmount => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SUMMARY_CART_AMOUNT,
      cartAmount: cartAmount,
    });
  };
};

export const setCartArray = cartArray => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SUMMARY_CART_ARRAY,
      cartArray: cartArray,
    });
  };
};

export const callDateBooking = dictDateBookingInfo => {
  return dispatch => {
    dispatch(showCalenderLoading());
    setTimeout(function() {
      HttpBaseClient.post(
        AsyncStorage.configUri.ge_bo_sl_da,
        dictDateBookingInfo,
        0,
      )
        .then(response => {
          dispatch(hideCalenderLoading());
          if (
            response.Code === 200 ||
            response.SuccessFlag.toLowerCase() === 'true'
          ) {
            if (response.Message[0].Slot_Detail != null) {
              dispatch({
                type: Constants.ACTIONS.BOOKING_DAYWISE_TIMESLOT,
                bookingTimeSlot: response.Message[0],
              });
            } else {
              dispatch({
                type: Constants.ACTIONS.BOOKING_DAYWISE_TIMESLOT,
                bookingTimeSlot: [],
              });
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                Constants.VALIDATION_MSG.BOOKING_TIME_SLOT_ERROR,
              );
            }
          } else {
            dispatch({
              type: Constants.ACTIONS.BOOKING_DAYWISE_TIMESLOT,
              bookingTimeSlot: [],
            });
            if (response.Message[0].Message != null) {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                response.Message[0].Message,
              );
            } else {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                Constants.VALIDATION_MSG.NO_DATA_FOUND,
              );
            }
          }
        })
        .catch(error => {
          dispatch(hideCalenderLoading());
          dispatch(handleError(error));

          // Utility.showAlert(
          //   Constants.ALERT.TITLE.ERROR,
          //   Constants.VALIDATION_MSG.ERROR_CATCH,
          // );
        });

      // callback(true);
    }, 2000);
  };
};

export const setDate = date => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SUMMARY_CART_BOOKING_DATE,
      bookingDate: date,
    });
  };
};

export const setTime = time => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SUMMARY_CART_BOOKING_TIME,
      bookingTime: time,
    });
  };
};

export const emptySampleCollectionArray = time => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SAMPLE_COLLECTED_AMOUNT_ADDED_IN_ARRAY,
      sampleCollectionArr: [],
    });
  };
};

export const resetSampleCollectionAmount = time => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SAMPLE_COLLECTED_AMOUNT_ADDED_IN_TOTAL_AMOUNT,
      sampleCollectionCartAmount: 0,
    });
  };
};

export const callBookingType = type => {
  return dispatch => {
    dispatch(showCalenderLoading());
    setTimeout(function() {
      HttpBaseClient.post(AsyncStorage.configUri.ge_bo_ty, {}, 0)
        .then(response => {
          dispatch(hideCalenderLoading());
          if (
            response.Code === 200 ||
            response.SuccessFlag.toLowerCase() === 'true'
          ) {
            if (response.Message[0].Type_Of_Booking === type) {
              dispatch({
                type: Constants.ACTIONS.BOOKING_HOME_WALKIN,
                bookingHomeorWalkIn: response.Message[0],
              });
            } else {
              dispatch({
                type: Constants.ACTIONS.BOOKING_HOME_WALKIN,
                bookingHomeorWalkIn: response.Message[1],
              });
            }
          } else {
            if (response.Message[0].Message != null) {
              dispatch({
                type: Constants.ACTIONS.BOOKING_HOME_WALKIN,
                bookingHomeorWalkIn: [],
              });
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                response.Message[0].Message,
              );
            } else {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                Constants.VALIDATION_MSG.NO_DATA_FOUND,
              );
            }
          }
        })
        .catch(error => {
          dispatch(hideCalenderLoading());
          dispatch(handleError(error));
        });
    }, 2000);
  };
};

export const setType = type => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SUMMARY_CART_BOOKING_TYPE,
      bookingType: type,
    });
  };
};
export const clearSlotTimings = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.BOOKING_DAYWISE_TIMESLOT,
      bookingTimeSlot: [],
    });
  };
};

export const showCalenderLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_CALENDER_LOADING,
    });
  };
};

export const hideCalenderLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_CALENDER_LOADING,
    });
  };
};

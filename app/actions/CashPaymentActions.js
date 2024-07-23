'use strict';

import _ from 'lodash';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {handleError} from './NetworkAction';

export const getCashpaymentDetails = (phoneNumber, password, callback) => {
  return dispatch => {
    dispatch(showCashpaymentLoading());
    setTimeout(function() {
      HttpBaseClient.post(
        AsyncStorage.configUri.us_vi,
        {Username: phoneNumber, Password: password},
        0,
      )
        .then(response => {
          dispatch(hideCashpaymentLoading());
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            callback(true);
            return dispatch({
              type: Constants.ACTIONS.GET_CASHPAYMENT_DETAILS,
              payload: JSON.stringify(response.Message[0]),
            });
          } else {
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
          dispatch(hideCashpaymentLoading());
          dispatch(handleError(error));
        });
    }, 500);
  };
};

export const showCashpaymentLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_CASHPAYMENT_LOADING,
    });
  };
};

export const hideCashpaymentLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_CASHPAYMENT_LOADING,
    });
  };
};

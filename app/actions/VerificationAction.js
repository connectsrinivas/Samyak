'use strict';
import _ from 'lodash';
import {Actions} from 'react-native-router-flux';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';


import {handleError} from './NetworkAction';

export const verifyOTPSubmit = (phoneNumber, otp) => {
  return dispatch => {
    dispatch(showVerificationLoading());

    setTimeout(function() {
      HttpBaseClient.post(
        AsyncStorage.configUri.ot_ve,
        {UserName: phoneNumber, Otp_Code: otp},
        0,
      )
        .then(response => {
          dispatch(hideVerificationLoading());
          if (response.Code === 200) {
            AsyncStorage.setItem(Constants.ASYNC.ASYNC_OTP, otp);
            AsyncStorage.setItem(
              Constants.ASYNC.ASYNC_PHONE_NUMBER,
              phoneNumber,
            );
            Actions.SetPasswordScreen();
          } else {
            if (response.Message[0].Message != null) {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                response.Message[0].Message,
              );
            } else {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                Constants.VALIDATION_MSG.OTP_VERIFY_FAILED,
              );
            }
          }
        })
        .catch(error => {
          dispatch(hideVerificationLoading());
          dispatch(handleError(error));
        });
    }, 1000);
  };
};

export const verifyOTPResend = (phoneNumber, isResent, callback) => {
  return dispatch => {
    dispatch(showOTPResendLoading());

    HttpBaseClient.post(
      AsyncStorage.configUri.ot_se,
      {UserName: phoneNumber, Mobile_No: phoneNumber},
      0,
    )
      .then(response => {
        dispatch(hideOTPResendLoading());
        if (response.Code === 200) {
          Utility.showAlert(
            Constants.ALERT.TITLE.SUCCESS,
            'OTP sent successfully',
          );
          callback(true, response.Message[0].Otp_Message);
        } else {
          if (response.Message[0].Message != null) {
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              response.Message[0].Message,
            );
          } else {
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              Constants.VALIDATION_MSG.OTP_RESEND_FAILED,
            );
          }
        }
      })
      .catch(error => {
        dispatch(hideOTPResendLoading());
        dispatch(handleError(error));
      });
  };
};

export const showVerificationLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.OTP_VERIFY_SHOW_LOADING,
    });
  };
};

export const hideVerificationLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.OTP_VERIFY_HIDE_LOADING,
    });
  };
};

export const showOTPResendLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.OTP_RESEND_SHOW_LOADING,
    });
  };
};

export const hideOTPResendLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.OTP_RESEND_HIDE_LOADING,
    });
  };
};

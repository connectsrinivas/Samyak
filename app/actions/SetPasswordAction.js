'use strict';
import _ from 'lodash';
import {Actions} from 'react-native-router-flux';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {handleError} from './NetworkAction';

export const submitPassword = (
  phoneNumber,
  otp,
  password,
  device_id,
  oneSignalId,
  os_version,
  device_type,
  device_info,
  app_version,
  callback,
) => {
  return dispatch => {
    dispatch(showSubmitPasswordLoading());

    HttpBaseClient.post(
      AsyncStorage.configUri.se_pa,
      {
        UserName: phoneNumber,
        Otp_Code: otp,
        Password: password,
        Device_ID: device_id,
        Token_ID: device_id,
        OS_Type: os_version,
        Device_Type: device_type,
        Model_Type: device_info,
        App_Version: app_version,
      },
      0,
    )
      .then(response => {
        dispatch(hideSubmitPasswordLoading());
        if (response.Code === 200) {
          callback(true, response.Message[0]);
          // Utility.showAlert(
          //   Constants.ALERT.TITLE.SUCCESS,
          //   response.Message[0].OTP_Message +
          //     ' ' +
          //     response.Message[0].OTP_Code,
          // );
        } else {
          if (response.Message[0].Message != null) {
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              response.Message[0].Message,
            );
          } else {
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              Constants.VALIDATION_MSG.SETPASSWORD_FAILED,
            );
          }
        }
      })
      .catch(error => {
        dispatch(hideSubmitPasswordLoading());
        dispatch(handleError(error));
      });
  };
};

export const showSubmitPasswordLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SET_PASSWORD_SHOW_LOADING,
    });
  };
};

export const hideSubmitPasswordLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SET_PASSWORD_HIDE_LOADING,
    });
  };
};

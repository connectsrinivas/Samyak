'use strict';
import _ from 'lodash';
import {Actions} from 'react-native-router-flux';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {handleError} from './NetworkAction';

export const registerOnSubmit = (
  name,
  dob,
  email,
  phoneNumber,
  referralCode,
  gender,
  device_id,
  oneSignalId,
  os_version,
  device_type,
  device_info,
  app_version,
) => {
  return dispatch => {
    dispatch(showRegistrationLoading());

    HttpBaseClient.post(
      AsyncStorage.configUri.us_re,
      {
        Name: name,
        UserName: phoneNumber,
        Gender: gender,
        Dob: dob,
        Mobile_No: phoneNumber,
        Email_Id: email,
        Refferal_No: referralCode,
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
        dispatch(hideRegistrationLoading());
        if (response.Code === 200) {
          AsyncStorage.setItem(Constants.ASYNC.ASYNC_PHONE_NUMBER, phoneNumber);
          Actions.verificationScreen({
            isResetPassword: false,
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
              Constants.VALIDATION_MSG.SIGNUP_FAILED,
            );
          }
        }
      })
      .catch(error => {
        dispatch(hideRegistrationLoading());
        dispatch(handleError(error));
        // Utility.showAlert(
        //   Constants.ALERT.TITLE.ERROR,
        //   Constants.VALIDATION_MSG.ERROR_CATCH,
        // );
      });
  };
};

export const showRegistrationLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.REGISTER_SHOW_LOADING,
    });
  };
};

export const hideRegistrationLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.REGISTER_HIDE_LOADING,
    });
  };
};

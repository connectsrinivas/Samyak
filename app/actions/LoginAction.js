'use strict';
import _ from 'lodash';
import Constants from '../util/Constants';
import HttpBaseClient from '../util/HttpBaseClient';
import Utility from '../util/Utility';
import {handleError} from './NetworkAction';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import OneSignal from 'react-native-onesignal';
import { LOGIN, S3URL } from '../util/URL';

export const loginOnSubmit = (dicLoginInfo, callback) => {
  return async (dispatch, getState) => {
    dispatch(showLoginLoading());

    try {
      const response = await fetch(S3URL+"/"+LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers if needed
        },
        body: JSON.stringify(dicLoginInfo),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Assuming the success condition based on response structure
        if (responseData.Code === Constants.HTTP_CODE.SUCCESS) {
          dispatch(hideLoginLoading());
          callback(true, responseData.Message[0]);
          OneSignal.setExternalUserId(dicLoginInfo.username);
        } else {
          dispatch(hideLoginLoading());
          Utility.showAlert(
            Constants.ALERT.TITLE.INFO,
            Constants.VALIDATION_MSG.INPUT_VALIDATION_ERROR,
          );
        }
      } else {
        // Handle non-successful response
        dispatch(hideLoginLoading());
        Utility.showAlert(
          Constants.ALERT.TITLE.INFO,
          Constants.VALIDATION_MSG.INPUT_VALIDATION_ERROR,
        );
      }
    } catch (error) {
      dispatch(handleError(error));
    }
  };
};

export const showLoginLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.LOGIN_SHOW_LOADING,
    });
  };
};

export const hideLoginLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.LOGIN_HIDE_LOADING,
    });
  };
};

export const showForgetPasswordLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.FORGET_PWD_SHOW_LOADING,
    });
  };
};

export const hideForgetPasswordLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.FORGET_PWD_HIDE_LOADING,
    });
  };
};

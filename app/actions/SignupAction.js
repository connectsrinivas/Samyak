/*************************************************
 * GUMO
 * @exports
 * @class SignupAction.js
 * Created by Jagadish Sellamuthu on 11/11/2019
 * Copyright © 2019 GUMUGO. All rights reserved.
 *************************************************/
'use strict';

import Constants from '../util/Constants';
import Utility from '../util/Utility';
import {Actions} from 'react-native-router-flux';
import HttpBaseClient from '../util/HttpBaseClient';
import {handleError} from './NetworkAction';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';



export const checkUsernameAvailable = username => {
  return (dispatch, getState) => {
    dispatch(setCheckingStatus(1));

    HttpBaseClient.post(AsyncStorage.configUri.ch_us + username, {}, 3)
      .then(response => {
        dispatch(hideSignupLoading());
        if (response.response_code === 0) {
          dispatch(setCheckingStatus(3));
        } else {
          dispatch(setCheckingStatus(2));
        }
      })
      .catch(error => {
        dispatch(setCheckingStatus(0));
        Utility.showAlert(
          Constants.ALERT.TITLE.ERROR,
          Constants.VALIDATION_MSG.CHECK_USERNAME_FAILED,
        );
      });
  };
};

export const signupButtonSubmit = (
  firstName,
  lastName,
  userName,
  employeeId,
  password,
  phoneNumber,
  workEmailAddress,
) => {
  return (dispatch, getState) => {
    dispatch(showSignupLoading());

    HttpBaseClient.post(
      AsyncStorage.configUri.us_re,
      {
        firstName,
        lastName,
        userName,
        employeeId,
        password,
        phoneNumber,
        workEmailAddress,
      },
      3,
    )
      .then(response => {
        dispatch(hideSignupLoading());
        if (response.response_code === 0) {
          Actions.mobileOTPScreen({signupResponse: response, phoneNumber});
        } else if (response.response_code === -1) {
          Utility.showAlert(
            Constants.ALERT.TITLE.ERROR,
            Constants.VALIDATION_MSG.NOT_FOUND_SIGNUP,
          );
        } else if (response.response_code === 2) {
          Utility.showAlertWithPopAction(
            Constants.ALERT.TITLE.INFO,
            Constants.VALIDATION_MSG.ALREADY_SIGNUP,
          );
        } else if (response.response_code === 3) {
          Utility.showAlert(
            Constants.ALERT.TITLE.INFO,
            Constants.VALIDATION_MSG.NEED_DOB_SIGNUP,
          );
          dispatch(setDOBNeedorNot(true));
        } else if (
          response.response_code === 3 &&
          getState().signupState.needDOB
        ) {
          Utility.showAlert(
            Constants.ALERT.TITLE.ERROR,
            Constants.VALIDATION_MSG.DUPLICATE_SIGNUP,
          );
        } else {
          Utility.showAlert(
            Constants.ALERT.TITLE.ERROR,
            Constants.VALIDATION_MSG.SIGNUP_FAILED,
          );
        }
      })
      .catch(error => {
        dispatch(hideSignupLoading());
        Utility.showAlert(
          Constants.ALERT.TITLE.ERROR,
          Constants.VALIDATION_MSG.SIGNUP_FAILED + '123',
        );
      });
  };
};

export const signupWithDobButtonSubmit = (
  firstName,
  lastName,
  userName,
  employeeId,
  password,
  phoneNumber,
  workEmailAddress,
  dob,
) => {
  return dispatch => {
    dispatch(showSignupLoading());

    HttpBaseClient.post(
      AsyncStorage.configUri.us_re,
      {
        firstName,
        lastName,
        userName,
        employeeId,
        password,
        phoneNumber,
        workEmailAddress,
        dob,
      },
      3,
    )
      .then(response => {
        dispatch(hideSignupLoading());
        if (response.response_code === 0) {
          Actions.mobileOTPScreen({signupResponse: response, phoneNumber});
        } else if (response.response_code === -1) {
          Utility.showAlert(
            Constants.ALERT.TITLE.ERROR,
            Constants.VALIDATION_MSG.NOT_FOUND_SIGNUP,
          );
        } else if (response.response_code === 2) {
          Utility.showAlertWithPopAction(
            Constants.ALERT.TITLE.INFO,
            Constants.VALIDATION_MSG.ALREADY_SIGNUP,
          );
        } else if (response.response_code === 3) {
          Utility.showAlert(
            Constants.ALERT.TITLE.ERROR,
            Constants.VALIDATION_MSG.DUPLICATE_SIGNUP,
          );
        } else {
          Utility.showAlert(
            Constants.ALERT.TITLE.ERROR,
            Constants.VALIDATION_MSG.SIGNUP_FAILED,
          );
        }
      })
      .catch(error => {
        dispatch(hideSignupLoading());
        Utility.showAlert(
          Constants.ALERT.TITLE.ERROR,
          Constants.VALIDATION_MSG.SIGNUP_FAILED,
        );
      });
  };
};

export const setCheckingStatus = checkingStatus => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SIGNUP_SET_CHECKING_STATUS,
      checkingStatus,
    });
  };
};

export const setDOBNeedorNot = needDOB => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SIGNUP_SET_DOB_NEED_OR_NOT,
      needDOB,
    });
  };
};

export const showSignupLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SIGNUP_SHOW_LOADING,
    });
  };
};

export const hideSignupLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SIGNUP_HIDE_LOADING,
    });
  };
};

export const showPageLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SIGNUP_SHOW_PAGE_LOADING,
    });
  };
};

export const hidePageLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SIGNUP_HIDE_PAGE_LOADING,
    });
  };
};

export const resetToInitial = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SIGNUP_RESET_TO_INITIAL,
    });
  };
};

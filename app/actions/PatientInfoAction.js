/*************************************************
 * Sukraas
 * @exports
 * @class LabTestAction.js
 * Created by Shiva Sankar on 23/06/2020
 * Copyright © 2020 Sukraas. All rights reserved.
 *************************************************/

'use strict';
import _ from 'lodash';
import Constants from '../util/Constants';
import HttpBaseClient from '../util/HttpBaseClient';
import Utility from '../util/Utility';
import {handleError} from './NetworkAction';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const getPatientList = userName => {
  return dispatch => {
    dispatch(showPatientInfoLoading());

    setTimeout(function() {
      HttpBaseClient.post(
        AsyncStorage.configUri.ge_pa_li,
        {Username: userName},
        0,
      )
        .then(response => {
          dispatch(hidePatientInfoLoading());
          if (
            response.Code === 200 ||
            response.SuccessFlag.toLowerCase() === 'true'
          ) {
            dispatch({
              type: Constants.ACTIONS.UPDATE_PATIENT_INFO_LIST,
              arrPatientInfo: response.Message[0].Patient_Detail,
            });

            dispatch(getUserAddress(userName));
          } else {
            dispatch({
              type: Constants.ACTIONS.UPDATE_PATIENT_INFO_LIST,
              arrPatientInfo: [],
            });
            if (response.Message[0].Message != null) {
              // Utility.showAlert(
              //   Constants.ALERT.TITLE.ERROR,
              //   response.Message[0].Message,
              // );
            } else {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                Constants.VALIDATION_MSG.NO_DATA_FOUND,
              );
            }
          }
        })
        .catch(error => {
          dispatch(hidePatientInfoLoading());
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

export const getUserAddress = userName => {
  return dispatch => {
    dispatch(showUserAddressLoading());
    setTimeout(function() {
      HttpBaseClient.post(
        AsyncStorage.configUri.ge_us_ad,
        {Username: userName, AddressType: ''},
        0,
      )
        .then(response => {
          dispatch(hideUserAddressLoading());
          if (
            response.Code === 200 ||
            response.SuccessFlag.toLowerCase() === 'true'
          ) {
            dispatch({
              type: Constants.ACTIONS.UPDATE_USER_ADDRESS_LIST,
              arrUserAddress: response.Message[0].User_Address,
            });
          } else {
            dispatch({
              type: Constants.ACTIONS.UPDATE_USER_ADDRESS_LIST,
              arrUserAddress: [],
            });
            if (response.Message[0].Message != null) {
              // Utility.showAlert(
              //   Constants.ALERT.TITLE.ERROR,
              //   response.Message[0].Message,
              // );
            } else {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                Constants.VALIDATION_MSG.NO_DATA_FOUND,
              );
            }
          }
        })
        .catch(error => {
          dispatch(hideUserAddressLoading());
          dispatch(handleError(error));
        });
    }, 2000);
  };
};

export const setSelectedUserAddress = addressArray => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SELECTED_ADDRESS,
      selectedAddress: addressArray,
    });
  };
};

export const setSelectedPatient = patientArray => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SELECTED_PATIENT,
      selectedPatient: patientArray,
    });
  };
};

export const setLoginMobileNumber = mobileNumber => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.LOGGINED_USER_MOBILE_NO,
      selectedLoginMobileNo: mobileNumber,
    });
  };
};

export const setLoginFirmNumber = firmNumber => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.LOGGINED_USER_FIRM_NO,
      selectedLoginFirmNo: firmNumber,
    });
  };
};

export const showPatientInfoLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_PATIENT_INFO_LOADING,
    });
  };
};

export const hidePatientInfoLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_PATIENT_INFO_LOADING,
    });
  };
};

export const showUserAddressLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_USER_ADDRESS_LOADING,
    });
  };
};

export const hideUserAddressLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_USER_ADDRESS_LOADING,
    });
  };
};

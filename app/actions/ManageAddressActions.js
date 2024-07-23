'use strict';
import _ from 'lodash';
import {Actions} from 'react-native-router-flux';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
import {handleError} from './NetworkAction';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const invokeManageAddress = (dictManageInfo, callback) => {
  return dispatch => {
    dispatch(showManageAddressLoading());

    setTimeout(function() {
      HttpBaseClient.post(AsyncStorage.configUri.ge_us_ad, dictManageInfo, 0)
        .then(response => {
          dispatch(hideManageAddressLoading());

          if (response.Code === 200) {
            callback(response);
            return dispatch({
              type: Constants.ACTIONS.GET_MANAGEADDRESS_LIST_DETAILS,
              payload: response.Message[0].User_Address,
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
          dispatch(hideManageAddressLoading());
          dispatch(handleError(error));
        });
    }, 500);
  };
};
/**
 * Invoke Delete Address webservice to get Delete Address information
 */
export const invokeDeleteAddress = (Username, Address_Type, callback) => {
  return dispatch => {
    dispatch(showManageAddressLoading());

    HttpBaseClient.post(
      AsyncStorage.configUri.de_us_ad,
      {
        UserName: Username,
        Address_Type: Address_Type,
      },
      0,
    )
      .then(response => {
        dispatch(hideManageAddressLoading());
        if (_.has(response, 'Code') && _.has(response, 'SuccessFlag')) {
          if (response.Code === 200 || response.SuccessFlag.toLowerCase() === 'true') {
            if (_.has(response, 'Message') && response.Message.length > 0) {
              if (
                _.has(response.Message[0], 'User_Address') &&
                response.Message[0].User_Address !== null
              ) {
                callback(false);
                dispatch({
                  type: Constants.ACTIONS.GET_MANAGEADDRESS_LIST_DETAILS,
                  payload: response.Message[0].User_Address,
                });
              } else {
                callback(true);
                dispatch({
                  type: Constants.ACTIONS.GET_MANAGEADDRESS_LIST_DETAILS,
                  payload: [],
                });
              }
            }
          }
        } else {
          dispatch(hideManageAddressLoading());
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
        dispatch(hideManageAddressLoading());
        dispatch(handleError(error));
      });
  };
};
export const showManageAddressLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_MANAGEADDRESS_LOADING,
    });
  };
};

export const hideManageAddressLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_MANAGEADDRESS_LOADING,
    });
  };
};

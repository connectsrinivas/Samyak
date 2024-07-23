'use strict';

import _ from 'lodash';
import {Actions} from 'react-native-router-flux';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
import {Alert} from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {handleError} from './NetworkAction';

export const getOnlinepaymentDetails = (phoneNumber, password, callback) => {
  return dispatch => {
    dispatch(showOnlinepaymentLoading());
    setTimeout(function() {
      HttpBaseClient.post(
        AsyncStorage.configUri.us_vi,
        {Username: phoneNumber, Password: password},
        0,
      )
        .then(response => {
          dispatch(hideOnlinepaymentLoading());
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            callback(true);
            return dispatch({
              type: Constants.ACTIONS.GET_ONLINEPAYMENT_DETAILS,
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
          dispatch(hideOnlinepaymentLoading());
          dispatch(handleError(error));
        });
    }, 500);
  };
};

export const invokeInitiatePayment = (postData, callback) => {
  return dispatch => {
    dispatch(showOnlinepaymentLoading());
    setTimeout(function() {
      HttpBaseClient.post(
        'http://103.146.234.52:7021/App_RT_UAT/Api/Patient/PayConfigurations_PayU',
        postData,
        0,
      )
        .then(response => {
          dispatch(hideOnlinepaymentLoading());
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            const payData = {
              amount: response.Message.billAmount,
              txnId: response.Message.transactionId,
              productName: response.Message.productInfo,
              firstName: response.Message.firstName,
              email: response.Message.email,
              phone: response.Message.phoneNo,
              merchantId: response.Message.paymentData[0].mId,
              key: response.Message.paymentData[0].mKey,
              successUrl:
                response.Message.paymentUrlList[0].responseUrl_Success,
              failedUrl: response.Message.paymentUrlList[0].responseUrl_Failure,
              isDebug: !response.Message.isDebug,
              hash: response.Message.paymentData[0].hashValue,
            };
            console.log('Pay Data ', payData);
            callback(true, payData);

            return dispatch({
              type: Constants.ACTIONS.GET_PAYUMONEY_DETAILS,
              payload: payData,
            });
          } else {
            callback(false, {});
            if (response.Message[0].Message != null) {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                response.Message[0].Message,
              );
            } else {
              Utility.showAlert(Constants.ALERT.TITLE.ERROR, 'Try Again');
            }
          }
        })

        .catch(error => {
          dispatch(hideOnlinepaymentLoading());
          dispatch(handleError(error));
        });
    }, 500);
  };
};
export const Checksum = (postData, callback) => {
  return dispatch => {
    dispatch(showOnlinepaymentLoading());
    setTimeout(function() {
      HttpBaseClient.post(
        'http://103.146.234.52:7021/App_RT_UAT/Api/Patient/CheckSum',
        postData,
        0,
      )
        .then(response => {
          dispatch(hideOnlinepaymentLoading());
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            console.log('Pay Data ', response.Message.hashValue);
            callback(true, response.Message.hashValue);

            return dispatch({
              type: Constants.ACTIONS.GET_PAYUMONEY_DETAILS,
              payload: payData,
            });
          } else {
            callback(false, {});
            if (response.Message[0].Message != null) {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                response.Message[0].Message,
              );
            } else {
              Utility.showAlert(Constants.ALERT.TITLE.ERROR, 'Try Again');
            }
          }
        })

        .catch(error => {
          dispatch(hideOnlinepaymentLoading());
          dispatch(handleError(error));
        });
    }, 500);
  };
};

export const showOnlinepaymentLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_ONLINEPAYMENT_LOADING,
    });
  };
};

export const hideOnlinepaymentLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_ONLINEPAYMENT_LOADING,
    });
  };
};

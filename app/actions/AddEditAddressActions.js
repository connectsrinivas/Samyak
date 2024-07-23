/*************************************************
 * SukraasLIS
 * @exports
 * @class AddEditAddressActions.js
 * @extends Component
 * Created by Monisha on 09/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import _ from 'lodash';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
import {handleError} from './NetworkAction';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const invokeSubmitAddress = (dictsubmit, callback) => {
  return async dispatch => {
    dispatch({
      type: Constants.ACTIONS.SUBMIT_BUTTON_CLICKED,
    });
    await HttpBaseClient.post(AsyncStorage.configUri.ad_us_ad, dictsubmit, 0)
      .then(response => {  
        dispatch({
          type: Constants.ACTIONS.SUBMIT_BUTTON_SUCCESS,
        });
        if (response.Code === 200) {
          if (response.SuccessFlag.toLowerCase() === 'true') {
            callback(true);
          } else {
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              Constants.VALIDATION_MSG.NO_DATA_FOUND,
            );
          }
        } else {
          dispatch({
            type: Constants.ACTIONS.SUBMIT_BUTTON_FAILED,
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
        dispatch(handleError(error));
        dispatch({
          type: Constants.ACTIONS.SUBMIT_BUTTON_FAILED,
        });
        // Utility.showAlert(
        //   Constants.ALERT.TITLE.ERROR,
        //   Constants.VALIDATION_MSG.ERROR_CATCH,
        // );
      });
  };
};

/**
 * Invoke update Address webservice to get updated Address
 */
export const invokeUpdateAddress = (dictUpdateInfo, callback) => {
  return async dispatch => {
    dispatch({
      type: Constants.ACTIONS.UPDATE_BUTTON_CLICKED,
      payload: dictUpdateInfo,
    });
    await HttpBaseClient.post(AsyncStorage.configUri.ed_us_ad, dictUpdateInfo, 0)
      .then(response => {
        dispatch({
          type: Constants.ACTIONS.UPDATE_BUTTON_SUCCESS,
        });
        if (response.Code === 200) {
          if (response.SuccessFlag.toLowerCase() === 'true') {
            callback(true);
          } else {
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              Constants.VALIDATION_MSG.NO_DATA_FOUND,
            );
          }
        } else {
          dispatch({
            type: Constants.ACTIONS.UPDATE_BUTTON_FAILED,
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
        dispatch(handleError(error));
        dispatch({
          type: Constants.ACTIONS.UPDATE_BUTTON_FAILED,
        });

        // Utility.showAlert(
        //   Constants.ALERT.TITLE.ERROR,
        //   Constants.VALIDATION_MSG.ERROR_CATCH,
        // );
      });
  };
};

/**
 * Invoke AddressType webservice to get AddressType information
 */
export const invokeAddressType = () => {
  return async dispatch => {
    await HttpBaseClient.post(AsyncStorage.configUri.ge_ad_ty, {}, 0)
      .then(response => {
        if (_.has(response, 'Code') && _.has(response, 'SuccessFlag')) {
          if (
            response.Code === 200 ||
            response.SuccessFlag.toLowerCase() === 'true'
          ) {
            if (_.has(response, 'Message') && response.Message.length > 0) {
              dispatch({
                type: Constants.ACTIONS.UPDATE_ADDRESS_TYPE_LIST,
                addressTypeList: response.Message,
              });
            }
          }
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
        dispatch(handleError(error));

        // Utility.showAlert(
        //   Constants.ALERT.TITLE.ERROR,
        //   Constants.VALIDATION_MSG.ERROR_CATCH,
        // );
      });
  };
};
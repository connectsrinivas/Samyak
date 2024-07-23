/*************************************************
 * SukraasLIS
 * @exports
 * @class ContactAction.js
 * Created by Shive Sankar on 09/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import _ from 'lodash';
import Constants from '../util/Constants';
import HttpBaseClient from '../util/HttpBaseClient';
import Utility from '../util/Utility';
import {handleError} from './NetworkAction';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const getContactDetails = () => {
  return dispatch => {
    dispatch(showContactPageLoading());
    setTimeout(function() {
      HttpBaseClient.post(AsyncStorage.configUri.co_us, {}, 0)
        .then(response => {
          if (_.has(response, 'Code') && _.has(response, 'SuccessFlag')) {
            if (
              response.Code === 200 ||
              response.SuccessFlag.toLowerCase() === 'true'
            ) {
              if (_.has(response, 'Message') && response.Message.length > 0) {
                dispatch(hideContactPageLoading());
                dispatch({
                  type: Constants.ACTIONS.GET_CONTACT_SCREEN_INFO,
                  payload: response.Message,
                });
              }
            }
          } else {
            dispatch(hideContactPageLoading());
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
          dispatch(hideContactPageLoading());
          dispatch(handleError(error));
        });
    }, 2000);
  };
};

export const showContactPageLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_CONTACT_SCREEN_LOADING,
    });
  };
};

export const hideContactPageLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_CONTACT_SCREEN_LOADING,
    });
  };
};

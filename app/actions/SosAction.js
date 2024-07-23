'use strict';

import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {handleError} from './NetworkAction';

export const updateSOSAlert = (postData, callback) => {
  return dispatch => {
    setTimeout(function() {
      HttpBaseClient.post(AsyncStorage.configUri.so_al, postData, 0)
        .then(response => {
          dispatch(hideSosLoading());
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            Utility.showAlert(
              Constants.ALERT.TITLE.SUCCESS,
              response.Message[0].Message,
            );
            callback(true, response.Message[0]);
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
          dispatch(hideSosLoading());
          dispatch(handleError(error));
        });
    }, 500);
  };
};

export const showSosLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SOS_SHOW_LOADING,
    });
  };
};

export const hideSosLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SOS_HIDE_LOADING,
    });
  };
};

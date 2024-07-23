'use strict';

import _ from 'lodash';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {handleError} from './NetworkAction';

export const getProfileDetails = (phoneNumber, password, callback) => {
  return dispatch => {
    dispatch(showProfileLoading());
    setTimeout(function() {
      HttpBaseClient.post(
        AsyncStorage.configUri.us_vi,
        {Username: phoneNumber, Password: password},
        0,
      )
        .then(response => {
          dispatch(hideProfileLoading());
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            dispatch({
              type: Constants.ACTIONS.GET_PROFILE_DETAILS,
              payload: response.Message[0],
            });

            dispatch({
              type: Constants.ACTIONS.USER_PROFILE_IMAGE,
              url: response.Message[0].User_Image_URL,
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
          dispatch(hideProfileLoading());
          dispatch(handleError(error));
        });
    }, 2000);
  };
};

export const updateProfileDetails = (post, callback) => {
  return dispatch => {
    dispatch(showProfileLoading());
    setTimeout(function() {
      HttpBaseClient.post(AsyncStorage.configUri.up_us_pr, post, 0)
        .then(response => {
          dispatch(hideProfileLoading());
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            callback(true);
            dispatch({
              type: Constants.ACTIONS.GET_PROFILE_DETAILS,
              payload: response.Message[0],
            });
            dispatch({
              type: Constants.ACTIONS.USER_PROFILE_IMAGE,
              url: response.Message[0].User_Image_URL,
            });

            Utility.showAlert(
              Constants.ALERT.TITLE.SUCCESS,
              Constants.VALIDATION_MSG.PROFILE_UPDATE_SUCCESS,
            );
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
          dispatch(hideProfileLoading());
          dispatch(handleError(error));
        });
    }, 2000);
  };
};

export const showProfileLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.PROFILE_SHOW_LOADING,
    });
  };
};

export const hideProfileLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.PROFILE_HIDE_LOADING,
    });
  };
};

'use strict';
import _ from 'lodash';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
import {handleError} from './NetworkAction';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';



export const getUserListDetails = (phoneNumber, callback) => {
  return dispatch => {
    dispatch(showUserListLoading());
    setTimeout(function() {
      HttpBaseClient.post(
        AsyncStorage.configUri.ge_pa_li,
        {Username: phoneNumber},
        0,
      )
        .then(response => {
          dispatch(hideUserListLoading());
          if (response.Code === 200) {
            callback(true);
            return dispatch({
              type: Constants.ACTIONS.GET_USER_LIST_DETAILS,
              payload: response.Message[0].Patient_Detail,
            });
          } else {
            callback(false);
            if (response.Message[0].Message != null) {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                response.Message[0].Message,
              );
              return dispatch({
                type: Constants.ACTIONS.GET_USER_LIST_DETAILS,
                payload: [],
              });
            } else {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                Constants.VALIDATION_MSG.NO_DATA_FOUND,
              );
              return dispatch({
                type: Constants.ACTIONS.GET_USER_LIST_DETAILS,
                payload: [],
              });
            }
          }
        })
        .catch(error => {
          dispatch(hideUserListLoading());
          dispatch(handleError(error));
        });
    }, 500);
  };
};

/**
 * Invoke Delete Patient webservice to get Delete Patient information
 */
export const invokeDeletePatient = (Username, PtCode, callback) => {
  return dispatch => {
    dispatch(showUserListLoading());

    HttpBaseClient.post(
      AsyncStorage.configUri.de_pa,
      {
        UserName: Username,
        Pt_Code: PtCode,
      },
      0,
    )
      .then(response => {
        dispatch(hideUserListLoading());
        if (_.has(response, 'Code') && _.has(response, 'SuccessFlag')) {
          if (
            response.Code === 200 ||
            response.SuccessFlag.toLowerCase() === 'true'
          ) {
            if (_.has(response, 'Message') && response.Message.length > 0) {
              callback(true);
              Utility.showAlert(
                Constants.ALERT.TITLE.SUCCESS,
                response.Message[0].Message,
              );
            }
          }
        } else {
          dispatch(hideUserListLoading());
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
        dispatch(hideUserListLoading());
        dispatch(handleError(error));
      });
  };
};

export const showUserListLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_USER_LIST_LOADING,
    });
  };
};

export const hideUserListLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_USER_LIST_LOADING,
    });
  };
};

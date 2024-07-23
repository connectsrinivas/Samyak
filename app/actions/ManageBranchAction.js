/*************************************************
 * SukraasLIS
 * @exports
 * @class ManageBranchAction.js
 * @extends Component
 * Created by Shiva Sankar on 01/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import _ from 'lodash';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {handleError} from './NetworkAction';

/**
 * Invoke Branch webservice to get Branch Detail information
 */
export const invokeGetBranchDetail = () => {
  return dispatch => {
    dispatch(showManageBranchLoading());
    HttpBaseClient.post(AsyncStorage.configUri.ge_br_de, {}, 0)
      .then(response => {
        dispatch(hideManageBranchLoading());
        if (_.has(response, 'Code') && _.has(response, 'SuccessFlag')) {
          if (
            response.Code === 200 ||
            response.SuccessFlag.toLowerCase() === 'true'
          ) {
            if (_.has(response, 'Message') && response.Message.length > 0) {
              dispatch({
                type: Constants.ACTIONS.UPDATE_MANAGE_BRANCH_LIST,
                branchList: response.Message,
              });
              dispatch(hideManageBranchLoading());
            }
          }
        } else {
          dispatch(hideManageBranchLoading());
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
        dispatch(hideManageBranchLoading());
        dispatch(handleError(error));
      });
  };
};

/**
 * Invoke USER_VS_DEFAULT_BRANCH webservice to get USER_VS_DEFAULT_BRANCH information
 */
export const invokeUserVsDefaultBranch = (
  userName,
  firmNo,
  isFromSettings,
  branchName,
  callback,
) => {
  return async dispatch => {
    dispatch(showManageBranchLoading());
    HttpBaseClient.post(
     await AsyncStorage.configUri.us_de_br,
      {
        UserName: userName,
        Default_Firm_No: firmNo,
      },
      0,
    )
      .then(response => {
        dispatch(hideManageBranchLoading());
        if (_.has(response, 'Code') && _.has(response, 'SuccessFlag')) {
          if (
            response.Code === 200 ||
            response.SuccessFlag.toLowerCase() === 'true'
          ) {
            if (_.has(response, 'Message') && response.Message.length > 0) {
              callback(true, response.Message[0]);
              dispatch({
                type: Constants.ACTIONS.UPDATE_DEFAULT_BRANCH,
                defaultBranch: response.Message[0],
              });

              Utility.showAlert(
                Constants.ALERT.TITLE.SUCCESS,
                Constants.VALIDATION_MSG.BRANCH_UPDATED,
              );
            }
          }
        } else {
          dispatch(hideManageBranchLoading());
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
        dispatch(hideManageBranchLoading());
        dispatch(handleError(error));
      });
  };
};

export const showManageBranchLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_MANAGE_BRANCH_LOADING,
    });
  };
};

export const hideManageBranchLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_MANAGE_BRANCH_LOADING,
    });
  };
};

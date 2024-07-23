/*************************************************
 * SukraasLIS
 * @exports
 * @class ManageUsersScreen.js
 * @extends Component
 * Created by Kishore on 9/7/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import _ from 'lodash';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
import {handleError} from './NetworkAction';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const callTermsAndConditionInfo = () => {
  return dispatch => {
    dispatch(showTermsScreenLoading());
    setTimeout(function() {
      HttpBaseClient.post(AsyncStorage.configUri.te_co, {}, 2)
        .then(response => {
          dispatch(HideTermsScreenLoading());
          if (response.Code === 200) {
            dispatch({
              type: Constants.ACTIONS.GET_TERMS_SCREEN_INFO,
              payload: response.Message[0],
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
          dispatch(HideTermsScreenLoading());
          dispatch(handleError(error));
        });
    }, 1000);
  };
};

export const showTermsScreenLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_TERMS_SCREEN_LOADING,
    });
  };
};

export const HideTermsScreenLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_TERMS_SCREEN_LOADING,
    });
  };
};

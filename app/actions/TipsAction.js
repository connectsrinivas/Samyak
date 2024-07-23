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

export const getTipsDetails = callback => {
  return dispatch => {
    dispatch(showTipsLoading());
    setTimeout(function() {
      HttpBaseClient.post(AsyncStorage.configUri.he_ti, {}, 0)
        .then(response => {
          dispatch(hideTipsLoading());
          if (response.Code === 200) {
            callback(true);
            return dispatch({
              type: Constants.ACTIONS.GET_TIPS_DETAILS,
              payload: JSON.stringify(response.Message),
            });
          } else {
            if (response.Message[0].Message != null) {
              // Utility.showAlert(
              //   Constants.ALERT.TITLE.ERROR,
              //   response.Message[0].Message,
              // );
            } else {
              // Utility.showAlert(
              //   Constants.ALERT.TITLE.ERROR,
              //   Constants.VALIDATION_MSG.NO_DATA_FOUND,
              // );
            }
          }
        })
        .catch(error => {
          dispatch(hideTipsLoading());
          dispatch(handleError(error));
        });
    }, 500);
  };
};

export const showTipsLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_TIPS_SCREEN_LOADING,
    });
  };
};

export const hideTipsLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_TIPS_SCREEN_LOADING,
    });
  };
};

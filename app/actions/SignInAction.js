/*************************************************
 * Sukraas
 * @exports
 * @class SignInAction.js
 * Created by Jagadish Sellamuthu on 12/05/2020
 * Copyright © 2020 Sukraas. All rights reserved.
 *************************************************/
'use strict';

import Constants from '../util/Constants';
import Utility from '../util/Utility';
import _ from 'lodash';
import {Actions} from 'react-native-router-flux';
import HttpBaseClient from '../util/HttpBaseClient';
import {OAUTH} from '../util/URL';

export const loginButtonSubmit = (
  username,
  password,
  oneSignalId,
  callback,
) => {
  return (dispatch, getState) => {
    Actions.homeScreenTab();
    dispatch(showLoginLoading());

    HttpBaseClient.post(
      OAUTH,
      {grant_type: 'password', username, password},
      2,
    ).then(response => {
          dispatch(hideLoginLoading());
          if (
            _.has(response, 'access_token') &&
            _.has(response, 'token_type') &&
            _.has(response, 'refresh_token') &&
            _.has(response, 'expires_in') &&
            _.has(response, 'userInfo')
          ) {
            Actions.homeScreenTab();
          } else {
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              Constants.VALIDATION_MSG.AUTH_FAILED,
            );
          }
        })
        .catch(error => {
          dispatch(hideLoginLoading());
          Utility.showAlert(
            Constants.ALERT.TITLE.ERROR,
            Constants.VALIDATION_MSG.AUTH_FAILED,
          );
    });
  };
};

export const showLoginLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.LOGIN_SHOW_LOADING,
    });
  };
};

export const hideLoginLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.LOGIN_HIDE_LOADING,
    });
  };
};

export const showPageLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.LOGIN_SHOW_PAGE_LOADING,
    });
  };
};

export const hidePageLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.LOGIN_HIDE_PAGE_LOADING,
    });
  };
};

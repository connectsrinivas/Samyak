/*************************************************
 * Sukraas
 * @exports
 * @class LogoutAction.js
 * Created by Sankar on 09/06/2020
 * Copyright © 2020 Sukraas. All rights reserved.
 *************************************************/
'use strict';
import Constants from '../util/Constants';
// import OneSignal from 'react-native-onesignal';

export const clearAllStates = phoneNumber => {
  return dispatch => {
    // OneSignal.removeExternalUserId();
    dispatch({
      type: Constants.ACTIONS.LOGOUT_USER,
    });
  };
};

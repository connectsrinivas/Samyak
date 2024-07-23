/*************************************************
 * GUMO
 * @exports
 * @class SplashAction.js
 * Created by Jagadish Sellamuthu on 11/11/2019
 * Copyright © 2019 GUMUGO. All rights reserved.
 *************************************************/
'use strict';

import {NetInfo, Alert} from 'react-native';

import Constants from '../util/Constants';
import Utility from '../util/Utility';
// import { checkMinimumVersion } from './SplashAction';
import {Actions} from 'react-native-router-flux';

export const checkMinimumVersion = () => {
  return dispatch => {
    dispatch(showSpinner());
  };
};

export const showSpinner = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SPLASH_SHOW_LOADING,
    });
  };
};

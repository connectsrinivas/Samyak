/*************************************************
 * GUMO
 * @exports
 * @class DeviceReducer.js
 * Created by Jagadish Sellamuthu on 11/11/2019
 * Copyright © 2019 GUMUGO. All rights reserved.
 *************************************************/

'use strict';

import Constants from '../util/Constants';

let initialState = {
  isNetworkConnectivityAvailable: undefined, //Used to check whether internet is connected or not
  isTouchIdAvailable: false, //Used to check whether touch id support available in device or not
  useTouchID: true, //Used to check whether touch id support enabled from user preference in settings option
  isSystemAlertShowing: false, //used to check whether system alert is showing or not
};

const {
  ACTIONS: {
    NETWORK_STATUS_CHANGED,
    PREF_UPDATE_TOUCH_ID_STATUS,
    PREF_UPDATE_GOOGLE_ANALYTICS_STATUS,
    PREF_UPDATE_DEVICE_TOUCH_ID_AVAILABLE,
    DEVICE_ALERT_DISPLAYED,
    DEVICE_ALERT_CLOSED,
    DEVICE_ALERT_UPDATE,
    UPDATE_CODE_PUSH_VERSION,
  },
} = Constants;

export const deviceState = (state = initialState, action) => {
  const {
    type,
    useTouchID,
    useGoogleAnalytics,
    isTouchIdAvailable,
    isNetworkConnectivityAvailable,
    isSystemAlertShowing,
    codePushVersion,
  } = action;
  switch (type) {
    case NETWORK_STATUS_CHANGED:
      return {...state, isNetworkConnectivityAvailable};
    case PREF_UPDATE_TOUCH_ID_STATUS:
      return {...state, useTouchID};
    case PREF_UPDATE_GOOGLE_ANALYTICS_STATUS:
      return {...state, useGoogleAnalytics};
    case PREF_UPDATE_DEVICE_TOUCH_ID_AVAILABLE:
      return {...state, isTouchIdAvailable};
    case DEVICE_ALERT_DISPLAYED:
      return {...state, isSystemAlertShowing: true};
    case DEVICE_ALERT_CLOSED:
      return {...state, isSystemAlertShowing: false};
    case DEVICE_ALERT_UPDATE:
      return {...state, isSystemAlertShowing};
    case UPDATE_CODE_PUSH_VERSION:
      return {...state, codePushVersion};
    default:
      return state;
  }
};

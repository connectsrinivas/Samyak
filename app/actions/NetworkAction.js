/*************************************************
 * GUMO
 * @exports
 * @class NetworkAction.js
 * Created by Jagadish Sellamuthu on 11/11/2019
 * Copyright © 2019 GUMUGO. All rights reserved.
 *************************************************/
'use strict';

import { Alert } from 'react-native';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';

import Constants from '../util/Constants';
import Utility from '../util/Utility';
// import { checkMinimumVersion } from './SplashAction';
import { Actions } from 'react-native-router-flux';
// import OneSignal from 'react-native-onesignal';

/**
 * Checks the internet connection and sets the status in the state of the store
 */
export const checkNetworkConnection = () => {
  return (dispatch, getState) => {
    dispatch(initPushNotification());
    NetInfo.addEventListener(state => {
      console.log(state, "👌👌👌👌👌👌👌")
      const {
        ACTIONS: { NETWORK_STATUS_CHANGED },
      } = Constants;
      if (getState().deviceState.isNetworkConnectivityAvailable === undefined) {
        showSpinner();
        dispatch({
          type: NETWORK_STATUS_CHANGED,
          isNetworkConnectivityAvailable: state.isConnected,
        });
        // setTimeout(function() {
        //   callback(true, state.isConnected);
        // }, 2000);
        // dispatch(checkMinimumVersion());
        setTimeout(() => {
          // if (isLoggedIn === 'true') {
          //   Actions.homeTabBar();
          // } else {
          //   Actions.LoginScreen();
          // }
        }, 0);
      } else {
        hideSpinner();
        dispatch({
          type: NETWORK_STATUS_CHANGED,
          isNetworkConnectivityAvailable: state.isConnected,
        });
        // setTimeout(function() {
        //   callback(true, state.isConnected);
        // }, 2000);
      }
    });
  };
};

/**
 * Checks the internet connection and sets the status in the state of the store
 */
export const initPushNotification = () => {
  return (dispatch, getState) => {
    // OneSignal.init('31502278-5902-4d36-9ba1-5486a67b6fa3', {
    //   kOSSettingsKeyAutoPrompt: true,
    // }); // set kOSSettingsKeyAutoPrompt to false prompting manually on iOS

    // OneSignal.addEventListener('received', notification => {
    //   console.log('Notification received*******: ', notification);

    //   if (notification.isAppInFocus) {
    //     if (notification.payload.body) {
    //       if (notification.payload.body !== null) {
    //         Utility.showAlert(
    //           notification.payload.title,
    //           notification.payload.body,
    //         );
    //       }
    //     }
    //   } else {
    //     if (notification.payload.additionalData) {
    //       if (notification.payload.additionalData.Navigate_Type) {
    //         // background
    //       }
    //     }
    //   }
    // });
    // OneSignal.addEventListener('opened', notification => {
    //   /*
    //    * navigate to notification screen if type_id = 1: notification, type_id = 2: post
    //    * else navigate to home screen tab and move to message screen.
    //    */
    //   OneSignal.clearOneSignalNotifications();
    //   if (notification.notification.payload.additionalData) {
    //     if (
    //       notification.notification.payload.additionalData.Navigate_Type ===
    //       'Booking_Detail'
    //     ) {
    //       Actions.splashScreen({
    //         isFromNotification: true,
    //         notificationData: notification.notification.payload.additionalData,
    //       });
    //     }
    //   }
    // });

    // OneSignal.addEventListener('ids', device => {
    //   dispatch({
    //     type: Constants.ACTIONS.UPDATE_ONE_SIGNAL_DETAILS,
    //     oneSignalId: device.userId,
    //   });
    // });
    // OneSignal.inFocusDisplaying(0);
  };
};

/**
 * Checks the internet connection and sets the status in the state of the store
 */
export const handleErrorSplash = (error, showAlert = true) => {
  return (dispatch, getState) => {
    try {
      if (error) {
        if (
          error.status === Constants.HTTP_CODE.AUTHENTICATION_FAILURE ||
          error.status === Constants.HTTP_CODE.REQUIRED_MISSING
        ) {
          Alert.alert(
            Constants.ALERT.TITLE.EXPIRED,
            Constants.VALIDATION_MSG.EXPIRED,
            [
              {
                text: Constants.ALERT.BTN.OK,
                onPress: () => {
                  // call logout action
                },
              },
            ],
            { cancelable: false },
          );
        } else {
          if (showAlert) {
            if (!getState().deviceState.isNetworkConnectivityAvailable) {
              Utility.showAlertWithPopAction(
                Constants.ALERT.TITLE.FAILED,
                Constants.VALIDATION_MSG.NO_INTERNET,
              );
            } else if (error.status && error.status === 422) {
              Utility.showAlertWithPopAction(
                Constants.ALERT.TITLE.FAILED,
                'Permission denied.',
              );
            } else if (error.message) {
              if (error.message.includes('Network Error')) {
                Utility.showAlertWithPopAction(
                  Constants.ALERT.TITLE.FAILED,
                  Constants.VALIDATION_MSG.NO_INTERNET,
                );
              } else if (error.message.includes('timeout of')) {
                Utility.showAlertWithPopAction(
                  Constants.ALERT.TITLE.FAILED,
                  Constants.VALIDATION_MSG.TIME_OUT_ERROR_MESSAGE,
                );
              } else {
                Utility.showAlertWithPopAction(
                  Constants.ALERT.TITLE.FAILED,
                  Constants.VALIDATION_MSG.REQ_FAILED,
                );
              }
            } else {
              Utility.showAlertWithPopAction(
                Constants.ALERT.TITLE.FAILED,
                Constants.VALIDATION_MSG.REQ_FAILED,
              );
            }
          }
        }
      } else {
        Utility.showAlertWithPopAction(
          Constants.ALERT.TITLE.FAILED,
          Constants.VALIDATION_MSG.NO_INTERNET,
        );
      }
    } catch (e) {
      Utility.showAlert(
        Constants.ALERT.TITLE.WENT_WRONG,
        Constants.VALIDATION_MSG.WENT_WRONG,
      );
    }
  };
};

export const handleError = (error, showAlert = true) => {
  return (dispatch, getState) => {
    try {
      if (error) {
        if (
          error.status === Constants.HTTP_CODE.AUTHENTICATION_FAILURE ||
          error.status === Constants.HTTP_CODE.REQUIRED_MISSING
        ) {
          Alert.alert(
            Constants.ALERT.TITLE.EXPIRED,
            Constants.VALIDATION_MSG.EXPIRED,
            [
              {
                text: Constants.ALERT.BTN.OK,
                onPress: () => {
                  // call logout action
                },
              },
            ],
            { cancelable: false },
          );
        } else {
          if (showAlert) {
            if (!getState().deviceState.isNetworkConnectivityAvailable) {
              Utility.showAlert(
                Constants.ALERT.TITLE.FAILED,
                Constants.VALIDATION_MSG.NO_INTERNET,
              );
            } else if (error.status && error.status === 422) {
              Utility.showAlert(
                Constants.ALERT.TITLE.FAILED,
                'Permission denied.',
              );
            } else if (error.message) {
              if (error.message.includes('Network Error')) {
                Utility.showAlert(
                  Constants.ALERT.TITLE.FAILED,
                  Constants.VALIDATION_MSG.NO_INTERNET,
                );
              } else if (error.message.includes('timeout of')) {
                Utility.showAlert(
                  Constants.ALERT.TITLE.FAILED,
                  Constants.VALIDATION_MSG.TIME_OUT_ERROR_MESSAGE,
                );
              }
            } else {
              Utility.showAlert(
                Constants.ALERT.TITLE.FAILED,
                Constants.VALIDATION_MSG.REQ_FAILED,
              );
            }
          }
        }
      } else {  0
        Utility.showAlert(
          Constants.ALERT.TITLE.FAILED,
          Constants.VALIDATION_MSG.NO_INTERNET,
        );
      }
    } catch (e) {
      Utility.showAlert(
        Constants.ALERT.TITLE.WENT_WRONG,
        Constants.VALIDATION_MSG.WENT_WRONG,
      );
    }
  };
};

export const showSpinner = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SPLASH_SHOW_LOADING,
    });
  };
};

export const hideSpinner = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SPLASH_HIDE_LOADING,
    });
  };
};

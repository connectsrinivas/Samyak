/*************************************************
 * SukraasLIS
 * ConfigAction.js
 * Created by Sankar on 8/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/
'use strict';
import _ from 'lodash';
import Constants from '../util/Constants';
import HttpBaseClient from '../util/HttpBaseClient';
import Utility from '../util/Utility';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const configAPICall = callback => {
  return (dispatch, getState) => {
    dispatch(showConfigLoading());
    setTimeout(function() {
      console.log("ConfigApicallendpoint=========>",AsyncStorage.configUri.ap_se);
      HttpBaseClient.post(AsyncStorage.configUri.ap_se, {}, 0)
        .then(response => {
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            callback(true, response.Message[0]);
            // dispatch(hideConfigLoading());
          } else {
            dispatch(hideConfigLoading());
            Utility.showAlert(
              Constants.ALERT.TITLE.INFO,
              Constants.VALIDATION_MSG.ERROR_CATCH,
            );
          }
        })
        .catch(error => {
          Utility.showAlertWithExitApp(
            Constants.ALERT.TITLE.FAILED,
            Constants.VALIDATION_MSG.NO_INTERNET,
          );
        });
    }, 500);
  };
};

export const showConfigLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SHOW_LOADING,
    });
  };
};

export const hideConfigLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_HIDE_LOADING,
    });
  };
};

export const setCurrency = currency => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SET_CURRENCY,
      currency: currency,
    });
  };
};

export const setFirmName = firmName => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SET_FIRM_NAME,
      firmName: firmName,
    });
  };
};

export const setFirmNo = firmNo => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SET_FIRM_NO,
      firmNo: firmNo,
    });
  };
};

export const setUploadSize = uploadSize => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SET_UPLOAD_SIZE,
      uploadSize: uploadSize,
    });
  };
};
export const setProfileUploadSize = uploadSize => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SET_PROFILE_UPLOAD_SIZE,
      profileUploadSize: uploadSize,
    });
  };
};

export const setMobileNo = mobileNo => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SET_MOBILE_NO,
      mobileNo: mobileNo,
    });
  };
};

export const setProfileImage = url => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.USER_PROFILE_IMAGE,
      url: url,
    });
  };
};

export const setDeviceInfo = deviceInfoData => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SET_DEVICE_INFO_DATA,
      deviceInfoData: deviceInfoData,
    });
  };
};

export const setOnlinePaymentUrl = paymentUrl => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SET_ONLINE_PAYMENT_URL,
      paymentUrl: paymentUrl,
    });
  };
};

export const setDeliveryDistance = distance => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SET_DELIVERY_DISTANCE,
      distance: distance,
    });
  };
};

export const setBranchLatitude = latitude => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SET_BRANCH_LATITUDE,
      latitude: latitude,
    });
  };
};

export const setBranchLongitude = longitude => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SET_BRANCH_LONGITUDE,
      longitude: longitude,
    });
  };
};

export const setPatientLimit = patientLimit => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SET_PATIENT_LIMIT,
      patientLimit: patientLimit,
    });
  };
};
export const setManageAddressStatus = showManageAddress => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SHOW_MANAGE_ADDRESS,
      showManageAddress: showManageAddress,
    });
  };
};

export const setMenuList = menuList => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SET_MENU_LIST,
      menuList: menuList,
    });
  };
};

export const setSOSAlert = showSOSAlert => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SHOW_SOS_ALERT,
      showSOSAlert: showSOSAlert,
    });
  };
};

export const setInAppNotification = showInAppNotification => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.CONFIG_SHOW_IN_APP_NOTIFICATION,
      showInAppNotification: showInAppNotification,
    });
  };
};

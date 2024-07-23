/*************************************************
 * SukraasLIS
 * ConfigReducer.js
 * Created by Sankar on 8/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  isLoginLoading: false,
  currency: '',
  firmName: '',
  firmNo: '',
  uploadSize: '',
  profileUploadSize: '',
  mobileNo: '',
  isShowConfigLoading: false,
  deviceInfoData: {},
  paymentUrl: '',
  distance: 0,
  branchLatitude: 0,
  branchLongitude: 0,
  patientLimit: 0,
  showManageAddress: true,
  menuList: [],
  showSOSAlert: true,
  showInAppNotification: true,
};

export const configState = (state = initialState, action) => {
  const {
    currency,
    firmName,
    firmNo,
    uploadSize,
    mobileNo,
    profileUploadSize,
    deviceInfoData,
    paymentUrl,
    distance,
    latitude,
    longitude,
    patientLimit,
    showManageAddress,
    menuList,
    showSOSAlert,
    showInAppNotification,
  } = action;
  switch (action.type) {
    case ACTIONS.CONFIG_SET_CURRENCY:
      return {...state, currency: currency};
    case ACTIONS.CONFIG_SET_FIRM_NAME:
      return {...state, firmName: firmName};
    case ACTIONS.CONFIG_SET_FIRM_NO:
      return {...state, firmNo: firmNo};
    case ACTIONS.CONFIG_SET_UPLOAD_SIZE:
      return {...state, uploadSize: uploadSize};
    case ACTIONS.CONFIG_SET_PROFILE_UPLOAD_SIZE:
      return {...state, profileUploadSize: profileUploadSize};
    case ACTIONS.CONFIG_SET_MOBILE_NO:
      return {...state, mobileNo: mobileNo};
    case ACTIONS.CONFIG_SHOW_LOADING:
      return {...state, isShowConfigLoading: true};
    case ACTIONS.CONFIG_HIDE_LOADING:
      return {...state, isShowConfigLoading: false};
    case ACTIONS.CONFIG_SET_DEVICE_INFO_DATA:
      return {...state, deviceInfoData: deviceInfoData};
    case ACTIONS.CONFIG_SET_ONLINE_PAYMENT_URL:
      return {...state, paymentUrl: paymentUrl};
    case ACTIONS.CONFIG_SET_DELIVERY_DISTANCE:
      return {...state, distance: distance};
    case ACTIONS.CONFIG_SET_BRANCH_LATITUDE:
      return {...state, branchLatitude: latitude};
    case ACTIONS.CONFIG_SET_BRANCH_LONGITUDE:
      return {...state, branchLongitude: longitude};
    case ACTIONS.CONFIG_SET_PATIENT_LIMIT:
      return {...state, patientLimit: patientLimit};
    case ACTIONS.CONFIG_SHOW_MANAGE_ADDRESS:
      return {...state, showManageAddress: showManageAddress};
    case ACTIONS.CONFIG_SET_MENU_LIST:
      return {...state, menuList: menuList};
    case ACTIONS.CONFIG_SHOW_SOS_ALERT:
      return {...state, showSOSAlert: showSOSAlert};
    case ACTIONS.CONFIG_SHOW_IN_APP_NOTIFICATION:
      return {...state, showInAppNotification: showInAppNotification};
    default:
      return state;
  }
};

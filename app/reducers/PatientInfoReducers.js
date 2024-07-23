/*************************************************
 * SukraasLIS
 * DashboardReducer.js
 * Created by Shiva Sankar on 23/06/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  isPatientInfoLoading: false,
  isUserAddressLoading: false,
  arrPatientInfo: [],
  arrUserAddress: [],
  selectedAddress: [],
  selectedPatient: [],
  selectedLoginMobileNo: '',
  selectedLoginFirmNo: '',
};

export const patientInfoState = (state = initialState, action) => {
  const {
    arrPatientInfo,
    arrUserAddress,
    selectedAddress,
    selectedPatient,
    selectedLoginMobileNo,
    selectedLoginFirmNo,
  } = action;
  switch (action.type) {
    case ACTIONS.SHOW_PATIENT_INFO_LOADING:
      return {...state, isPatientInfoLoading: true};
    case ACTIONS.UPDATE_PATIENT_INFO_LIST:
      return {...state, arrPatientInfo: arrPatientInfo};
    case ACTIONS.HIDE_PATIENT_INFO_LOADING:
      return {...state, isPatientInfoLoading: false};
    case ACTIONS.SHOW_USER_ADDRESS_LOADING:
      return {...state, isUserAddressLoading: true};
    case ACTIONS.UPDATE_USER_ADDRESS_LIST:
      return {...state, arrUserAddress: arrUserAddress};
    case ACTIONS.SELECTED_ADDRESS:
      return {...state, selectedAddress: selectedAddress};
    case ACTIONS.SELECTED_PATIENT:
      return {...state, selectedPatient: selectedPatient};
    case ACTIONS.HIDE_USER_ADDRESS_LOADING:
      return {...state, isUserAddressLoading: false};
    case ACTIONS.LOGGINED_USER_MOBILE_NO:
      return {...state, selectedLoginMobileNo};
    case ACTIONS.LOGGINED_USER_FIRM_NO:
      return {...state, selectedLoginFirmNo};
    default:
      return state;
  }
};

/*************************************************
 * SukraasLIS
 * @exports
 * @class LabTestSearchAction.js
 * @extends Component
 * Created by Shiva Sankar on 09/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import _ from 'lodash';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
import { handleError } from './NetworkAction';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';


/**
 * Invoke Gender webservice to Add User information
 */
export const invokeAddPatient = (
  phoneNumber,
  name,
  dob,
  gender,
  userPhoneNumber,
  relationship_code,
  titleCode,
  linkPtCode,
) => {
  return async dispatch => {
    dispatch(showPatientLoading());
    await HttpBaseClient.post(
      AsyncStorage.configUri.ad_pa,
      {
        UserName: phoneNumber,
        Pt_Name: name,
        Dob: dob,
        Gender: gender,
        Mobile_No: userPhoneNumber,
        Relationship_Code: relationship_code,
        Title_Code: titleCode,
        Link_Pt_Code: linkPtCode,
      },
      0,
    )
      .then(response => {
        if (response.Code === 200) {
          dispatch(hidePatientLoading());
          if (response.Message[0].Description != null) {
            Utility.showAlertWithPopAction(
              Constants.ALERT.TITLE.SUCCESS,
              response.Message[0].Description,
            );
          } else {
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              Constants.VALIDATION_MSG.NO_DATA_FOUND,
            );
          }
        } else {
          dispatch(hidePatientLoading());
          if (response.Message[0].Message != null) {
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              response.Message[0].Message,
            );
          } else {
            dispatch(hidePatientLoading());
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              Constants.VALIDATION_MSG.NO_DATA_FOUND,
            );
          }
        }
      })
      .catch(error => {
        dispatch(hidePatientLoading());
        dispatch(handleError(error));
        // Utility.showAlert(
        //   Constants.ALERT.TITLE.ERROR,
        //   Constants.VALIDATION_MSG.ERROR_CATCH,
        // );
      });
  };
};

/**
 * Invoke Gender webservice to Update User information
 */
export const invokeUpdatePatient = (
  Pt_Code,
  phoneNumber,
  name,
  dob,
  gender,
  userPhoneNumber,
  relationship_code,
  titleCode,
) => {
  return async dispatch => {
    dispatch(showPatientLoading());
    await HttpBaseClient.post(
      AsyncStorage.configUri.ed_pt,
      {
        Pt_Code: Pt_Code,
        UserName: phoneNumber,
        Pt_Name: name,
        Dob: dob,
        Gender: gender,
        Mobile_No: userPhoneNumber,
        Relationship_Code: relationship_code,
        Title_Code: titleCode,
      },
      0,
    )
      .then(response => {
        dispatch(hidePatientLoading());
        if (response.Code === 200) {
          Utility.showAlertWithPopAction(
            Constants.ALERT.TITLE.SUCCESS,
            Constants.ALERT.TITLE.UPDATE_SUCCESS,
          );
        } else {
          dispatch(hidePatientLoading());
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
        dispatch(handleError(error));
        dispatch(hidePatientLoading());

        // Utility.showAlert(
        //   Constants.ALERT.TITLE.ERROR,
        //   Constants.VALIDATION_MSG.ERROR_CATCH,
        // );
      });
  };
};

/**
 * Invoke Gender webservice to get Gender information
 */
export const invokeGetGender = () => {
  return async dispatch => {
    await HttpBaseClient.post(AsyncStorage.configUri.ge_ge, {}, 0)
      .then(response => {
        if (_.has(response, 'Code') && _.has(response, 'SuccessFlag')) {
          if (
            response.Code === 200 ||
            response.SuccessFlag.toLowerCase() === 'true'
          ) {
            if (_.has(response, 'Message') && response.Message.length > 0) {
              dispatch({
                type: Constants.ACTIONS.UPDATE_GENDER_LIST,
                genderList: response.Message,
              });
            }
          }
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
        dispatch(handleError(error));
      });
  };
};

/**
 * Invoke Gender webservice to get Gender information
 */
export const invokeGetTitle = () => {
  return async dispatch => {
    await HttpBaseClient.post(AsyncStorage.configUri.ge_ti, {}, 0)
      .then(response => {
        console.log('************** UPDATE_TITLE_LIST ********************:', response);
        if (_.has(response, 'Code') && _.has(response, 'SuccessFlag')) {
          if (
            response.Code === 200 ||
            response.SuccessFlag.toLowerCase() === 'true'
          ) {
            console.log('************** response.Message ********************:', response.Message);

            if (_.has(response, 'Message') && response.Message.length > 0) {

              dispatch({
                type: Constants.ACTIONS.UPDATE_TITLE_LIST,
                titleList: response.Message,
              });
            }
          }
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
        dispatch(handleError(error));
      });
  };
};

/**
 * Invoke Relation webservice to get Relation information
 */
export const invokeGetRelationShip = () => {
  return async dispatch => {
    await HttpBaseClient.post(AsyncStorage.configUri.ge_re, {}, 0)
      .then(response => {
        if (_.has(response, 'Code') && _.has(response, 'SuccessFlag')) {
          if (
            response.Code === 200 ||
            response.SuccessFlag.toLowerCase() === 'true'
          ) {
            if (_.has(response, 'Message') && response.Message.length > 0) {
              dispatch({
                type: Constants.ACTIONS.UPDATE_RELATION_LIST,
                relationList: response.Message,
              });
            }
          }
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
        dispatch(handleError(error));
      });
  };
};

export const invokeGetPatientList = (userName, mobileNumber, callback) => {
  return async dispatch => {
    dispatch(showPatientLoading());
    await HttpBaseClient.post(
      AsyncStorage.configUri.se_pa_li,
      { UserName: userName, Mobile_No: mobileNumber },
      0,
    )
      .then(response => {
        dispatch(hidePatientLoading());
        if (_.has(response, 'Code') && _.has(response, 'SuccessFlag')) {
          if (
            response.Code === 200 ||
            response.SuccessFlag.toLowerCase() === 'true'
          ) {
            if (_.has(response, 'Message') && response.Message.length > 0) {
              console.log('Patient Link ', response.Message[0].Patient_Detail);
              dispatch({
                type: Constants.ACTIONS.GET_LINKED_PATIENT_LIST,
                linkedPatientList: response.Message[0].Patient_Detail,
              });
              callback(true);
            }
          } else {
            dispatch({
              type: Constants.ACTIONS.GET_LINKED_PATIENT_LIST,
              linkedPatientList: [],
            });
            callback(false);
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              Constants.VALIDATION_MSG.NO_PATIENT_LINK,
            );
          }
        } else {
          callback(false);
          dispatch(hidePatientLoading());
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
        dispatch(hidePatientLoading());
        dispatch(handleError(error));
      });
  };
};

export const invokeGetPatientNonLinked = (userName, ptCode, callback) => {
  return async dispatch => {
    dispatch(showPatientLoading());
    await HttpBaseClient.post(
      AsyncStorage.configUri.ge_pa_no,
      { UserName: userName, Pt_Code: ptCode },
      0,
    )
      .then(response => {
        dispatch(hidePatientLoading());
        if (_.has(response, 'Code') && _.has(response, 'SuccessFlag')) {
          if (
            response.Code === 200 ||
            response.SuccessFlag.toLowerCase() === 'true'
          ) {
            if (_.has(response, 'Message') && response.Message.length > 0) {
              callback(true, response.Message[0]);
            }
          } else {
            callback(false);
          }
        } else {
          dispatch(hidePatientLoading());
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
        dispatch(hidePatientLoading());
        dispatch(handleError(error));
      });
  };
};
export const invokeSendOtpPatientLink = (
  Username,
  PtCode,
  MobileNo,
  callback,
) => {
  return async dispatch => {
    dispatch(showPatientLoading());

    await HttpBaseClient.post(
      AsyncStorage.configUri.ot_se_pa,
      {
        UserName: Username,
        PtCode: PtCode,
        MobileNo: MobileNo,
      },
      0,
    )
      .then(response => {
        dispatch(hidePatientLoading());
        if (
          response.Code === 200 ||
          response.SuccessFlag.toLowerCase() === 'true'
        ) {
          if (_.has(response, 'Message') && response.Message.length > 0) {
            callback(true);
            Utility.showAlert(
              Constants.ALERT.TITLE.SUCCESS,
              response.Message[0].OtpMessage,
            );
          }
        } else {
          dispatch(hidePatientLoading());
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
        dispatch(hidePatientLoading());
        dispatch(handleError(error));
      });
  };
};
export const invokeVerifyOtpPatientLink = (
  Username,
  PtCode,
  OtpCode,
  callback,
) => {
  return async dispatch => {
    dispatch(showPatientLoading());

    await HttpBaseClient.post(
      AsyncStorage.configUri.ot_ve_pa,
      {
        UserName: Username,
        PtCode: PtCode,
        OtpCode: OtpCode,
      },
      0,
    )
      .then(response => {
        dispatch(hidePatientLoading());
        if (
          response.Code === 200 ||
          response.SuccessFlag.toLowerCase() === 'true'
        ) {
          if (_.has(response, 'Message') && response.Message.length > 0) {
            callback(true);
            Utility.showAlert(
              Constants.ALERT.TITLE.SUCCESS,
              response.Message[0].OtpMessage,
            );
          }
        } else {
          dispatch(hidePatientLoading());
          if (response.Message[0].OtpMessage != null) {
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              response.Message[0].OtpMessage,
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
        dispatch(hidePatientLoading());
        dispatch(handleError(error));
      });
  };
};

export const showPatientLoading = () => {
  return async dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_SUBMIT_PATIENT_LOADING,
    });
  };
};

export const hidePatientLoading = () => {
  return async dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_SUBMIT_PATIENT_LOADING,
    });
  };
};
export const showPatientListLoading = () => {
  return async dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_SUBMIT_PATIENT_LIST_LOADING,
    });
  };
};

export const hidePatientListLoading = () => {
  return async dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_SUBMIT_PATIENT_LIST_LOADING,
    });
  };
};

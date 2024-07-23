'use strict';
import _ from 'lodash';
import {Actions} from 'react-native-router-flux';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
import {handleError} from './NetworkAction';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const UploadPrescriptionAction = (imageUrl, type, callback) => {
  return async dispatch => {
    dispatch(showUploadPrescriptionLoading());
    setTimeout(function() {
     HttpBaseClient.post(
        AsyncStorage.configUri.us_up_pr,
        {
          Prescription_File: imageUrl,
          Firm_No: '01',
          HV_No: '001010',
          HV_Date: '2020/05/25',
          File_Extension: 'jpeg',
        },
        0,
      )
        .then(response => {
          if (response.Code === 200) {
            dispatch(hideUploadPrescription());

            if (response.SuccessFlag.toLowerCase() === 'true') {
              dispatch({
                type: Constants.ACTIONS.UPLOADPRESCRIPTION_SUCCESS,
              });
              callback(true);
            } else {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                Constants.VALIDATION_MSG.NO_DATA_FOUND,
              );
            }
          } else {
            dispatch(hideUploadPrescription());

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
          dispatch(hideUploadPrescription());
          dispatch(handleError(error));
        });
    }, 1000);
  };
};

export const DeletePrescriptionAction = imageUrl => {
  return dispatch => {
    dispatch(showUploadPrescriptionLoading());

    setTimeout(function() {
      HttpBaseClient.post(
        AsyncStorage.configUri.us_de_pr,
        {
          imageUrl: imageUrl,
          Firm_No: '01',
          HV_No: '001010',
          HV_Date: '2020/05/25',
          SID_No: '',
          SID_Date: '',
        },
        2,
      )
        .then(response => {
          dispatch(hideUploadPrescription());
          if (response.response_code === 0) {
          } else {
          }
        })
        .catch(error => {
          dispatch(hideUploadPrescription());
          dispatch(handleError(error));
        });
    }, 1000);
  };
};

export const saveBase64Format = base64Format => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SAVE_BASE64_FORMAT,
      payload: base64Format,
    });
  };
};

export const deleteUploadImage = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.DELETE_UPLOAD_IMAGE,
    });
  };
};
export const saveUriFormat = uriFormat => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SAVE_URI_FORMAT,
      payload: uriFormat,
    });
  };
};

export const showUploadPrescriptionLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_UPLOADPRESCRIPTION_LOADING,
    });
  };
};

export const hideUploadPrescription = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_UPLOADPRESCRIPTION_LOADING,
    });
  };
};

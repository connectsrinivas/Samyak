'use strict';
import _ from 'lodash';
import {Actions} from 'react-native-router-flux';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import HttpBaseClient from '../util/HttpBaseClient';
import {handleError} from './NetworkAction';
import {call} from 'react-native-reanimated';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const TestTrendsResultAction = dictInfo => {
  return dispatch => {
    dispatch(showTestTrendsLoading());
    setTimeout(function() {
      HttpBaseClient.post(AsyncStorage.configUri.ge_pa_tr, dictInfo, 2)
        .then(response => {
          dispatch(HideTestTrendsLoading());
          if (response.Code === 200) {
            let arrResult = [];
            const arrDateResults = response.Message[0].Result_Detail;
            let arrayValues = {
              ServiceName: response.Message[0].Service_Name,
              From_Value: response.Message[0].From_Value,
              To_Value: response.Message[0].To_Value,
              Unit_Desc: response.Message[0].Unit_Desc,
              Ref_Value: response.Message[0].Ref_value,
              No_Of_Decimal: response.Message[0].No_Of_Decimal,
            };

            for (let index = 0; index < arrDateResults.length; index++) {
              const dicData = arrDateResults[index];
              let dictResult = {
                Date: dicData.Sid_Date,
                No: dicData.Sid_Date,
                Result: parseFloat(dicData.Result),
              };
              arrResult.push(dictResult);
            }
            if (response.Message[0].Result_Detail != null) {
              dispatch({
                type: Constants.ACTIONS.GET_RESULT_DETAILS,
                payload: arrResult,
                serviceValue: arrayValues,
              });
            } else {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                Constants.VALIDATION_MSG.NO_DATA_FOUND,
              );
            }
          } else {
            if (response.Message[0].Message != null) {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                response.Message[0].Message,
              );
              let arrResult = [];
              let arrayValues = {};
              dispatch({
                type: Constants.ACTIONS.GET_RESULT_DETAILS,
                payload: arrResult,
                serviceValue: arrayValues,
              });
            } else {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                Constants.VALIDATION_MSG.NO_DATA_FOUND,
              );
            }
          }
        })
        .catch(error => {
          dispatch(HideTestTrendsLoading());
          dispatch(handleError(error));
        });
    }, 1000);
  };
};

export const selectPatientList = (username, callback) => {
  return dispatch => {
    dispatch(showTestTrendsLoading());
    setTimeout(function() {
      HttpBaseClient.post(
        AsyncStorage.configUri.ge_pa_li,
        {Username: username},
        0,
      )
        .then(response => {
          dispatch(HideTestTrendsLoading());
          if (response.Code === 200) {
            console.log('response', response);
            let arrPatientDetails = response.Message[0].Patient_Detail;
            let arrPatientInfo = [];
            if (response.Message[0].Patient_Detail != null) {
              for (let index = 0; index < arrPatientDetails.length; index++) {
                const dicData = arrPatientDetails[index];
                let dictPatientInfo = {
                  name: dicData.Pt_Name,
                  gender: dicData.Pt_Gender,
                  relation: dicData.RelationShip_Name,
                  patientTestCode: dicData.Pt_Code,
                  patientAge: dicData.Pt_First_Age,
                };
                arrPatientInfo.push(dictPatientInfo);
              }
              dispatch({
                type: Constants.ACTIONS.GET_PATIENTLIST_DETAILS,
                payload: arrPatientInfo,
              });
              callback(true);
            } else {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                Constants.VALIDATION_MSG.NO_DATA_FOUND,
              );
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
          dispatch(HideTestTrendsLoading());
          dispatch(handleError(error));
        });
    }, 1000);
  };
};

export const selectTestList = (dictInfo, callback) => {
  return dispatch => {
    dispatch(showTestTrendsLoading());
    setTimeout(function() {
      HttpBaseClient.post(AsyncStorage.configUri.ge_pa_te_li, dictInfo, 2)
        .then(response => {
          dispatch(HideTestTrendsLoading());
          if (response.Code === 200) {
            let testCode = response.Message[0].Test_Code;
            let testSubCode = response.Message[0].Test_Sub_Code;
            // DictInfo for calling Test Result Api
            dictInfo.Test_Code = testCode;
            dictInfo.Test_Sub_Code = testSubCode;
            let arrTestType = response.Message;
            let arrTestList = [];
            for (let index = 0; index < arrTestType.length; index++) {
              const dictData = arrTestType[index];
              let dictTestList = {
                testName: dictData.Test_Name,
                testCode: dictData.Test_Code,
                testSubCode: dictData.Test_Sub_Code,
              };
              arrTestList.push(dictTestList);
            }
            dispatch({
              type: Constants.ACTIONS.GET_TESTLIST_DETAILS,
              payload: arrTestList,
            });
            callback(true);
            dispatch(TestTrendsResultAction(dictInfo));
          } else {
            dispatch({
              type: Constants.ACTIONS.GET_TESTLIST_DETAILS,
              payload: [],
            });
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
          dispatch(HideTestTrendsLoading());
          dispatch(handleError(error));
        });
    }, 1000);
  };
};

export const showTestTrendsLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_TESTTRENDS_LOADING,
    });
  };
};

export const HideTestTrendsLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_TESTTRENDS_LOADING,
    });
  };
};

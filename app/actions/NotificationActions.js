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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {handleError} from './NetworkAction';

export const getNotificationCount = userName => {
  return (dispatch, getState) => {
    setTimeout(function() {
      HttpBaseClient.post(AsyncStorage.configUri.us_nc, {userName}, 0)
        .then(response => {
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            dispatch({
              type: Constants.ACTIONS.SET_NOTIFICATION_COUNT,
              count: response.Message[0].Notify_Count,
            });
          } else {
            dispatch({
              type: Constants.ACTIONS.SET_NOTIFICATION_COUNT,
              count: 0,
            });
          }
        })
        .catch(error => {
          dispatch({
            type: Constants.ACTIONS.SET_NOTIFICATION_COUNT,
            count: 0,
          });
        });
    }, 500);
  };
};
export const getNotificationList = (userName, isShowAlert) => {
  getNotificationCount(userName);
  return (dispatch, getState) => {
    dispatch(showNotificationLoading());
    setTimeout(function() {
      HttpBaseClient.post(AsyncStorage.configUri.us_nl, {UserName: userName}, 0)
        .then(response => {
          dispatch(hideNotificationLoading());
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            let arrNotificationResult = [];
            for (let index = 0; index < response.Message.length; index++) {
              const dictData = {
                title: response.Message[index].Notification_Date,
                data: response.Message[index].Notification_List,
              };
              arrNotificationResult.push(dictData);
            }
            dispatch({
              type: Constants.ACTIONS.NOTIFICATION_LIST_DATA,
              notificationListData: arrNotificationResult,
            });
            dispatch(getNotificationCount(userName));
          } else {
            dispatch(hideNotificationLoading());
            dispatch({
              type: Constants.ACTIONS.NOTIFICATION_LIST_DATA,
              notificationListData: [],
            });
          }
        })
        .catch(error => {
          dispatch(hideNotificationLoading());
          dispatch(handleError(error));
          dispatch({
            type: Constants.ACTIONS.NOTIFICATION_LIST_DATA,
            notificationListData: {},
          });
        });
    }, 500);
  };
};

export const getViewNotificationUpdate = (postData, callback) => {
  getNotificationCount(postData.UserName);
  return (dispatch, getState) => {
    dispatch(showNotificationUpdateLoading());
    setTimeout(function() {
      HttpBaseClient.post(AsyncStorage.configUri.us_nu, postData, 0)
        .then(response => {
          dispatch(hideNotificationUpdateLoading());
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            dispatch({
              type: Constants.ACTIONS.UPDATE_NOTIFICATIONS,
              notificationUpdateData: response.Message,
            });
            dispatch({
              type: Constants.ACTIONS.SET_NOTIFICATION_COUNT,
              count: response.Message[0].Notify_Count,
            });
            callback(true);
          } else {
            dispatch(hideNotificationUpdateLoading());
            dispatch({
              type: Constants.ACTIONS.UPDATE_NOTIFICATIONS,
              notificationUpdateData: [],
            });
          }
        })
        .catch(error => {
          dispatch(hideNotificationUpdateLoading());
          dispatch(handleError(error));
        });
    }, 500);
  };
};

export const clearAllNotification = postData => {
  return (dispatch, getState) => {
    dispatch(showNotificationLoading());
    setTimeout(function() {
      HttpBaseClient.post(AsyncStorage.configUri.us_nu, postData, 0)
        .then(response => {
          dispatch(hideNotificationLoading());
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            dispatch(getNotificationList(postData.UserName, false));
          } else {
            dispatch(hideNotificationLoading());
            if (response.Message[0].Message != null) {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                response.Message[0].Message,
              );
            } else {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                Constants.VALIDATION_MSG.REQ_FAILED,
              );
            }
          }
        })
        .catch(error => {
          dispatch(hideNotificationLoading());
          dispatch(handleError(error));
        });
    }, 500);
  };
};

export const changeMarkAllAsRead = postData => {
  return (dispatch, getState) => {
    dispatch(showNotificationLoading());
    setTimeout(function() {
      HttpBaseClient.post(AsyncStorage.configUri.us_nu, postData, 0)
        .then(response => {
          dispatch(hideNotificationLoading());
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            dispatch(getNotificationList(postData.UserName, false));
          } else {
            dispatch(hideNotificationLoading());
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
          dispatch(hideNotificationLoading());
          dispatch(handleError(error));
        });
    }, 500);
  };
};

export const showNotificationLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_NOTIFICATION_LOADING,
    });
  };
};

export const hideNotificationLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_NOTIFICATION_LOADING,
    });
  };
};

export const showNotificationUpdateLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_NOTIFICATION_LOADING,
    });
  };
};

export const hideNotificationUpdateLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_NOTIFICATION_LOADING,
    });
  };
};

export const showNotificationLoadingLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_NOTIFICATION_LOADING,
    });
  };
};

export const hideNotificationLoadingLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_NOTIFICATION_LOADING,
    });
  };
};

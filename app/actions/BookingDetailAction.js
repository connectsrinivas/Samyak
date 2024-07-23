/*************************************************
 * Sukraas
 * @exports
 * @class BookingAction.js
 * Created by Sankar on 16/06/2020
 * Copyright © 2020 Sukraas. All rights reserved.
 *************************************************/

'use strict';
import _ from 'lodash';
import Constants from '../util/Constants';
import HttpBaseClient from '../util/HttpBaseClient';
import Utility from '../util/Utility';
import { handleError, handleErrorSplash } from './NetworkAction';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const invokeBookingList = (postData, callback) => {
  return dispatch => {
    dispatch(showBookingDetailLoading());

    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.or_bo_de, postData, 0)
        .then(response => {
          dispatch(hideBookingDetailLoading());
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            if (response.Message[0] != null) {
              callback(true);
              dispatch({
                type: Constants.ACTIONS.BOOKING_DETAIL_DATA,
                payload: response.Message[0],
              });
            } else {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                Constants.VALIDATION_MSG.NO_DATA_FOUND,
              );
            }
          } else {
            dispatch({
              type: Constants.ACTIONS.BOOKING_DETAIL_DATA,
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
          dispatch({
            type: Constants.ACTIONS.BOOKING_DETAIL_DATA,
            payload: [],
          });
          dispatch(hideBookingDetailLoading());
          dispatch(handleErrorSplash(error));
        });
    }, 1000);
  };
};

export const invokePostReviews = (postData, callback) => {
  return dispatch => {
    dispatch(showPostReviewLoading());
    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.po_re, postData, 0)
        .then(response => {
          dispatch(hidePostReviewLoading());
          if (_.has(response, 'Code') && _.has(response, 'SuccessFlag')) {
            if (response.Code === 200 || response.SuccessFlag.toLowerCase() === 'true') {
              if (_.has(response, 'Message') && response.Message.length > 0) {
                callback(true);
                Utility.showAlert(
                  Constants.ALERT.TITLE.SUCCESS,
                  response.Message[0].Message,
                );
              }
            }
          } else {
            dispatch(hidePostReviewLoading());
            if (response.Message[0].Message != null) {
              Utility.showAlert(
                Constants.ALERT.TITLE.SUCCE,
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
          dispatch(hidePostReviewLoading());
          dispatch(handleError(error));
        });
    }, 2000);
  };
};

export const invokeUpdateRatings = (postData, isFromService) => {
  return dispatch => {
    if (isFromService) {
      dispatch(showRatingServiceLoading());
    } else {
      dispatch(showRatingPhlebotomistLoading());
    }
    try {
      HttpBaseClient.post(AsyncStorage.configUri.up_ra, postData, 0)
        .then(response => {
          if (isFromService) {
            dispatch(hideRatingServiceLoading());
          } else {
            dispatch(hideRatingPhlebotomistLoading());
          }
          if (_.has(response, 'Code') && _.has(response, 'SuccessFlag')) {
            if (response.Code === 200 || response.SuccessFlag.toLowerCase() === 'true') {
              if (_.has(response, 'Message') && response.Message.length > 0) {
                // callback(true)
                // Utility.showAlert(
                //   Constants.ALERT.TITLE.SUCCESS,
                //   response.Message[0].Message,
                // );
              }
            }
          } else {
            if (isFromService) {
              dispatch(hideRatingServiceLoading());
            } else {
              dispatch(hideRatingPhlebotomistLoading());
            }
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
          if (isFromService) {
            dispatch(hideRatingServiceLoading());
          } else {
            dispatch(hideRatingPhlebotomistLoading());
          }
          Utility.showAlertWithPopAction(
            Constants.ALERT.TITLE.ERROR,
            Constants.VALIDATION_MSG.NO_INTERNET,
          );
        });
    } catch (error) {
      Utility.showAlertWithPopAction(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_INTERNET,
      );
      if (isFromService) {
        dispatch(hideRatingServiceLoading());
      } else {
        dispatch(hideRatingPhlebotomistLoading());
      }
    }
  };
};

export const invokePostRateCode = postData => {
  return dispatch => {
    dispatch(showRatingServiceLoading());
    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.po_ra, postData, 0)
        .then(response => {
          dispatch(hideRatingServiceLoading());
          if (_.has(response, 'Code') && _.has(response, 'SuccessFlag')) {
            if (response.Code === 200 || response.SuccessFlag.toLowerCase() === 'true') {
              if (_.has(response, 'Message') && response.Message.length > 0) {
                // callback(true)
              }
            }
          } else {
            dispatch(hideRatingServiceLoading());
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
          dispatch(hideRatingServiceLoading());
          dispatch(handleError(error));
        });
    }, 2000);
  };
};

export const downloadReport = (postData, callback) => {
  return dispatch => {
    dispatch(showBookingDetailPDFLoading());

    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.do_re, postData, 0)
        .then(response => {
          dispatch(hideBookingDetailPDFLoading());

          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            if (response.Message[0] != null) {
              callback(true, response.Message[0].Lab_Report_Url);
              dispatch({
                type: Constants.ACTIONS.BOOKING_DETAIL_DOWNLOAD_REPORT,
                payload: response.Message[0],
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
            } else {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                Constants.VALIDATION_MSG.NO_DATA_FOUND,
              );
            }
          }
        })
        .catch(error => {
          dispatch(hideBookingDetailPDFLoading());
          dispatch(handleError(error));
        });
    }, 1000);
  };
};
export const downloadInvoice = (postData, callback) => {
  return dispatch => {
    dispatch(showBookingDetailPDFInvoiceLoading());

    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.in_do, postData, 0)
        .then(response => {
          dispatch(hideBookingDetailPDFInvoiceLoading());
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            if (response.Message[0] != null) {
              callback(true, response.Message[0].InvoiceReport_Url);
              dispatch({
                type: Constants.ACTIONS.BOOKING_DETAIL_DOWNLOAD_REPORT,
                payload: response.Message[0],
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
            } else {
              Utility.showAlert(
                Constants.ALERT.TITLE.ERROR,
                Constants.VALIDATION_MSG.NO_DATA_FOUND,
              );
            }
          }
        })
        .catch(error => {
          dispatch(hideBookingDetailPDFInvoiceLoading());
          dispatch(handleError(error));
        });
    }, 1000);
  };
};
export const showBookingDetailLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.BOOKING_DETAIL_SHOW_LOADING,
    });
  };
};

export const hideBookingDetailLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.BOOKING_DETAIL_HIDE_LOADING,
    });
  };
};

export const showBookingDetailPDFLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_LOADING_DOWNLOAD_REPORT,
    });
  };
};

export const hideBookingDetailPDFLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_LOADING_DOWNLOAD_REPORT,
    });
  };
};
export const showBookingDetailPDFInvoiceLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_LOADING_DOWNLOAD_INVOICE,
    });
  };
};

export const hideBookingDetailPDFInvoiceLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_LOADING_DOWNLOAD_INVOICE,
    });
  };
};
export const showRatingServiceLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_BOOKING_SERVICE_RATINGS_LOADING,
    });
  };
};

export const hideRatingServiceLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_BOOKING_SERVICE_RATINGS_LOADING,
    });
  };
};

export const showRatingPhlebotomistLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_BOOKING_RATINGS_LOADING,
    });
  };
};

export const hideRatingPhlebotomistLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_BOOKING_RATINGS_LOADING,
    });
  };
};

export const showPostReviewLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_BOOKING_POST_REVIEW_LOADING,
    });
  };
};

export const hidePostReviewLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_BOOKING_POST_REVIEW_LOADING,
    });
  };
};

export const setClearLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_BOOKING_POST_REVIEW_LOADING,
    });
    dispatch({
      type: Constants.ACTIONS.HIDE_BOOKING_RATINGS_LOADING,
    });
    dispatch({
      type: Constants.ACTIONS.HIDE_BOOKING_SERVICE_RATINGS_LOADING,
    });
  };
};

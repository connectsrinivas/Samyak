/*************************************************
 * SukraasLIS
 * @exports
 * @class DashboardAction.js
 * Created by Abdul on 22/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import _ from 'lodash';
import Constants from '../util/Constants';
import HttpBaseClient from '../util/HttpBaseClient';
import Utility from '../util/Utility';
import { handleError } from './NetworkAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const getOfferDetails = (dicOfferDetails, callback) => {
  console.log(dicOfferDetails, "offer detail");
  return (dispatch, getState) => {
    dispatch(showOfferPageLoading());
    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.sp_pa, { Firm_No: "", UserName: '9849390103' }, 0)
        .then(response => {
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            let arrOfferContent = [];
            let arrContent = [];
            let dictOfferDetails = {};
            if (response.Message.length === 0) {
              dispatch({
                type: Constants.ACTIONS.HIDE_OFFER_SCREEN_LOADING,
                payload: 'No Data Found',
              });
            } else {
              var jsonArray = response.Message;

              for (let index in jsonArray) {
                const dicOfferList = jsonArray[index];
                if (!jsonArray.hasOwnProperty('isInCart')) {
                  jsonArray[index].isInCart = false;
                  jsonArray[index].isFromOffers = true;
                }
                dictOfferDetails = {
                  Service_Name: dicOfferList.Service_Name,
                  Amount: dicOfferList.Amount,
                  Service_Code: dicOfferList.Service_Code,
                  Service_Detail: [],
                  No_House_Visit: dicOfferList.No_House_Visit,
                  isInCart: dicOfferList.isInCart,
                  isFromOffers: dicOfferList.isFromOffers,
                  Suppress_Discount: dicOfferList.Suppress_Discount,
                };
                arrOfferContent.push(dictOfferDetails);
              }

              dispatch({
                type: Constants.ACTIONS.HIDE_OFFER_SCREEN_LOADING,
              });

              dispatch({
                type: Constants.ACTIONS.GET_OFFER_DETAILS_SUCCESS,
                offerDetailsArray: arrOfferContent,
              });

              callback(true);
            }
          } else {
            dispatch(hideOfferPageLoading());
          }
        })
        .catch(error => {
          dispatch(handleError(error));
        });
    }, 2000);
  };
};




export const getTestList = (serviceCode, sectionIndex, arrOfferDetails) => {
  return dispatch => {
    setTimeout(function () {
      dispatch({ type: Constants.ACTIONS.SHOW_OFFER_SCREEN_TEST_LOADING });

      HttpBaseClient.post(
        AsyncStorage.configUri.te_in_se,
        {
          Service_Code: serviceCode,
        },
        0,
      )
        .then(response => {
          if (_.has(response, 'Code') && _.has(response, 'SuccessFlag')) {
            if (
              response.Code === 200 ||
              response.SuccessFlag.toLowerCase() === 'true'
            ) {
              if (_.has(response, 'Message') && response.Message.length > 0) {
                let content = response.Message[0].Service_Detail;
                arrOfferDetails[sectionIndex].Service_Detail = content;
                dispatch({
                  type: Constants.ACTIONS.GET_OFFER_DETAILS_SUCCESS,
                  offerDetailsArray: arrOfferDetails,
                });
                setTimeout(function () {
                  dispatch({
                    type: Constants.ACTIONS.HIDE_OFFER_SCREEN_TEST_LOADING,
                  });
                }, 5000);
              }
            }
          } else {
            dispatch({ type: Constants.ACTIONS.HIDE_OFFER_SCREEN_TEST_LOADING });
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
            type: Constants.ACTIONS.HIDE_OFFER_SCREEN_TEST_LOADING,
          });
          if (Platform.OS === 'android') {
            dispatch(handleError(error));
          } else {
            dispatch(handleError(error));
          }
        });
    }, 2000);
  };
};

export const getPromotionDetails = () => {
  return dispatch => {
    dispatch(showPromotionPageLoading());
    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.ge_pr, {}, 0)
        .then(response => {
          dispatch(hidePromotionPageLoading());
          if (_.has(response, 'Code') && _.has(response, 'SuccessFlag')) {
            if (
              response.Code === 200 ||
              response.SuccessFlag.toLowerCase() === 'true'
            ) {
              if (_.has(response, 'Message') && response.Message.length > 0) {
                dispatch(hidePromotionPageLoading());
                dispatch({
                  type: Constants.ACTIONS.UPDATE_PROMOTION_DETAILS,
                  promotionList: response.Message,
                });
              }
            }
          } else {
            dispatch(hidePromotionPageLoading());
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
          dispatch(hidePromotionPageLoading());
          dispatch(handleError(error));
        });
    }, 2000);
  };
};




export const getTipsDetails = callback => {
  return dispatch => {
    dispatch(showTipsPageLoading());
    setTimeout(function () {
      callback(true);
    }, 2000);
  };
};

export const removePromoCode = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.REMOVE_PROMOCODE,
    });
  };
};

export const showRedeemNowOrCouponCode = isFromPayment => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_REDEEM_NOW_TEXT,
      payload: isFromPayment,
    });
  };
};

export const applyPromotionDetails = (details, subTotal, callback) => {
  return (dispatch, getState) => {
    dispatch(showPromotionPageLoading());
    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.ap_pr, details, 0)
        .then(response => {
          if (_.has(response, 'Code') && _.has(response, 'SuccessFlag')) {
            if (
              response.Code === 200 ||
              response.SuccessFlag.toLowerCase() === 'true'
            ) {
              let dicPromoDetails;
              let discountAmt = -1;
              let payableAmt = -1;
              let collectionCharge = 0;
              let sampleCollectionData = getState().labTestPaymentDetailsState
                .sampleCollectionData;
              if (_.has(sampleCollectionData, 'Collection_Charge')) {
                collectionCharge = parseFloat(
                  sampleCollectionData.Collection_Charge,
                );
              }
              if (_.has(response, 'Message') && response.Message.length > 0) {
                dispatch(hidePromotionPageLoading());
                // Discount Amount
                let cartArray = getState().labTestSummaryState.cartArray;
                console.log('Cart Arrayyyyyyyy ', cartArray);
                let totalAmount = 0.0;
                if (cartArray.length > 0) {
                  for (let i = 0; i < cartArray.length; i++) {
                    if (!cartArray[i].Suppress_Discount) {
                      totalAmount = totalAmount + cartArray[i].Amount;
                    }
                  }
                } else {
                  totalAmount = 0.0;
                }
                console.log('totalAmount After Discount  ', totalAmount);
                discountAmt =
                  parseFloat(
                    totalAmount * response.Message[0].Offer_Percentage,
                  ) / 100;
                discountAmt = discountAmt.toFixed(2);
                payableAmt =
                  parseFloat(subTotal) +
                  parseFloat(collectionCharge) -
                  discountAmt;
                payableAmt = payableAmt.toFixed(2);
                if (discountAmt !== -1 && payableAmt !== -1) {
                  dicPromoDetails = {
                    Offer_Percentage: response.Message[0].Offer_Percentage,
                    Coupon_Code: response.Message[0].Coupon_Code,
                    Discount_Amount: discountAmt,
                    Payable_Amount: payableAmt,
                  };

                  dispatch({
                    type: Constants.ACTIONS.APPLY_PROMOCODE_SUCCESS,
                    payload: dicPromoDetails,
                  });
                }

                Utility.showAlert(
                  Constants.ALERT.TITLE.SUCCESS,
                  'Promo Code applied successfully.',
                );
                callback(
                  true,
                  response.Message[0].Offer_Percentage,
                  response.Message[0].Coupon_Code,
                );
              }
            } else {
              dispatch(hidePromotionPageLoading());
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
          }
        })
        .catch(error => {
          dispatch(hidePromotionPageLoading());
          dispatch(handleError(error));
        });
    }, 2000);
  };
};

// booking
export const bookNowCart = (item, option) => {
  return (dispatch, getState) => {
    var array = [];
    array.push(item);

    dispatch({
      type: Constants.ACTIONS.BOOK_NOW_CART_COUNT,
      bookNowCartCount: 1,
    });
    dispatch({
      type: Constants.ACTIONS.BOOK_NOW_CART_AMOUNT,
      bookNowAmount: item.Amount.toFixed(2),
    });
    dispatch({
      type: Constants.ACTIONS.BOOK_NOW_OFFERS_CART,
      bookNowArray: array,
    });
  };
};

// booking
export const showOfferPageLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_OFFER_SCREEN_LOADING,
    });
  };
};

export const hideOfferPageLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_OFFER_SCREEN_LOADING,
    });
  };
};

export const showPromotionPageLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_PROMOTION_SCREEN_LOADING,
    });
  };
};

export const hidePromotionPageLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_PROMOTION_SCREEN_LOADING,
    });
  };
};

export const showTipsPageLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_TIPS_SCREEN_LOADING,
    });
  };
};

export const hideTipsPageLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_TIPS_SCREEN_LOADING,
    });
  };
};

export const showTestListLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_OFFER_SCREEN_TEST_LOADING,
    });
  };
};
export const hideTestListLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_OFFER_SCREEN_TEST_LOADING,
    });
  };
};

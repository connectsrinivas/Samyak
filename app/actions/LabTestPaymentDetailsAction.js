'use strict';
import _ from 'lodash';
import { Actions } from 'react-native-router-flux';
import Constants from '../util/Constants';
import HttpBaseClient from '../util/HttpBaseClient';
import Utility from '../util/Utility';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { handleError } from './NetworkAction';

export const orderBookingAPI = (orderBookingData, isPayNow, callback) => {
  return (dispatch, getState) => {
    dispatch(showPaymentDetailLoading());
    setTimeout(function () {
      let Url = '';
      if (isPayNow) {
        Url = AsyncStorage.configUri.pa_vs_bo;
      } else {
        Url = AsyncStorage.configUri.or_bo;
      }
      console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ URL ^^^^^^^^^^^^", Url, "$$$$$$$$$$$$$$ orderBookingData &&&&&&&&&&", orderBookingData);
      HttpBaseClient.post(Url, orderBookingData, 0)
        .then(response => {
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            dispatch(hidePaymentDetailLoading());
            dispatch({
              type: Constants.ACTIONS.PAYMENT_ORDER_BOOKING_SUCCESS_DATA,
              bookingSuccessData: response.Message[0],
            });
            Utility.showAlert(
              Constants.ALERT.TITLE.SUCCESS,
              response.Message[0].Description,
            );
            callback(true);
          } else {
            dispatch(hidePaymentDetailLoading());
            if (response.Message[0].Message != null) {
              Utility.showAlert(
                Constants.ALERT.TITLE.FAILED,
                response.Message[0].Message,
              );
            } else {
              // Utility.showAlert(
              //   Constants.ALERT.TITLE.ERROR,
              //   Constants.VALIDATION_MSG.REQ_FAILED,
              // );
            }
          }
        })
        .catch(error => {
          console.log('errorrr Order Booking  ', error);
          dispatch(hidePaymentDetailLoading());
          dispatch(handleError(error));
        });
    }, 500);
  };
};

export const invokeValidateBooking = (orderBookingData, callback) => {
  console.log("{{{{{{{{{{{{{{{{{ booking }}}}}}}}}}}}}}}", orderBookingData, "+++++++++++++ url+++++++++++++++++++", AsyncStorage.configUri.va_bo);
  let partsObject = orderBookingData._parts.reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
  console.log("partsObject", partsObject);
  return (dispatch, getState) => {
    dispatch(showPaymentDetailLoading());
    let data = new FormData()
    data.append('Pay_Ref_No', '');
    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.va_bo, partsObject, 0)
        .then(response => {
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            dispatch(hidePaymentDetailLoading());
            callback(true);
          } else {
            dispatch(hidePaymentDetailLoading());
            if (response.Message[0].Message != null) {
              Utility.showAlert(
                Constants.ALERT.TITLE.FAILED,
                response.Message[0].Message,
              );
            } else {
              // Utility.showAlert(
              //   Constants.ALERT.TITLE.ERROR,
              //   Constants.VALIDATION_MSG.REQ_FAILED,
              // );
            }
          }
        })
        .catch(error => {
          console.log('errorrr Order Booking  ', error);
          dispatch(hidePaymentDetailLoading());
          dispatch(handleError(error));
        });
    }, 500);
  };
};

export const setPaymentCartArray = cartArray => {
  var Service_Reg_Data = [];
  for (let i = 0; i < cartArray.length; i++) {
    var myObject = {};

    if (cartArray[i].hasOwnProperty('Service_Code')) {
      myObject['Service_Code'] = cartArray[i].Service_Code;
    } else {
      myObject['Service_Code'] = '';
    }
    if (cartArray[i].hasOwnProperty('Amount')) {
      myObject['Service_Amount'] = cartArray[i].Amount;
    } else {
      myObject['Service_Amount'] = '';
    }
    if (cartArray[i].hasOwnProperty('Service_Discount')) {
      myObject['Service_Discount'] = cartArray[i].Service_Discount;
    } else {
      myObject['Service_Discount'] = 0;
    }
    Service_Reg_Data.push(myObject);
  }
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.PAYMENT_SET_CART_ARRAY,
      Service_Reg_Data,
    });
  };
};

export const setPaymentCartArrayWithPromo = (cartArray, promo, callback) => {
  return dispatch => {
    var Service_Reg_Data = [];
    for (let i = 0; i < cartArray.length; i++) {
      var myObject = {};

      if (cartArray[i].hasOwnProperty('Service_Code')) {
        myObject['Service_Code'] = cartArray[i].Service_Code;
      } else {
        myObject['Service_Code'] = '';
      }
      if (cartArray[i].hasOwnProperty('Amount')) {
        myObject['Service_Amount'] = cartArray[i].Amount;
      } else {
        myObject['Service_Amount'] = '';
      }
      if (cartArray[i].hasOwnProperty('Amount')) {
        if (
          cartArray[i].hasOwnProperty('Suppress_Discount') &&
          !cartArray[i].Suppress_Discount
        ) {
          if (promo > 0) {
            myObject['Service_Discount'] = (cartArray[i].Amount * promo) / 100;
          } else {
            myObject['Service_Discount'] = 0;
          }
        } else {
          myObject['Service_Discount'] = 0;
        }
      } else {
        myObject['Service_Discount'] = 0;
      }
      // if (promo > 0) {
      //   myObject['Service_Discount'] = promo;
      // } else {
      //   myObject['Service_Discount'] = 0;
      // }
      Service_Reg_Data.push(myObject);
    }
    dispatch(savePaymentCartData(Service_Reg_Data));
    setTimeout(function () {
      callback(true);
    }, 500);
  };
};

export const invokeSampleCollectionCharge = (postData, subTotal, callback) => {
  return (dispatch, getState) => {
    dispatch(showPaymentDetailLoading());
    setTimeout(function () {
      HttpBaseClient.post(AsyncStorage.configUri.ge_sa_cc, postData, 0)
        .then(response => {
          if (response.Code === Constants.HTTP_CODE.SUCCESS) {
            dispatch(hidePaymentDetailLoading());
            dispatch({
              type: Constants.ACTIONS.GET_SAMPLE_AND_DISCOUNT_CHARGE,
              sampleCollectionData: response.Message[0],
            });
            if (_.has(response, 'Message') && response.Message.length > 0) {
              if (response.Message[0].Collection_Charge !== undefined) {
                let collectCartAmount =
                  parseFloat(subTotal) +
                  parseFloat(response.Message[0].Collection_Charge);
                collectCartAmount = collectCartAmount.toFixed(2);
                let collectionCharge = [
                  {
                    Service_Name: 'Sample Collection Charges',
                    Amount: response.Message[0].Collection_Charge,
                    Suppress_Discount: false,
                  },
                ];

                let sampleCollectionArray = getState().labTestSummaryState
                  .cartArray;
                if (parseInt(response.Message[0].Collection_Charge) !== 0) {
                  sampleCollectionArray = [
                    ...sampleCollectionArray,
                    ...collectionCharge,
                  ];
                }
                dispatch({
                  type:
                    Constants.ACTIONS.SAMPLE_COLLECTED_AMOUNT_ADDED_IN_ARRAY,
                  sampleCollectionArr: sampleCollectionArray,
                });
                dispatch({
                  type:
                    Constants.ACTIONS
                      .SAMPLE_COLLECTED_AMOUNT_ADDED_IN_TOTAL_AMOUNT,
                  sampleCollectionCartAmount: collectCartAmount,
                });
              }
              if (response.Message[0].Promo_Code !== '') {
                //  PromoCode Functionalities
                let dicPromoDetails;
                let discountAmt = -1;
                let payableAmt = -1;
                let sampleCollectionAmount = parseFloat(
                  response.Message[0].Collection_Charge,
                );
                let totalAmount = 0.0;
                let cartArray = getState().labTestSummaryState.cartArray;
                if (cartArray.length > 0) {
                  for (let i = 0; i < cartArray.length; i++) {
                    if (!cartArray[i].Suppress_Discount) {
                      totalAmount = totalAmount + cartArray[i].Amount;
                    }
                  }
                } else {
                  totalAmount = 0.0;
                }
                discountAmt =
                  parseFloat(
                    totalAmount * response.Message[0].Discount_In_Percent,
                  ) / 100;
                discountAmt = discountAmt.toFixed(2);
                payableAmt =
                  parseFloat(subTotal) +
                  parseFloat(sampleCollectionAmount) -
                  discountAmt;
                payableAmt = payableAmt.toFixed(2);
                if (discountAmt !== -1 && payableAmt !== -1) {
                  dicPromoDetails = {
                    Offer_Percentage: response.Message[0].Discount_In_Percent,
                    Coupon_Code: response.Message[0].Promo_Code,
                    Discount_Amount: discountAmt,
                    Payable_Amount: payableAmt,
                  };
                  dispatch({
                    type: Constants.ACTIONS.APPLY_PROMOCODE_SUCCESS,
                    payload: dicPromoDetails,
                  });
                  callback(
                    true,
                    response.Message[0].Discount_In_Percent,
                    response.Message[0].Promo_Code,
                  );
                  //  PromoCode Functionalities
                }
              }
            }
          } else {
            dispatch(hidePaymentDetailLoading());
            if (postData.Bill_Amount !== 0) {
              if (response.Message[0].Message != null) {
                Utility.showAlert(
                  Constants.ALERT.TITLE.FAILED,
                  response.Message[0].Message,
                );
              } else {
                // Utility.showAlert(
                //   Constants.ALERT.TITLE.ERROR,
                //   Constants.VALIDATION_MSG.REQ_FAILED,
                // );
              }
            }
          }
        })
        .catch(error => {
          console.log('errorrr Order Booking  ', error);
          dispatch(hidePaymentDetailLoading());
          dispatch(handleError(error));
        });
    }, 500);
  };
};

export const savePaymentCartData = Service_Reg_Data => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.PAYMENT_SET_CART_ARRAY,
      Service_Reg_Data,
    });
  };
};

export const showPaymentDetailLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.PAYMENT_DETAIL_SHOW_LOADING,
    });
  };
};

export const hidePaymentDetailLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.PAYMENT_DETAIL_HIDE_LOADING,
    });
  };
};

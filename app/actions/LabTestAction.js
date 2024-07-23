/*************************************************
 * Sukraas
 * @exports
 * @class LabTestAction.js
 * Created by Abdul Rahman on 09/06/2020
 * Copyright © 2020 Sukraas. All rights reserved.
 *************************************************/

'use strict';
import _ from 'lodash';
import Constants from '../util/Constants';
import HttpBaseClient from '../util/HttpBaseClient';
import {useCallback} from 'react';
import {handleError} from './NetworkAction';
import Utility from '../util/Utility';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const searchLabTest = (
  Firm_No,
  Service_Type,
  Search_Text,
  Start_Index,
  Page_Count,
  Organ_Code,
  Dept_Code,
) => {
  return (dispatch, getState) => {
    dispatch(showLabTestSearchLoading());

    HttpBaseClient.post(
      AsyncStorage.configUri.te_pa,
      {
        Firm_No,
        Service_Type,
        Search_Text,
        Start_Index,
        Page_Count,
        Organ_Code,
        Dept_Code,
      },
      0,
    )
      .then(response => {
        dispatch(hideLabTestSearchLoading());

        if (response.Code === 200) {
          var jsonArray = response.Message;
          let cartArray = [...getState().labTestState.cartArray];

          dispatch({
            type: Constants.ACTIONS.LAB_TEST_SEARCH_SUCCESS,
            searchResponseArray: response.Message,
          });
        }
      })
      .catch(error => {
        dispatch(hideLabTestSearchLoading());
        dispatch(handleError(error));
      });
  };
};

export const addItemToCart = (item, option) => {
  return (dispatch, getState) => {
    let totalAmount = 0;
    let insideCartArray = [...getState().labTestState.cartArray];

    if (insideCartArray.length > 0) {
      for (let i = 0; i < insideCartArray.length; i++) {
        totalAmount = totalAmount + insideCartArray[i].Amount;
      }
    } else {
      totalAmount = 0;
    }

    let cartIndex = insideCartArray.findIndex(
      obj => obj.Service_Code === item.Service_Code,
    );

    if (cartIndex === -1) {
      // if index = -1, item is not in cart and add item to cart

      if (item.isFromOffers === undefined || item.isFromOffers === false) {
        if (!item.hasOwnProperty('isInCart')) {
          item.isInCart = true;
        } else {
          if (item.isInCart === false) {
            item.isInCart = true;
          }
        }
      } else {
        if (item.isInCart === false) {
          item.isInCart = true;
        } else {
          item.isInCart = false;
        }
      }

      totalAmount = totalAmount + item.Amount;
      totalAmount = totalAmount.toFixed(2);
      dispatch({
        type: Constants.ACTIONS.SET_TOTAL_CART_AMOUNT,
        totalCartAmount: totalAmount,
      });
      dispatch({
        type: Constants.ACTIONS.ADD_ITEM_TO_CART,
        cartArray: [...getState().labTestState.cartArray, item],
      });
    } else {
      // else, item is already in cart so remove it from the cart

      if (item.isFromOffers === undefined || item.isFromOffers === false) {
        if (!item.hasOwnProperty('isInCart')) {
          item.isInCart = false;
        } else {
          if (item.isInCart === true) {
            item.isInCart = false;
          }
        }
      } else {
        if (item.isInCart === false) {
          item.isInCart = true;
        } else {
          item.isInCart = false;
        }
      }

      totalAmount = totalAmount - item.Amount;
      totalAmount = totalAmount.toFixed(2);
      dispatch({
        type: Constants.ACTIONS.SET_TOTAL_CART_AMOUNT,
        totalCartAmount: totalAmount,
      });

      insideCartArray.splice(cartIndex, 1);
      dispatch({
        type: Constants.ACTIONS.ADD_ITEM_TO_CART,
        cartArray: insideCartArray,
      });

      /**
       * This below code is for refresh in choose package list when removing item from cart
       * But its now not needed but not remove it
       */
      // let offerDetArray = getState().dashboardState.offerDetailsArray;
      // console.log('LABTESTACTION---->', offerDetArray);
      // let offerIndex = offerDetArray.findIndex(
      //   obj => obj.Service_Code === item.Service_Code,
      // );
      // console.log(
      //   'LABTESTACTION--isInCart-->',
      //   offerIndex,
      //   offerDetArray[offerIndex],
      // );
      // offerDetArray[offerIndex].isInCart = false;
      // dispatch({
      //   type: Constants.ACTIONS.GET_OFFER_DETAILS_SUCCESS,
      //   offerDetailsArray: offerDetArray,
      // });
    }
  };
};

export const checkDuplicateTest = (item, cartArray, callBack) => {
  return (dispatch, getState) => {
    // dispatch(showLabTestSearchLoading());

    let serviceRegData = [];
    if (cartArray.length > 0) {
      for (let i = 0; i < cartArray.length; i++) {
        serviceRegData.push({Service_Code: cartArray[i].Service_Code});
      }
    }
    HttpBaseClient.post(
      AsyncStorage.configUri.ch_se_du,
      {
        New_Service_Code: item.Service_Code,
        Service_Reg_Data: serviceRegData,
      },
      0,
    )
      .then(response => {
        if (response.IsDuplicate.toLowerCase() === 'true') {
          Utility.showAlert(
            Constants.ALERT.TITLE.INFO,
            response.Message[0].Message,
          );
        } else if (response.IsDuplicate.toLowerCase() === 'false') {
          callBack(true);
        }
      })
      .catch(error => {
        dispatch(handleError(error));
      });
  };
};

export const setCartCount = count => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SET_CART_COUNT,
      cartCount: count,
    });
  };
};

export const setLabTestSearchToInitial = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.LAB_TEST_SEARCH_TO_INITIAL,
    });
  };
};

export const clearLabTestSearch = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.CLEAR_LAB_TEST_SEARCH,
    });
  };
};

export const showLabTestSearchLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_TEST_SEARCH_LOADING,
    });
  };
};

export const hideLabTestSearchLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_TEST_SEARCH_LOADING,
    });
  };
};

/*************************************************
 * SukraasLIS
 * DashboardReducer.js
 * Created by Abdul on 22/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  isLoginLoading: false,
  offerPageLoading: true,
  promotionPageLoading: false,
  offerTestLoading: false,
  tipsPageLoading: false,
  arrPromotionDetails: [],
  offerDetailsArray: [],
  bookNowArray: [],
  bookNowAmount: 0,
  bookNowCartCount: 0,
  arrApplyPromoDetails: {},
  isShowRedeemNow: false,
};

export const dashboardState = (state = initialState, action) => {
  const {
    offerDetailsArray,
    bookNowArray,
    bookNowCartCount,
    bookNowAmount,
  } = action;
  switch (action.type) {
    case ACTIONS.SHOW_OFFER_SCREEN_LOADING:
      return {...state, offerPageLoading: true};
    case ACTIONS.SHOW_OFFER_SCREEN_TEST_LOADING:
      return {...state, offerTestLoading: true};
    case ACTIONS.HIDE_OFFER_SCREEN_TEST_LOADING:
      return {...state, offerTestLoading: false};
    case ACTIONS.HIDE_OFFER_SCREEN_LOADING:
      return {
        ...state,
        offerPageLoading: false,
      };
    case ACTIONS.GET_OFFER_DETAILS_SUCCESS:
      return {
        ...state,
        offerDetailsArray,
      };
    case ACTIONS.SHOW_PROMOTION_SCREEN_LOADING:
      return {...state, promotionPageLoading: true};
    case ACTIONS.UPDATE_PROMOTION_DETAILS:
      return {...state, arrPromotionDetails: action.promotionList};
    case ACTIONS.HIDE_PROMOTION_SCREEN_LOADING:
      return {...state, promotionPageLoading: false};
    case ACTIONS.SHOW_TIPS_SCREEN_LOADING:
      return {...state, tipsPageLoading: true};
    case ACTIONS.HIDE_TIPS_SCREEN_LOADING:
      return {...state, tipsPageLoading: false};
    case ACTIONS.BOOK_NOW_OFFERS_CART:
      return {...state, bookNowArray};
    case ACTIONS.BOOK_NOW_CART_AMOUNT:
      return {...state, bookNowAmount};
    case ACTIONS.BOOK_NOW_CART_COUNT:
      return {...state, bookNowCartCount};
    case ACTIONS.APPLY_PROMOCODE_SUCCESS:
      return {...state, arrApplyPromoDetails: action.payload};
    case ACTIONS.REMOVE_PROMOCODE:
      return {...state, arrApplyPromoDetails: {}};
    case ACTIONS.SHOW_REDEEM_NOW_TEXT:
      return {...state, isShowRedeemNow: action.payload};
    default:
      return state;
  }
};

/*************************************************
 * SukraasLIS
 * LabTestReducer.js
 * Created by Abdul on 09/06/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  isSearchLoading: false,
  searchResponseArray: [],
  cartCount: 0,
  cartArray: [],
  totalCartAmount: 0,
};

export const labTestState = (state = initialState, action) => {
  const {searchResponseArray, cartCount, cartArray, totalCartAmount} = action;
  switch (action.type) {
    case ACTIONS.SHOW_TEST_SEARCH_LOADING:
      return {...state, isSearchLoading: true};
    case ACTIONS.HIDE_TEST_SEARCH_LOADING:
      return {...state, isSearchLoading: false};
    case ACTIONS.LAB_TEST_SEARCH_SUCCESS:
      return {...state, searchResponseArray};
    case ACTIONS.SET_CART_COUNT:
      return {...state, cartCount};
    case ACTIONS.ADD_ITEM_TO_CART:
      return {...state, cartArray};
    case ACTIONS.CLEAR_LAB_TEST_SEARCH:
      return {...state, searchResponseArray: []};
    case ACTIONS.SET_TOTAL_CART_AMOUNT:
      return {...state, totalCartAmount};
    case ACTIONS.LAB_TEST_SEARCH_TO_INITIAL:
      return {...initialState};
    default:
      return state;
  }
};

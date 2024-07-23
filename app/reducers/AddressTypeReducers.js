/*************************************************
 * SukraasLIS
 * @exports
 * @class AddressTypeReducers.js
 * @extends Component
 * Created by Shiva Sankar on 26/06/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/
'use strict';
import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  addressTypeList: [],
};

export const addressTypeState = (state = initialState, action) => {
  const {type, addressTypeList} = action;

  switch (type) {
    case ACTIONS.UPDATE_ADDRESS_TYPE_LIST:
      return {...state, addressTypeList};
    default:
      return state;
  }
};

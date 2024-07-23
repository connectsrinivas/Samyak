/*************************************************
 * SukraasLIS
 * @exports
 * @class PatientTitleReducers.js
 * @extends Component
 * Created by Shiva Sankar on 17/12/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/
'use strict';
import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  titleList: [],
};

export const patientTitleState = (state = initialState, action) => {
  const {type, titleList} = action;

  switch (type) {
    case ACTIONS.UPDATE_TITLE_LIST:
      return {...state, titleList};
    default:
      return state;
  }
};

/*************************************************
 * SukraasLIS
 * @exports
 * @class GenderReducers.js
 * @extends Component
 * Created by Shiva Sankar on 09/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  genderList: [],
  isSubmitPatientLoading: false,
};

export const genderState = (state = initialState, action) => {
  const {type, genderList} = action;

  switch (type) {
    case ACTIONS.UPDATE_GENDER_LIST:
      return {...state, genderList};
    case ACTIONS.SHOW_SUBMIT_PATIENT_LOADING:
      return {...state, isSubmitPatientLoading: true};
    case ACTIONS.HIDE_SUBMIT_PATIENT_LOADING:
      return {...state, isSubmitPatientLoading: false};
    default:
      return state;
  }
};

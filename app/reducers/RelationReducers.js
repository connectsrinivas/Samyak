/*************************************************
 * SukraasLIS
 * @exports
 * @class RelationReducers.js
 * @extends Component
 * Created by Shiva Sankar on 09/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/
'use strict';
import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  relationList: [],
  linkedPatientList: [],
  isShowPatientListLoading: false,
};

export const relationState = (state = initialState, action) => {
  const {type, relationList, linkedPatientList} = action;

  switch (type) {
    case ACTIONS.UPDATE_RELATION_LIST:
      return {...state, relationList};
    case ACTIONS.GET_LINKED_PATIENT_LIST:
      return {...state, linkedPatientList};
    case ACTIONS.SHOW_SUBMIT_PATIENT_LIST_LOADING:
      return {...state, isShowPatientListLoading: true};
    case ACTIONS.HIDE_SUBMIT_PATIENT_LIST_LOADING:
      return {...state, isShowPatientListLoading: false};
    default:
      return state;
  }
};

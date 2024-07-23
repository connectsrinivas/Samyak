/*************************************************
 * SukraasLIS
 * @exports
 * @class ManageBranchReducers.js
 * @extends Component
 * Created by Shiva Sankar on 01/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  branchList: [],
  isBranchLoading: false,
  defaultBranch: {},
  
};

export const branchState = (state = initialState, action) => {
  const {type, branchList, defaultBranch} = action;

  switch (type) {
    case ACTIONS.SHOW_MANAGE_BRANCH_LOADING:
      return {...state, isBranchLoading: true};
    case ACTIONS.UPDATE_MANAGE_BRANCH_LIST:
      return {...state, branchList};
    case ACTIONS.HIDE_MANAGE_BRANCH_LOADING:
      return {...state, isBranchLoading: false};
    case ACTIONS.UPDATE_DEFAULT_BRANCH:
      return {...state, defaultBranch};
    default:
      return state;
  }
};



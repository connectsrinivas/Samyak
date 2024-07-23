/*************************************************
 * SukraasLIS
 * ConfigReducer.js
 * Created by Sankar on 8/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  isNotificationListLoading: false,
  count: 0,
  notificationListData: [],
  notificationUpdateData: {},
};

export const notificationState = (state = initialState, action) => {
  const {count, notificationListData, notificationUpdateData} = action;
  switch (action.type) {
    case ACTIONS.SHOW_NOTIFICATION_LOADING:
      return {...state, isNotificationListLoading: true};
    case ACTIONS.HIDE_NOTIFICATION_LOADING:
      return {...state, isNotificationListLoading: false};
    case ACTIONS.SET_NOTIFICATION_COUNT:
      return {...state, count: count};
    case ACTIONS.NOTIFICATION_LIST_DATA:
      return {...state, notificationListData: notificationListData};
    case ACTIONS.UPDATE_NOTIFICATIONS:
      return {...state, notificationUpdateData: notificationUpdateData};
    default:
      return state;
  }
};

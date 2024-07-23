/*************************************************
 * Sukraas
 * @exports
 * @class BookingAction.js
 * Created by Abdul Rahman on 02/06/2020
 * Copyright © 2020 Sukraas. All rights reserved.
 *************************************************/

'use strict';
import _ from 'lodash';
import Constants from '../util/Constants';
import HttpBaseClient from '../util/HttpBaseClient';
import Utility from '../util/Utility';
import {handleError} from './NetworkAction';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ORDER_BOOKING_LIST, S3URL } from '../util/URL';

// export const invokeBookingList = (name, pulltoRefresh) => {
//   return dispatch => {
//     dispatch(showBookingLoading());
//     if (pulltoRefresh === true) {
//       dispatch(showPullToRefresh());
//     }
//     setTimeout(function() {
//       HttpBaseClient.post(AsyncStorage.configUri.or_bo_li, {UserName: name}, 2)
//         .then(response => {
//           dispatch(hideBookingLoading());
//           if (pulltoRefresh === true) {
//             dispatch(hidePullToRefresh());
//           }
//           if (response.Code === Constants.HTTP_CODE.SUCCESS) {
//             if (response.Message[0].Booking_Detail != null) {
//               dispatch({
//                 type: Constants.ACTIONS.GET_BOOKING_ORDER_LIST,
//                 payload: response.Message[0].Booking_Detail,
//               });
//             } else {
//               // Utility.showAlert(
//               //   Constants.ALERT.TITLE.ERROR,
//               //   Constants.VALIDATION_MSG.NO_DATA_FOUND,
//               // );
//             }
//           } else {
//             if (response.Message[0].Message != null) {
//               Utility.showAlert(
//                 Constants.ALERT.TITLE.ERROR,
//                 response.Message[0].Message,
//               );
//             } else {
//               Utility.showAlert(
//                 Constants.ALERT.TITLE.ERROR,
//                 Constants.VALIDATION_MSG.NO_DATA_FOUND,
//               );
//             }
//           }
//         })
//         .catch(error => {
//           dispatch(hideBookingLoading());
//           if (pulltoRefresh === true) {
//             dispatch(hidePullToRefresh());
//           }
//           dispatch(handleError(error));
//         });
//     }, 1000);
//   };
// };

export const invokeBookingList = (name, pulltoRefresh) => {
  return async dispatch => {
    dispatch(showBookingLoading());

    if (pulltoRefresh === true) {
      dispatch(showPullToRefresh());
    }

    try {
      const response = await fetch(S3URL+"/"+ORDER_BOOKING_LIST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ UserName: name }),
      });

      const responseData = await response.json();

      dispatch(hideBookingLoading());

      if (pulltoRefresh === true) {
        dispatch(hidePullToRefresh());
      }

      if (response.ok) {
        if (responseData.Code === Constants.HTTP_CODE.SUCCESS) {
          if (responseData.Message[0].Booking_Detail != null) {
            dispatch({
              type: Constants.ACTIONS.GET_BOOKING_ORDER_LIST,
              payload: responseData.Message[0].Booking_Detail,
            });
          } else {
            // Handle case when Booking_Detail is null
            // Utility.showAlert(
            //   Constants.ALERT.TITLE.ERROR,
            //   Constants.VALIDATION_MSG.NO_DATA_FOUND,
            // );
          }
        } else {
          if (responseData.Message[0].Message != null) {
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              responseData.Message[0].Message,
            );
          } else {
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              Constants.VALIDATION_MSG.NO_DATA_FOUND,
            );
          }
        }
      } else {
        // Handle non-successful response
        Utility.showAlert(
          Constants.ALERT.TITLE.ERROR,
          Constants.VALIDATION_MSG.NO_DATA_FOUND,
        );
      }
    } catch (error) {
      dispatch(hideBookingLoading());
      if (pulltoRefresh === true) {
        dispatch(hidePullToRefresh());
      }
      dispatch(handleError(error));
    }
  };
};


export const showBookingLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.BOOKING_SHOW_LOADING,
    });
  };
};

export const hideBookingLoading = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.BOOKING_HIDE_LOADING,
    });
  };
};

export const showPullToRefresh = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.SHOW_PULL_TO_REFRESH_LOADING,
    });
  };
};

export const hidePullToRefresh = () => {
  return dispatch => {
    dispatch({
      type: Constants.ACTIONS.HIDE_PULL_TO_REFRESH_LOADING,
    });
  };
};

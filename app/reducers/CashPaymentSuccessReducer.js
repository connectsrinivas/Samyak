import Constants from '../util/Constants';
import {Actions} from 'react-native-router-flux';
const {ACTIONS} = Constants;

let initialState = {
  cashPaymentDetails: null,
  isCashPaymentLoading: false,
};

export const cashPaymentState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_CASHPAYMENT_LOADING:
      return {...state, isCashPaymentLoading: true};

    case ACTIONS.HIDE_CASHPAYMENT_LOADING:
      return {...state, isCashPaymentLoading: false};

    case ACTIONS.GET_CASHPAYMENT_DETAILS:
      return {...state, cashPaymentDetails: action.payload};

    default:
      return state;
  }
};

import Constants from '../util/Constants';
import {Actions} from 'react-native-router-flux';
const {ACTIONS} = Constants;

let initialState = {
  onlinePaymentDetails: null,
  isOnlinePaymentLoading: false,
  payumoneyDetails: {},
};

export const onlinePaymentState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_ONLINEPAYMENT_LOADING:
      return {...state, isOnlinePaymentLoading: true};
    case ACTIONS.HIDE_ONLINEPAYMENT_LOADING:
      return {...state, isOnlinePaymentLoading: false};
    case ACTIONS.GET_ONLINEPAYMENT_DETAILS:
      return {...state, onlinePaymentDetails: action.payload};
    case ACTIONS.GET_PAYUMONEY_DETAILS:
      return {...state, onlinePaymentDetails: action.payload};
    default:
      return state;
  }
};

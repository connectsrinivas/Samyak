import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  isBookingLoading: false,
  ispulltoRefreshloading: false,
  arrbookingOrderlist: [],
};

export const bookingState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.BOOKING_SHOW_LOADING:
      return {...state, isBookingLoading: true};
    case ACTIONS.BOOKING_HIDE_LOADING:
      return {...state, isBookingLoading: false};
    case ACTIONS.SHOW_PULL_TO_REFRESH_LOADING:
      return {...state, ispulltoRefreshloading: true};
    case ACTIONS.HIDE_PULL_TO_REFRESH_LOADING:
      return {...state, ispulltoRefreshloading: false};
    case ACTIONS.GET_BOOKING_ORDER_LIST:
      return {...state, arrbookingOrderlist: action.payload};
    default:
      return state;
  }
};

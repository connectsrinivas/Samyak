import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  isBookingLoading: false,
};

export const BookingCommentsState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_BOOKINGCOMMENTS_LOADING:
      return {...state, isBookingLoading: true};
    case ACTIONS.HIDE_BOOKINGCOMMENTS_LOADING:
      return {...state, isBookingLoading: false};
    default:
      return state;
  }
};

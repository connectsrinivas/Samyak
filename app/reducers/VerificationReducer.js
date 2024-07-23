import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  isVerificationLoading: false,
};

export const verificationState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.OTP_VERIFY_SHOW_LOADING:
      return {...state, isVerificationLoading: true};
    case ACTIONS.OTP_VERIFY_HIDE_LOADING:
      return {...state, isVerificationLoading: false};
    case ACTIONS.OTP_RESEND_SHOW_LOADING:
      return {...state, isVerificationLoading: true};
    case ACTIONS.OTP_RESEND_HIDE_LOADING:
      return {...state, isVerificationLoading: false};
    default:
      return state;
  }
};

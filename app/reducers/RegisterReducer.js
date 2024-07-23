import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  isRegistrationLoading: false,
};

export const registrationState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.REGISTER_SHOW_LOADING:
      return {...state, isRegistrationLoading: true};
    case ACTIONS.REGISTER_HIDE_LOADING:
      return {...state, isRegistrationLoading: false};
    default:
      return state;
  }
};

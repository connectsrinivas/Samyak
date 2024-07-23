import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  isSetPasswordLoading: false,
};

export const setPasswordState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_PASSWORD_SHOW_LOADING:
      return {...state, isSetPasswordLoading: true};
    case ACTIONS.SET_PASSWORD_HIDE_LOADING:
      return {...state, isSetPasswordLoading: false};
    default:
      return state;
  }
};

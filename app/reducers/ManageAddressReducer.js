import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  isAddressLoading: false,
  manageAddressList: null,
};

export const manageAddressState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_MANAGEADDRESS_LOADING:
      return {...state, isAddressLoading: true};
    case ACTIONS.HIDE_MANAGEADDRESS_LOADING:
      return {...state, isAddressLoading: false};
    case ACTIONS.GET_MANAGEADDRESS_LIST_DETAILS:
      return {...state, manageAddressList: action.payload};

    default:
      return state;
  }
};

import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  userListDetails: null,
  isUserListLoading: false,
};

export const userListState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_USER_LIST_LOADING:
      return {...state, isUserListLoading: true};
    case ACTIONS.HIDE_USER_LIST_LOADING:
      return {...state, isUserListLoading: false};
    case ACTIONS.GET_USER_LIST_DETAILS:
      return {...state, userListDetails: action.payload};
    default:
      return state;
  }
};

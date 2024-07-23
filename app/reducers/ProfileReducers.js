import Constants from '../util/Constants';
import {Actions} from 'react-native-router-flux';
const {ACTIONS} = Constants;

let initialState = {
  profileDetails: null,
  isProfileLoading: false,
  userImageURL: '',
};

export const profileState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.PROFILE_SHOW_LOADING:
      return {...state, isProfileLoading: true};
    case ACTIONS.PROFILE_HIDE_LOADING:
      return {...state, isProfileLoading: false};
    case ACTIONS.GET_PROFILE_DETAILS:
      return {...state, profileDetails: action.payload};
    case ACTIONS.USER_PROFILE_IMAGE:
      return {...state, userImageURL: action.url};
    default:
      return state;
  }
};

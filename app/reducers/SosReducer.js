import Constants from '../util/Constants';
import {Actions} from 'react-native-router-flux';
const {ACTIONS} = Constants;

let initialState = {
  sosDetails: null,
  isSosLoading: false,
};

export const sosState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SOS_SHOW_LOADING:
      return {...state, isSosLoading: true};
    case ACTIONS.SOS_HIDE_LOADING:
      return {...state, isSosLoading: false};
    case ACTIONS.GET_SOS_DETAILS:
      return {...state, sosDetails: action.payload};
    default:
      return state;
  }
};

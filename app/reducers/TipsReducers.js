import Constants from '../util/Constants';
import {Actions} from 'react-native-router-flux';
const {ACTIONS} = Constants;

let initialState = {
  tipsDetails: [],
  isTipsLoading: false,
};

export const tipsState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_TIPS_SCREEN_LOADING:
      return {...state, isTipsLoading: true};
    case ACTIONS.HIDE_TIPS_SCREEN_LOADING:
      return {...state, isTipsLoading: false};
    case ACTIONS.GET_TIPS_DETAILS:
      return {...state, tipsDetails: action.payload};
    default:
      return state;
  }
};

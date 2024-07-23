import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  isTestTrendsScreenLoading: false,
  showPatientList: false,
  arrPatientList: [],
  arrTestResults: [],
  arrTestLists: [],
  serviceValue: {},
};

export const testTrendState = (state = initialState, action) => {
  const {serviceValue} = action;
  switch (action.type) {
    case ACTIONS.SHOW_TESTTRENDS_LOADING:
      return {...state, isTestTrendsScreenLoading: true};
    case ACTIONS.HIDE_TESTTRENDS_LOADING:
      return {...state, isTestTrendsScreenLoading: false};
    case ACTIONS.GET_PATIENTLIST_DETAILS:
      return {...state, arrPatientList: action.payload, showPatientList: true};
    case ACTIONS.GET_RESULT_DETAILS:
      return {
        ...state,
        arrTestResults: action.payload,
        showPatientList: false,
        serviceValue,
      };
    case ACTIONS.GET_TESTLIST_DETAILS:
      return {...state, arrTestLists: action.payload, showPatientList: false};
    default:
      return state;
  }
};

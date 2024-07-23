import Constants from '../util/Constants';
const {ACTIONS} = Constants;

let initialState = {
  isUploadingPrescriptionLoading: false,
  isUploadPrescriptionSuccess: false,
  uploadBase64Image: [],
  uploadFileUri: [],
};

export const UploadPrescriptionState = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_UPLOADPRESCRIPTION_LOADING:
      return {...state, isUploadingPrescriptionLoading: true};
    case ACTIONS.HIDE_UPLOADPRESCRIPTION_LOADING:
      return {...state, isUploadingPrescriptionLoading: false};
    case ACTIONS.UPLOADPRESCRIPTION_SUCCESS:
      return {...state, isUploadPrescriptionSuccess: true};
    case ACTIONS.SAVE_BASE64_FORMAT:
      return {...state, uploadBase64Image: action.payload};
    case ACTIONS.DELETE_UPLOAD_IMAGE:
      return {...state, uploadBase64Image: [], uploadFileUri: []};
    case ACTIONS.SAVE_URI_FORMAT:
      return {...state, uploadFileUri: action.payload};

    default:
      return state;
  }
};

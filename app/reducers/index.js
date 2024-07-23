/*************************************************
 * SukraasLIS
 * @exports
 * index.js
 * Created by Jagadish Sellamuthu on 12/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';

import {combineReducers} from 'redux';

import {deviceState} from './DeviceReducer';
import {splashState} from './SplashReducer';
import {signInState} from './SignInReducer';
import {signupState} from './SignupReducer';
import {verificationState} from './VerificationReducer';
import {setPasswordState} from './SetPasswordReducer';
import {registrationState} from './RegisterReducer';
import {loginState} from './LoginReducer';
import {bookingState} from './BookingStateReducers';
import {dashboardState} from './DashboardReducer';
import {labTestState} from './LabTestReducer';
import {genderState} from './GenderReducer';
import {relationState} from './RelationReducers';
import {UploadPrescriptionState} from './UploadPrescriptionReducer';
import {BookingCommentsState} from './BookingCommentsReducer';
import {profileState} from './ProfileReducers';

import {tipsState} from './TipsReducers';
import {userListState} from './usersListReducer';
import {addAddressState, updateAddressState} from './AddEditAddressReducer';
import {manageAddressState} from '../reducers/ManageAddressReducer';
import {patientInfoState} from './PatientInfoReducers';
import {testTrendState} from '../reducers/TestTrendsReducer';
import {cashPaymentState} from '../reducers/CashPaymentSuccessReducer';
import {onlinePaymentState} from '../reducers/OnlinePaymentSucessReducer';
import {labTestSummaryState} from '../reducers/LabTestSummaryReducer';
import {addressTypeState} from '../reducers/AddressTypeReducers';
import {branchState} from './MangeBranchReducers';
import {labTestPaymentDetailsState} from './LabTestPaymentDetailsReducer';
import {configState} from './ConfigReducer.js';
import {aboutScreenState} from './AboutScreenReducer.js';
import {contactScreenState} from './ContactScreenReducer';
import Constants from '../util/Constants';
import {bookingDetailState} from './BookingDetailReducer';
import {notificationState} from './NotificationReducer.js';
import {sosState} from './SosReducer';
import {termsScreenState} from './TermsAndConditionReducers';
import {patientTitleState} from './PatientTitleReducers';

//Combines all the reducer for the store and exports to it
const rootReducer = combineReducers({
  deviceState,
  splashState,
  signInState,
  signupState,
  verificationState,
  setPasswordState,
  registrationState,
  loginState,
  bookingState,
  dashboardState,
  labTestState,
  profileState,
  genderState,
  relationState,
  UploadPrescriptionState,
  BookingCommentsState,
  manageAddressState,
  patientInfoState,

  testTrendState,
  tipsState,
  addAddressState,
  updateAddressState,
  userListState,
  cashPaymentState,
  onlinePaymentState,
  labTestSummaryState,
  addressTypeState,
  branchState,
  labTestPaymentDetailsState,
  configState,
  aboutScreenState,
  contactScreenState,
  bookingDetailState,
  notificationState,
  sosState,
  termsScreenState,
  patientTitleState,
});

const appReducers = (state, action) => {
  if (action.type === Constants.ACTIONS.LOGOUT_USER) {
    state = undefined;
  }
  return rootReducer(state, action);
};

export default appReducers;

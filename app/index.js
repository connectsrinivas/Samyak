/*************************************************
 * SukraLIS
 * @exports
 * @class index.js
 * @extends Component
 * Created by Jagadish Sellamuthu on 11/11/2019
 * Copyright © 2020 SukraLIS. All rights reserved.
 *************************************************/

'use strict';

import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Router, Scene, ActionConst, Actions } from 'react-native-router-flux';
import Constants from './util/Constants';

import TabIcon from './util/TabIcon';
import DboardTabIcon from './util/DboardTabIcon';

import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import VerificationScreen from './components/VerificationScreen';
import SetPasswordScreen from './components/SetPasswordScreen';
import PromotionScreen from './components/dashboard/PromotionScreen';
import OfferScreen from './components/dashboard/OfferScreen';
import TipsScreen from './components/dashboard/TipsScreen';
import BookingsScreen from './components/bookings/BookingsScreen';
import LabTestScreen from './components/lab_test/LabTestScreen';
import TrendsScreen from './components/test_trends/TrendsScreen';
import SettingsScreen from './components/settings/SettingsScreen';
import BookingDetailsScreen from './components/bookings/BookingDetailsScreen';

import NavBar from './components/common/NavigationBar';
import ManageUsersScreen from './components/settings/ManageUsersScreen';
import LabTestSummary from './components/lab_test/LabTestSummary';
import LabTestSearch from './components/lab_test/LabTestSearch';
import DashboardTabBar from './components/dashboard/DashboardTabBar';

import LabTestPaymentDetails from './components/lab_test/LabTestPaymentDetails';
import OnlinePaymentSuccess from './components/payment/OnlinePaymentSucess';
import CashPaymentSuccess from './components/payment/CashPaymentSuccess';
import QRScanner from './components/bookings/QRScanner';

import ManageAddressScreen from './components/settings/ManageAddressScreen';

import PatientInfo from './components/lab_test/PatientInfo';
import calender from './components/lab_test/Calender';

import ContactUsScreen from './components/settings/ContactUsScreen';
import ProfileScreen from './components/navigation_bar/ProfileScreen';
import SOSScreen from './components/navigation_bar/SOSScreen';
import NotificationScreen from './components/navigation_bar/NotificationScreen';
import UploadPrescriptionScreen from './components/lab_test/UploadPrescriptionScreen';
import LocationScreen from './components/LocationScreen';
import AboutScreen from './components/settings/AboutScreen';
import TipsListRow from './components/dashboard/TipsListRow';
import ManageBranchScreen from './components/settings/ManageBranchScreen';

import OfflineNotice from '../app/components/common/OfflineNotice';

import FullChart from './components/test_trends/Fullchart';
import TableTestReport from './components/test_trends/TableTestReport';
import pdfReport from './components/bookings/PdfReport';
import PaymentWebView from './components/payment/PaymentWebView';
import PayUMoney from './components/payment/PayUMoney';
import PaymentFailure from './components/payment/PaymentFailure';
import TermsAndConditionScreen from './components/TermsAndConditionScreen';
import ZoomImageScreen from './components/bookings/ZoomImageScreen';
import BottomBar from './components/common/BottomBar';
import AddAddressScreen from './components/AddAddressScreen';
import AddUsersScreen from './components/AddUsersScreen';
/**
 * Registeres all the components used in the application for navigation
 */
class Main extends Component {
  onBackPress = () => {
    if (Actions.state.index === 0) {
      return false;
    }
    Actions.pop();
    return true;
  };
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <Router backAndroidHandler={this.onBackPress}>
          <Scene key="root" hideNavBar>
            <Scene initial key={'splashScreen'} component={SplashScreen} />
            <Scene
              key={'LoginScreen'}
              component={LoginScreen}
              type={ActionConst.RESET}
            />

            <Scene key={'RegisterScreen'} component={RegisterScreen} />

            <Scene key={'Calender'} component={calender} />
            <Scene
              key={'verificationScreen'}
              component={VerificationScreen}
              panHandlers={null}
            />
            <Scene
              key={'SetPasswordScreen'}
              component={SetPasswordScreen}
              type={ActionConst.RESET}
            />
            <Scene
              key={'addUsersScreen'}
              component={AddUsersScreen}
              hideNavBar={false}
              navBar={NavBar}
              isShowLocation={false}
            />

            <Scene
              key={'addAddressScreen'}
              component={AddAddressScreen}
              hideNavBar={false}
              navBar={NavBar}
              isShowLocation={false}
            />

            <Scene
              key={'ProfileScreen'}
              component={ProfileScreen}
              hideNavBar={true}
              isShowNavBar={false}
            />
            <Scene
              key={'SOSScreen'}
              component={SOSScreen}
              hideNavBar={false}
              navBar={NavBar}
              isShowLocation={false}
            />
            <Scene
              key={'TipsListRow'}
              component={TipsListRow}
              hideNavBar={false}
              navBar={NavBar}
              isShowLocation={false}
            />

            <Scene
              key={'manageBranchScreen'}
              component={ManageBranchScreen}
              hideNavBar={false}
              isShowNavBar={true}
              title="Manage Branch"
              navBar={NavBar}
              isShowLocation={false}
            />
            <Scene
              key={'manageBranchScreenLogin'}
              component={ManageBranchScreen}
              hideNavBar={false}
              isShowNavBar={true}
              title="Manage Branch"
              navBar={NavBar}
              isShowLocation={false}
              isHideImages={true}
              type={ActionConst.RESET}
            />

            <Scene
              key={'uploadPrescriptionScreen'}
              component={UploadPrescriptionScreen}
              hideNavBar={false}
              navBar={NavBar}
              isShowLocation={false}
            />

            <Scene
              key={'NotificationScreen'}
              component={NotificationScreen}
              hideNavBar={false}
              navBar={NavBar}
              isShowLocation={false}
            />
            <Scene
              key={'cashPaymentSuccess'}
              component={CashPaymentSuccess}
              title={'Payment'}
              hideNavBar={false}
              navBar={NavBar}
              isShowNavBar={true}
              isShowLocation={true}
              type={ActionConst.RESET}
            />

            <Scene
              key={'paymentFailure'}
              component={PaymentFailure}
              title={'Payment Failure'}
              hideNavBar={false}
              navBar={NavBar}
              isShowNavBar={true}
              isShowLocation={false}
              type={ActionConst.RESET}
            />
            <Scene
              key={'onlinePaymentSuccess'}
              component={OnlinePaymentSuccess}
              title={'Payment'}
              hideNavBar={false}
              navBar={NavBar}
              isShowNavBar={true}
              isShowLocation={true}
              type={ActionConst.RESET}
            />
            <Scene
              key={'paymentWebView'}
              component={PaymentWebView}
              hideNavBar={false}
              navBar={NavBar}
              isShowLocation={false}
              panHandlers={null}
            />
            <Scene
              key={'payumoney'}
              component={PayUMoney}
              hideNavBar={false}
              navBar={NavBar}
              isShowLocation={false}
              panHandlers={null}
            />
            <Scene
              key={'PatientInfo'}
              component={PatientInfo}
              hideNavBar={false}
              navBar={NavBar}
              isShowNavBar={true}
              isShowLocation={true}
            />

            <Scene
              key={'BookingDetailsScreen'}
              component={BookingDetailsScreen}
              hideNavBar={false}
              navBar={NavBar}
              isShowNavBar={true}
              isShowLocation={false}
            />

            <Scene key={'QRScanner'} component={QRScanner} hideNavBar />
            <Scene
              key={'LabTestSearch'}
              component={LabTestSearch}
              hideNavBar={false}
              navBar={NavBar}
              isShowLocation={false}
            />
            <Scene
              key={'LocationScreen'}
              component={LocationScreen}
              hideNavBar={false}
              navBar={NavBar}
              isShowLocation={false}
            />
            <Scene
              key={'TermsAndCondition'}
              component={TermsAndConditionScreen}
              title="Terms And Conditions"
              hideNavBar={false}
              isShowNavBar={true}
              navBar={NavBar}
              isHideImages={true}
              isShowLocation={false}
            />
            <Scene
              key={'ZoomImageScreen'}
              component={ZoomImageScreen}
              hideNavBar={false}
              navBar={NavBar}
              isShowLocation={false}
            />
            <Scene key={'PdfReport'} component={pdfReport} />
            <Scene
              key={'homeTabBar'}
              type={ActionConst.RESET}
              tabs={true}
              tabBarPosition={'bottom'}
              activeTintColor={Constants.COLOR.THEME_COLOR}
              inactiveTintColor={'#000000'}
              activeBackgroundColor={'white'}
              inactiveBackgroundColor={'white'}
              showLabel={true}
              tabBarComponent={BottomBar}
              // hideNavBar={false}
              navBar={NavBar}
              isShowNavBar={true}>
              <Scene
                key={'bookingsTab'}
                icon={TabIcon}
                tabBarLabel={'Bookings'}
                title={'Bookings'}
                hideNavBar={false}
              // isShowLocation={true}
              >
                <Scene key={'bookingsScreen'} component={BookingsScreen} />
              </Scene>

              <Scene
                key={'labTestTab'}
                icon={TabIcon}
                tabBarLabel={'Lab Test'}
                title={'Lab Test'}
                hideNavBar={false}
                isShowLocation={true}>
                <Scene key={'labTestScreen'} component={LabTestScreen} />
                <Scene key={'LabTestSummary'} component={LabTestSummary} />
                <Scene key={'PatientInfo'} component={PatientInfo} />
                <Scene
                  key={'labTestPaymentDetails'}
                  component={LabTestPaymentDetails}
                />
              </Scene>
              <Scene
                // tabBarOnPress={() => {
                //   Actions.jump('nearbyScreenTab');
                // }}
                key={'homeScreenTab'}
                icon={TabIcon}
                tabBarLabel={'Dashboard'}>
                <Scene
                  tabBarStyle={{ backgroundColor: Constants.COLOR.THEME_COLOR }}
                  cardStyle={{ backgroundColor: Constants.COLOR.THEME_COLOR }}
                  key={'dashboardTabBar'}
                  type={ActionConst.RESET}
                  tabs={true}
                  tabBarPosition={'top'}
                  activeTintColor={'white'}
                  inactiveTintColor={'#000000'}
                  activeBackgroundColor={'white'}
                  inactiveBackgroundColor={'white'}
                  showLabel={true}
                  title={'Dashboard'}
                  component={DashboardTabBar}
                  hideNavBar={false}
                  isShowLocation={false}>
                  <Scene
                    key={'offerTab'}
                    icon={TabIcon}
                    tabBarLabel={'Package Offer'}
                    hideNavBar>
                    <Scene key={'offerScreen'} component={OfferScreen} />
                  </Scene>

                  <Scene
                    key={'promotionTab'}
                    icon={TabIcon}
                    tabBarLabel={'Promotion'}
                    hideNavBar>
                    <Scene
                      key={'promotionScreen'}
                      component={PromotionScreen}
                    />
                  </Scene>

                  <Scene
                    key={'tipsTab'}
                    icon={TabIcon}
                    tabBarLabel={'Health Tips'}
                    hideNavBar>
                    <Scene key={'tipsScreen'} component={TipsScreen} />
                  </Scene>
                </Scene>
              </Scene>
       
              <Scene
                key={'trendsTab'}
                icon={TabIcon}
                tabBarLabel={'Test Trends'}
                title={'Test Trends'}
                hideNavBar={false}
                isShowLocation={true}>
                <Scene key={'trendsScreen'} component={TrendsScreen} />
                <Scene
                  key={'fullChart'}
                  component={FullChart}
                  hideNavBar={true}
                  hideTabBar={true}
                  isShowNavBar={false}
                />
                <Scene
                  key={'tableTestReport'}
                  component={TableTestReport}
                  hideNavBar={true}
                  hideTabBar={true}
                  isShowNavBar={false}
                />
              </Scene>
              <Scene
                key={'SettingsTab'}
                icon={TabIcon}
                tabBarLabel={'Settings'}
                hideNavBar={false}
                isShowLocation={true}>
                <Scene
                  key={'settingsScreen'}
                  component={SettingsScreen}
                  hideNavBar={false}
                  isShowNavBar={true}
                  title="Settings"
                  navBar={NavBar}
                />

                <Scene
                  key={'manageUsersScreen'}
                  component={ManageUsersScreen}
                  hideNavBar={false}
                  isShowNavBar={true}
                  title="Manage Members"
                  navBar={NavBar}
                />
                <Scene
                  key={'manageAddressScreen'}
                  component={ManageAddressScreen}
                  hideNavBar={false}
                  isShowNavBar={true}
                  title="Manage Address"
                  navBar={NavBar}
                />
                <Scene
                  key={'contactUsScreen'}
                  component={ContactUsScreen}
                  hideNavBar={false}
                  isShowNavBar={true}
                  title="Contact Us"
                  navBar={NavBar}
                />
                <Scene
                  key={'aboutScreen'}
                  component={AboutScreen}
                  hideNavBar={false}
                  isShowNavBar={true}
                  title="About"
                  navBar={NavBar}
                />
              </Scene>
            </Scene>
          </Scene>
        </Router>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
          <OfflineNotice />
        </View>
      </SafeAreaView>
    );
  }
}

export default Main;

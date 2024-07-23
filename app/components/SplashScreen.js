/* eslint-disable react-native/no-inline-styles */
/*************************************************
 * SukraasLIS
 * @exports
 * @class SplashScreen.js
 * @extends Component
 * Created by Abdul Rahman on 21/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
  BackHandler,
} from 'react-native';
import RNExitApp from 'react-native-exit-app';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { checkNetworkConnection } from '../actions/NetworkAction';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import Spinner from 'react-native-spinkit';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Actions } from 'react-native-router-flux';
import DeviceInfo from 'react-native-device-info';
import { S3URL } from '../util/URL';
let androidStoreUrl =
  'https://play.google.com/store/apps/details?id=com.samyak.patient';
let iosStoreUrl = 'https://www.google.com';
import {
  setFirmName,
  setFirmNo,
  setCurrency,
  setUploadSize,
  setMobileNo,
  configAPICall,
  setProfileImage,
  setProfileUploadSize,
  setDeviceInfo,
  setOnlinePaymentUrl,
  setDeliveryDistance,
  setBranchLatitude,
  setBranchLongitude,
  setPatientLimit,
  setManageAddressStatus,
  setMenuList,
  setSOSAlert,
  setInAppNotification,
} from '../actions/ConfigAction';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

const deviceWidth = Dimensions.get('window').width;



class SplashScreen extends Component {
  //  static propTypes = {
  //   checkNetworkConnection: PropTypes.func,
  //   showSpinner: PropTypes.func,
  //   isLoading: PropTypes.bool,
  //   errorMessage: PropTypes.string,

  //   isShowConfigLoading: PropTypes.bool,
  //   configAPICall: PropTypes.func,
  //   setFirmName: PropTypes.func,
  //   setFirmNo: PropTypes.func,
  //   setCurrency: PropTypes.func,
  //   setUploadSize: PropTypes.func,
  //   setMobileNo: PropTypes.func,
  //   setProfileImage: PropTypes.func,
  //   setProfileUploadSize: PropTypes.func,
  //   setDeviceInfo: PropTypes.func,
  //   setOnlinePaymentUrl: PropTypes.func,
  //   setDeliveryDistance: PropTypes.func,
  //   setBranchLatitude: PropTypes.func,
  //   setBranchLongitude: PropTypes.func,
  //   setPatientLimit: PropTypes.func,
  //   setManageAddressStatus: PropTypes.func,
  //   setMenuList: PropTypes.func,
  //   setSOSAlert: PropTypes.func,
  //   setInAppNotification: PropTypes.func,
  //   currency: PropTypes.string,
  //   firmName: PropTypes.string,
  //   firmNo: PropTypes.string,
  //   isNetworkConnectivityAvailable: PropTypes.bool,
  // };

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: 'false',
      isShowMaintenance: false,
      isOptionalUpdate: false,
      isForceUpdate: false,
    };
  }

  componentDidMount() {
    NetInfo.addEventListener(networkResponse => { });

    this.props.checkNetworkConnection((isSuccess, isNetwork) => { });

    setTimeout(() => {
      let appVersion = DeviceInfo.getVersion();
      let device_id = DeviceInfo.getUniqueId();
      let device_type = Platform.OS === 'ios' ? 'iOS' : 'Android';
      let os_version = DeviceInfo.getSystemVersion();
      let app_version = DeviceInfo.getVersion();
      let device_info = DeviceInfo.getModel();

      let deviceInfoArray = {
        device_id: device_id,
        device_type: device_type,
        os_version: os_version,
        app_version: app_version,
        device_info: device_info,
      };
      this.props.setDeviceInfo(deviceInfoArray);

      if (this.props.isNetworkConnectivityAvailable) {
        this._getUrlFromConfig();

      } else {
        this._renderNoInternetAlert();
      }
    }, 100);
  }

  _callAppConfigAPI = () => {
    this.props.configAPICall((isSuccess, dataJSON) => {
      console.log("dataJson==========>", dataJSON);
      if (isSuccess) {
        this.props.setCurrency(dataJSON.Default_Currency);
        this.props.setUploadSize(dataJSON.Presc_Upload_File_Size);
        this.props.setProfileUploadSize(dataJSON.User_Profile_File_Size);
        this.props.setOnlinePaymentUrl(dataJSON.Online_Payment_Url);
        this.props.setDeliveryDistance(
          dataJSON.HomeCollection_Service_Distance,
        );
        this.props.setPatientLimit(dataJSON.Member_Addition_Limit);
        this.props.setManageAddressStatus(dataJSON.Show_Manage_Address);
        this.props.setMenuList(dataJSON.Menu_Items);
        this.props.setSOSAlert(dataJSON.Show_SOS_Alert);
        this.props.setInAppNotification(dataJSON.Show_InApp_Notification);
        AsyncStorage.setItem(
          Constants.ASYNC.ASYNC_BRANCH_LATITUDE,
          dataJSON.Service_Latitude.toString(),
        );
        AsyncStorage.setItem(
          Constants.ASYNC.ASYNC_BRANCH_LONGITUDE,
          dataJSON.Service_Longitude.toString(),
        );
        this._settingDataFromAsync();
      }
    });
  };

  /**
   * Get app url from config
   */
  _getUrlFromConfig() {
    if (this.props.isNetworkConnectivityAvailable) {
      console.log("Network connectivity available:", this.props.isNetworkConnectivityAvailable);
  
      fetch("http://110.44.126.145/SamyakApp/App_Config/Live_Patient/config.json", {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: 0,
        },
      })
        .then(response => {
          console.log('%%%%%%%%%%%%% response %%%%%%%%%%%', response);
          return response.json();
        })
        .then(responseJson => {
          this._validate_Maintenance(responseJson);
        })
        .catch(error => {
          console.log(error);
          Alert.alert(Constants.ALERT.WENT_WRONG + ' 001');
        });
    } else {
      this._renderNoInternetAlert();
    }
  }
  

  /**
   * Get app url from config
   */
  _validate_Maintenance(responseJson) {
    if (responseJson.mnt === 0) {
      AsyncStorage.configDetails = responseJson;
      this._checkVersionCompatibility();
    } else {
      this.setState({
        isShowLoading: false,
        isShowMaintenance: true,
      });
    }
  }

  _checkVersionCompatibility() {
    let appVersion = DeviceInfo.getVersion();
    console.log(appVersion, "appversion")
    let uri = AsyncStorage.configDetails.vr[appVersion];
    let latestVersion = AsyncStorage.configDetails.vr.lver;
    if (AsyncStorage.configDetails.vru[appVersion]) {
      this.setState({ isForceUpdate: true });
    } else {
      this.setState({ isForceUpdate: false });
      if (appVersion === latestVersion) {
        this.setState({ isOptionalUpdate: false });
        this._configureUri(uri);
      } else {
        this.setState({ isOptionalUpdate: true });
      }
    }
  }

  _configureUri(uri) {
    if (this.props.isNetworkConnectivityAvailable) {
      console.log(AsyncStorage.configDetails.vbu, "one..................", uri, "aaaaaaaaaaacvjhcvavcjavaaaaaaaaaaaaaaa")
      fetch(AsyncStorage.configDetails.vbu + uri, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: 0,
        },
      })
        .then(response => {
          return response.json();
        })
        .then(responseJson => {
          console.log('^^^^^^^^^^^^^^^ AsyncStorage.configUri ^^^^^^', AsyncStorage.configUri);
          AsyncStorage.configUri = responseJson;
          setTimeout(() => {
            this._callAppConfigAPI();
          }, 100);
        })
        .catch(error => {
          Alert.alert(Constants.ALERT.WENT_WRONG + ' 001');
        });
    } else {
      this._renderNoInternetAlert();
    }
  }

  _settingDataFromAsync = async () => {

    //Check for LOGIN SUCCESS
    const isLoggedInValue = await AsyncStorage.getItem(
      Constants.ASYNC.ASYNC_LOGIN_SUCCESS,
    );
    if (isLoggedInValue !== null) {
      this.setState({ isLoggedIn: isLoggedInValue });

      //MOBILE
      const mobileNo = await AsyncStorage.getItem(
        Constants.ASYNC.ASYNC_PHONE_NUMBER,
      );
      if (isLoggedInValue !== null) {
        this.props.setMobileNo(mobileNo);
      } else {
        this.props.setMobileNo('');
      }

      //FIRM NO
      const firmNo = await AsyncStorage.getItem(
        Constants.ASYNC.ASYNC_DEFAULT_FIRM_NO,
      );
      if (firmNo !== null) {
        this.props.setFirmNo(firmNo);
      } else {
        this.props.setFirmNo('');
      }

      //FIRM NAME
      const firmName = await AsyncStorage.getItem(
        Constants.ASYNC.ASYNC_DEFAULT_BRANCH_NAME,
      );
      if (firmName !== null) {
        this.props.setFirmName(firmName);
      } else {
        this.props.setFirmName('');
      }
    } else {
      this.setState({ isLoggedIn: 'false' });
    }

    //USER PROFILE IMAGE
    const url = await AsyncStorage.getItem(
      Constants.ASYNC.ASYNC_USER_IMAGE_URL,
    );
    if (url !== null) {
      this.props.setProfileImage(url);
    } else {
      this.props.setProfileImage('');
    }

    //USER BRANCH LATITUDE
    const latitude = await AsyncStorage.getItem(
      Constants.ASYNC.ASYNC_BRANCH_LATITUDE,
    );
    console.log(latitude, "[[[[[[[[[[[[[----------------------\\\\\\\\\\")
    if (latitude !== null) {
      this.props.setBranchLatitude(parseFloat(latitude));
    } else {
      this.props.setBranchLatitude(0);
    }
    console.log("Branch Latitude ", latitude)
    //USER BRANCH LONGITUDE
    const longitude = await AsyncStorage.getItem(
      Constants.ASYNC.ASYNC_BRANCH_LONGITUDE,
    );
    if (longitude !== null) {
      this.props.setBranchLongitude(parseFloat(longitude));
    } else {
      this.props.setBranchLongitude(0);
    }
    console.log("Branch Latitude ", longitude)

    console.log('Login Screen Move up');
    if (this.state.isLoggedIn === 'true') {
      if (this.props.firmName.trim().length < 1) {
        Actions.manageBranchScreenLogin();
      } else {
        Actions.homeTabBar();
        if (this.props.isFromNotification) {
          Actions.BookingDetailsScreen({
            UserName: this.props.mobileNo,
            Booking_Type: this.props.notificationData.Booking_Type,
            Firm_No: this.props.firmNo,
            Booking_Date: this.props.notificationData.Booking_Date,
            Booking_No: this.props.notificationData.Booking_No,
            Branch_Name: this.props.notificationData.Branch_Name,
            notificationData: this.props.notificationData,
            isFromNotification: this.props.isFromNotification,
          });
        }
      }
    } else {
      // console.log('loginScreen')
      Actions.LoginScreen();
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }
  /**
   * Renders activity indicator when version api is being invoked
   */
  _renderAcitvityIndicator = () => {
    if (true) {
      return (
        <Spinner
          style={{
            marginTop: deviceHeight / 10,
            alignItems: 'center',
            alignSelf: 'center',
          }}
          isVisible={true}
          size={40}
          type={'Wave'}
          color={Constants.COLOR.THEME_COLOR}
        />
      );
    } else {
      return (
        <View style={{ paddingTop: 100 * (2 / 5), alignItems: 'center' }}>
          <Text
            key={'0001'}
            style={{
              textAlign: 'center',
              fontSize: Constants.FONT_SIZE.M,
              fontFamily: 'Lato-Medium',
            }}>
            {this.props.errorMessage}
          </Text>
          <TouchableOpacity
            style={{ marginTop: deviceHeight / 40 }}
            key={'0002'}
            onPress={() => { }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: Constants.FONT_SIZE.L,
                fontFamily: 'Lato-Bold',
                color: Constants.COLOR.THEME_COLOR,
              }}>
              Tap to Reload
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  showMaintenanceAlert = () => {
    Alert.alert(
      '',
      "We are currently undergoing maintenance. This won't take long",
      [
        {
          text: 'EXIT',
          onPress: () => {
            if (Platform.OS === 'android') {
              BackHandler.exitApp();
              BackHandler.exitApp();
            } else {
              RNExitApp.exitApp();
              RNExitApp.exitApp();
            }
          },
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  };
  /**
   * Renders Splash Screen Design
   */
  render() {
    if (this.state.isShowMaintenance) {
      return <View>{this.showMaintenanceAlert()}</View>;
      // return (
      //   <View style={styles.container}>
      //     <Image
      //       resizeMode={'contain'}
      //       source={require('../images/Samyak_Splash_Logo.png')}
      //       style={styles.backgroundImage}
      //     />
      //   </View>
      // );
    } else {
      return (
        <View style={styles.containerMain}>
          <View style={styles.imageContainer}>
            <Image
              resizeMode="contain"
              source={require('../images/Samyak_Splash_Logo.png')}
              style={styles.image}
            />
          </View>
          {this._renderAcitvityIndicator()}
          {this._renderScreenContent()}
        </View>
      );
    }
  }

  _renderScreenContent() {
    console.log('0000000000000000 this.state.isForceUpdate 000000000000000000', this.state.isForceUpdate);
    if (this.state.isForceUpdate) {
      return (
        <View style={styles.updateBackgroundView}>
          <View style={styles.updateView}>
            <Text style={styles.updateHeaderTxt}>New Version Available</Text>
            <Text style={styles.updateDescTxt}>
              There is a new version available for download! Please update the
              app
            </Text>
            <View style={styles.updateBtnView}>
              <TouchableOpacity
                style={styles.updateBtn}
                onPress={async () =>
                  Linking.openURL(
                    Platform.OS === 'ios' ? iosStoreUrl : androidStoreUrl,
                  )
                }>
                <Text style={styles.btnTxt}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } else if (this.state.isOptionalUpdate) {
      return (
        <View style={styles.updateBackgroundView}>
          <View style={styles.updateView}>
            <Text style={styles.updateHeaderTxt}>New Version Available</Text>
            <Text style={styles.updateDescTxt}>
              There is a new version available for download! Please update the
              app
            </Text>
            <View style={styles.updateBtnView}>
              <TouchableOpacity
                style={styles.updateBtn}
                onPress={() => {
                  this.setState({ isOptionalUpdate: false });
                  this._configureUri(
                    AsyncStorage.configDetails.vr[DeviceInfo.getVersion()],
                  );
                }}>
                <Text style={styles.noThanksBtnTxt}>No Thanks</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.updateBtn}
                onPress={async () =>
                  Linking.openURL(
                    Platform.OS === 'ios' ? iosStoreUrl : androidStoreUrl,
                  )
                }>
                <Text style={styles.btnTxt}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } else {
      return <View />;
    }
  }

  _renderNoInternetAlert = () => {
    Alert.alert(
      Constants.ALERT.TITLE.NO_INTERNET,
      Constants.VALIDATION_MSG.NO_INTERNET,
      [
        {
          text: 'Ok',
          onPress: () => {
            if (Platform.OS === 'android') {
              BackHandler.exitApp();
            } else {
              RNExitApp.exitApp();
            }
          },
        },
      ],
      { cancelable: false },
    );
  };
}

const mapStateToProps = (state, props) => {
  //props can be called as ownProps
  const {
    splashState: { isLoading, errorMessage },
    configState: { isShowConfigLoading, currency, firmName, firmNo, mobileNo },
    deviceState: { isNetworkConnectivityAvailable },
  } = state;

  return {
    isLoading,
    errorMessage,
    isShowConfigLoading,
    currency,
    firmName,
    firmNo,
    mobileNo,
    isNetworkConnectivityAvailable,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      checkNetworkConnection,
      setFirmName,
      setFirmNo,
      setCurrency,
      setUploadSize,
      setMobileNo,
      configAPICall,
      setProfileImage,
      setProfileUploadSize,
      setDeviceInfo,
      setOnlinePaymentUrl,
      setDeliveryDistance,
      setBranchLatitude,
      setBranchLongitude,
      setPatientLimit,
      setManageAddressStatus,
      setMenuList,
      setSOSAlert,
      setInAppNotification,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SplashScreen);

// define your styles
const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: deviceHeight * (5 / 45),
    height: deviceHeight * (5 / 45),
  },
  container: {
    flex: 1,
  },
  backgroundImage: {
    height: deviceHeight,
    width: deviceWidth,
    resizeMode: 'cover', // or 'stretch'
  },
  imageContainer: {
    alignSelf: 'center',
  },
  updateBackgroundView: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  updateView: {
    backgroundColor: 'white',
    margin: 40,
    borderRadius: 10,
  },
  updateHeaderTxt: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: deviceWidth / 20,
    textAlign: 'center',
    padding: 10,
  },
  updateDescTxt: {
    color: Constants.COLOR.TEXT_GRAY_COLOR,
    fontSize: deviceWidth / 25,
    textAlign: 'center',
    padding: 10,
    paddingTop: 0,
  },
  updateBtnView: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Constants.COLOR.LIGHT_GRAY_COLOR,
  },
  btnTxt: {
    color: Constants.COLOR.THEME,
    textAlign: 'center',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: deviceWidth / 22,
  },
  updateBtn: {
    padding: 10,
    flex: 1,
  },
  noThanksBtnTxt: {
    color: 'black',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: deviceWidth / 22,
  },
});


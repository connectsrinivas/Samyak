import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  View,
  ImageBackground,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
// import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LoadingScreen from './common/LoadingScreen';
import { loginOnSubmit } from '../actions/LoginAction';
import { checkNetworkConnection } from '../actions/NetworkAction.js'
import {
  setFirmName,
  setFirmNo,
  setProfileImage,
  setMobileNo,
  setBranchLatitude,
  setBranchLongitude,
} from '../actions/ConfigAction';
import { Actions, ActionConst } from 'react-native-router-flux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import DeviceInfo from 'react-native-device-info';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

let currentScene = 'LoginScreen';
class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { phoneNumber: '', password: '', oneSignalId: '' };
  }

  componentDidMount() {
    // Dispatch the action to check network connection
    this.props.checkNetworkConnection((success, isConnected) => {
      console.log(success, isConnected);
    });
  }

  //  static propTypes = {
  //   isNetworkConnectivityAvailable: PropTypes.bool,
  //   isLoginLoading: PropTypes.bool,
  //   deviceInfoData: PropTypes.object,
  //   oneSignalId: PropTypes.string,
  //   loginOnSubmit: PropTypes.func,
  //   setProfileImage: PropTypes.func,
  //   setMobileNo: PropTypes.func,
  // };

  render() {
    return this._renderScreens();
  }

  _renderScreens = () => {
    if (this.props.isLoginLoading) {
      return this._screenLoading();
    } else {
      return this._renderLoginMainView();
    }
  };
  _renderLoginMainView = () => {
    // Dispatch the action when the component mounts
    this.props.checkNetworkConnection((success, isConnected) => {
      console.log(success, isConnected)
    });

    return (
      <SafeAreaView style={styles.mainContainer}>
        <KeyboardAwareScrollView>
          <View style={styles.bodyContainerTop}>
            <View style={styles.titleView}>
              <Text style={styles.title}>Login </Text>
            </View>
          </View>
          <View style={styles.bodyContainerBottom} />
          {this._renderLoginView()}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  };

  _renderLoginView = () => {
    return (
      <View style={styles.registerContainer}>
        <View style={styles.registerInnerView}>
          <View style={{ marginHorizontal: 10 }}>
            <Image
              resizeMode="contain"
              source={require('../images/Samyak_Splash_Logo.png')}
              style={styles.image}
            />
            <Text style={styles.placeholder}>Username</Text>
            <TextInput
              style={styles.inputs}
              placeholder="Enter the Mobile Number"
              placeholderTextColor={Constants.COLOR.FONT_HINT}
              value={this.state.phoneNumber}
              editable={true}
              keyboardType="number-pad"
              underlineColorAndroid="transparent"
              returnKeyType={'next'}
              onSubmitEditing={() => this.password.focus()}
              onChangeText={phoneNumber =>
                this.setState({
                  phoneNumber: phoneNumber.replace(/[^0-9]/g, ''),
                })
              }
            />
            <Text style={styles.placeholder}>Password</Text>
            <TextInput
              ref={input => (this.password = input)}
              style={styles.inputs}
              value={this.state.password}
              placeholder="Enter the password"
              placeholderTextColor={Constants.COLOR.FONT_HINT}
              keyboardType="default"
              secureTextEntry={true}
              underlineColorAndroid="transparent"
              autoCapitalize={'none'}
              returnKeyType={'done'}
              onChangeText={password => this.setState({ password })}
              onSubmitEditing={() => {
                this._validateInputs();
              }}
            />
            <TouchableOpacity
              style={styles.linkView}
              onPress={() => {
                this._forgotPassword();
              }}>
              <Text style={styles.link}>Forgot Password ?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this._validateInputs();
              }}>
              <Text style={styles.button}>Login</Text>
            </TouchableOpacity>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.version}>
                Version {DeviceInfo.getVersion()}
              </Text>
              <Text style={styles.version}>Powered by SUKRAA</Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                Actions.TermsAndCondition();
              }}>
              <Text style={styles.termsAndCondition}>Terms and Conditions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this._navigateRegistrationScreen();
              }}>
              <Text style={styles.linkRegister}>
                Don't have an account? Register here.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  _screenLoading = () => {
    return <LoadingScreen />;
  };

  _validateInputs() {
    // Actions.homeTabBar();
    if (this.state.phoneNumber.trim().length < 6) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.LOGIN_VALIDATION,
      );
    } else if (this.state.password.trim().length < 1) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.LOGIN_VALIDATION,
      );
    } else {
      this._submitClick();
    }
  }


  _submitClick() {
    if (this.props.isNetworkConnectivityAvailable) {
      const { phoneNumber, password } = this.state;
      let dicLoginInfo = {
        username: phoneNumber,
        password: password,
        Device_ID: this.props.deviceInfoData.device_id,
        Token_ID: this.props.oneSignalId,
        OS_Type: this.props.deviceInfoData.os_version,
        Device_Type: this.props.deviceInfoData.device_type,
        Model_Type: this.props.deviceInfoData.device_info,
        App_Version: this.props.deviceInfoData.app_version,
      };

      this.props.loginOnSubmit(dicLoginInfo, (isSuccess, response) => {
        if (isSuccess === true) {
          AsyncStorage.setItem(
            Constants.ASYNC.ASYNC_PHONE_NUMBER,
            this.state.phoneNumber,
          );
          AsyncStorage.setItem(
            Constants.ASYNC.ASYNC_PASSWORD,
            this.state.password,
          );
          AsyncStorage.setItem(
            Constants.ASYNC.ASYNC_USER_IMAGE_URL,
            response.User_Image_URL,
          );
          AsyncStorage.setItem(Constants.ASYNC.ASYNC_LOGIN_SUCCESS, 'true');
          if (
            response.Default_Firm_No != null &&
            response.Default_Firm_No.trim().length > 0
          ) {
            this.props.setFirmName(response.Branch_Name);
            this.props.setFirmNo(response.Default_Firm_No);
            this.props.setProfileImage(response.User_Image_URL);
            this.props.setMobileNo(this.state.phoneNumber);
            this.props.setBranchLatitude(parseFloat(response.Branch_Latitude));
            this.props.setBranchLongitude(
              parseFloat(response.Branch_Longitude),
            );
            AsyncStorage.setItem(
              Constants.ASYNC.ASYNC_DEFAULT_BRANCH_NAME,
              response.Branch_Name,
            );
            AsyncStorage.setItem(
              Constants.ASYNC.ASYNC_DEFAULT_FIRM_NO,
              response.Default_Firm_No,
            );
            AsyncStorage.setItem(
              Constants.ASYNC.ASYNC_BRANCH_LATITUDE,
              response.Branch_Latitude.toString(),
            );
            AsyncStorage.setItem(
              Constants.ASYNC.ASYNC_BRANCH_LONGITUDE,
              response.Branch_Longitude.toString(),
            );
            Actions.homeTabBar();
          } else {
            Actions.manageBranchScreenLogin();
          }
        } else {
          Actions.LoginScreen();
          Utility.showAlert(
            Constants.ALERT.TITLE.ERROR,
            Constants.VALIDATION_MSG.NO_INTERNET,
          );
        }
      });
    }
  }
  


  _forgotPassword() {
    if (Actions.currentScene === currentScene) {
      Actions.verificationScreen({
        isResetPassword: true,
      });
    }
  }
  _navigateRegistrationScreen() {
    if (Actions.currentScene === currentScene) {
      Actions.RegisterScreen();
    }
  }
}



const mapStateToProps = (state, props) => {
  const {
    loginState: { isLoginLoading },
    deviceState: { isNetworkConnectivityAvailable },
    configState: { deviceInfoData },
    splashState: { oneSignalId },
  } = state;
  return {
    deviceInfoData,
    oneSignalId,
    isLoginLoading,
    isNetworkConnectivityAvailable,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      checkNetworkConnection,
      loginOnSubmit,
      setFirmName,
      setFirmNo,
      setProfileImage,
      setMobileNo,
      setBranchLatitude,
      setBranchLongitude,
    },
    dispatch,
  );
};




export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginScreen);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  bodyContainerTop: {
    height: deviceHeight / 3,
    backgroundColor: Constants.COLOR.THEME_COLOR,
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
  },
  bodyContainerBottom: {
    backgroundColor: '#fefefe',
    height: 400,
  },
  registerContainer: {
    position: 'absolute',
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    top: 80,
    left: 20,
    right: 20,
    bottom: 20,
    borderRadius: 10,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1.0,
    elevation: 6,
  },
  registerInnerView: {
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 20,
  },
  titleView: {
    flexDirection: 'row',
    margin: 20,
  },
  title: {
    fontSize: Constants.FONT_SIZE.XXL,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    marginTop: 10,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 10,
    fontSize: Constants.FONT_SIZE.SM,
    color: '#404040',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  inputs: {
    height: 50,
    marginLeft: 0,
    marginRight: 0,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    overflow: 'hidden',
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    color: 'black',
    fontSize: Constants.FONT_SIZE.SM,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: Constants.FONT_SIZE.L,
    color: 'black',
    fontWeight: 'bold',
    backgroundColor: Constants.COLOR.THEME_COLOR,
    borderColor: Constants.COLOR.THEME_COLOR,
    width: '100%',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 13,
    paddingBottom: 13,
    borderRadius: 15,
    borderBottomWidth: 0,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  image: {
    marginTop: 0,
    marginBottom: 10,
    alignSelf: 'center',
    width: deviceHeight * (5 / 10),
    height: deviceHeight * (3 / 28),
  },
  linkView: {
    alignSelf: 'flex-end',
  },
  link: {
    fontSize: Constants.FONT_SIZE.S,
    color: Constants.COLOR.BLACK_COLOR,
    textAlign: 'center',
    marginVertical: 5,
  },
  linkRegister: {
    fontSize: Constants.FONT_SIZE.SM,
    color: Constants.COLOR.BLACK_COLOR,
    textAlign: 'center',
    marginVertical: 10,
  },
  version: {
    fontSize: Constants.FONT_SIZE.S,
    color: Constants.COLOR.BLACK_COLOR,
    textAlign: 'center',
    marginVertical: 5,
  },
  termsAndCondition: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: Constants.FONT_SIZE.S,
    color: 'blue',
    textAlign: 'left',
    textDecorationLine: 'underline',
    alignSelf: 'center',
  },
});




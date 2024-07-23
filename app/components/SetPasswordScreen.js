import React, {Component} from 'react';
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
// import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import LoadingScreen from './common/LoadingScreen';
import {submitPassword} from '../actions/SetPasswordAction';
import {Actions} from 'react-native-router-flux';
import {
  setFirmName,
  setFirmNo,
  setProfileImage,
  setMobileNo,
} from '../actions/ConfigAction';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';


const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

class SetPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {password: '', confirmPassword: '', otp: '', phoneNumber: ''};
  }

  async componentWillMount() {
    const value1 = await AsyncStorage.getItem(Constants.ASYNC.ASYNC_OTP);
    if (value1) {
      this.setState({otp: value1});
    }
    const value2 = await AsyncStorage.getItem(
      Constants.ASYNC.ASYNC_PHONE_NUMBER,
    );
    if (value2) {
      this.setState({phoneNumber: value2});
    }
  }

  _getData = async () => {
    try {
      const value1 = await AsyncStorage.getItem(Constants.ASYNC.ASYNC_OTP);
      const value2 = await AsyncStorage.getItem(
        Constants.ASYNC.ASYNC_PHONE_NUMBER,
      );
      if (value1 !== null) {
        this.setState({otp: value1});
      }
      if (value2 !== null) {
        this.setState({phoneNumber: value2});
      }
    } catch (e) {
      // error reading value
    }
  };

 //  static propTypes = {
  //   isSetPasswordLoading: PropTypes.bool,
  //   submitPassword: PropTypes.func,
  //   deviceInfoData: PropTypes.object,
  //   oneSignalId: PropTypes.string,
  // };

  render() {
    return this._renderScreens();
  }

  _renderScreens = () => {
    if (this.props.isSetPasswordLoading) {
      return this._screenLoading();
    } else {
      return this._renderSetPasswordMainView();
    }
  };

  _renderSetPasswordMainView = () => {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <KeyboardAwareScrollView>
          <View style={styles.bodyContainerTop}>
            <View style={styles.titleView}>
              <Text style={styles.title}>Set Password </Text>
            </View>
          </View>
          <View style={styles.bodyContainerBottom} />
          {this._renderSetPasswordView()}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  };

  _renderSetPasswordView = () => {
    return (
      <View style={styles.registerContainer}>
        <View style={styles.registerInnerView}>
          <View style={{marginHorizontal: 10}}>
            <Image
              resizeMode="contain"
              // source={require('../images/Samyak_Logo.png')}
              source={require('../images/Samyak_Splash_Logo.png')}

              style={styles.image}
            />
            <Text style={styles.placeholder}>Enter Password</Text>
            <TextInput
              style={styles.inputs}
              placeholder="Enter the password"
              placeholderTextColor={Constants.COLOR.FONT_HINT}
              value={this.state.password}
              editable={true}
              keyboardType="default"
              underlineColorAndroid="transparent"
              secureTextEntry={true}
              returnKeyType={'next'}
              onSubmitEditing={() => this.re_enter_password.focus()}
              onChangeText={password => this.setState({password})}
            />
            <Text style={styles.placeholder}>Confirm Password</Text>
            <TextInput
              ref={input => (this.re_enter_password = input)}
              style={styles.inputs}
              placeholder="Re-enter the password"
              placeholderTextColor={Constants.COLOR.FONT_HINT}
              keyboardType="default"
              secureTextEntry={true}
              underlineColorAndroid="transparent"
              value={this.state.confirmPassword}
              autoCapitalize={'none'}
              returnKeyType={'done'}
              onChangeText={confirmPassword => this.setState({confirmPassword})}
              onSubmitEditing={() => {
                this._validateInputs();
              }}
            />
            <Text style={styles.link}>
              Password should be 8 or more characters with alpha numeric
            </Text>
            <TouchableOpacity
              onPress={() => {
                this._validateInputs();
              }}>
              <Text style={styles.button}>Confirm</Text>
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
    if (!this._isValidPassword(this.state.confirmPassword)) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.VALID_PASSWORD,
      );
    } else if (
      this.state.password.trim() !== this.state.confirmPassword.trim()
    ) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.MATCH_PASSWORD,
      );
    } else {
      this._submitClick();
    }
  }

  _submitClick() {
    this.props.submitPassword(
      this.state.phoneNumber,
      this.state.otp,
      this.state.password,
      this.props.deviceInfoData.device_id,
      this.props.oneSignalId,
      this.props.deviceInfoData.os_version,
      this.props.deviceInfoData.device_type,
      this.props.deviceInfoData.device_info,
      this.props.deviceInfoData.app_version,
      (isSuccess, response) => {
        if (isSuccess) {
          AsyncStorage.setItem(Constants.ASYNC.ASYNC_LOGIN_SUCCESS, 'true');
          AsyncStorage.setItem(
            Constants.ASYNC.ASYNC_PHONE_NUMBER,
            this.state.phoneNumber,
          );
          AsyncStorage.setItem(
            Constants.ASYNC.ASYNC_PASSWORD,
            this.state.password,
          );
          this.props.setMobileNo(this.state.phoneNumber);
          this.props.setProfileImage(response.User_Image_URL);
          AsyncStorage.setItem(
            Constants.ASYNC.ASYNC_USER_IMAGE_URL,
            response.User_Image_URL,
          );

          if (
            response.Default_Firm_No != null &&
            response.Default_Firm_No.trim().length > 0
          ) {
            this.props.setFirmName(response.Branch_Name);
            this.props.setFirmNo(response.Default_Firm_No);

            AsyncStorage.setItem(
              Constants.ASYNC.ASYNC_DEFAULT_BRANCH_NAME,
              response.Branch_Name,
            );
            AsyncStorage.setItem(
              Constants.ASYNC.ASYNC_DEFAULT_FIRM_NO,
              response.Default_Firm_No,
            );

            Actions.homeTabBar();
          } else {
            Actions.manageBranchScreenLogin({isFromSettings: false});
          }
        }
      },
    );
  }

  /**
   * Password validation function
   * @returns {Boolean} returns true if the param meets below conditions, otherwise false
   * Password must atleast have minimum 8 chars, 1 number
   */
  _isValidPassword = password => {
    return /^.*(?=.{8,})(?=.*\d)((?=.*[a-z]){1}).*$/.test(password);
  };
}

const mapStateToProps = (state, props) => {
  const {
    setPasswordState: {isSetPasswordLoading},
    configState: {deviceInfoData},
    splashState: {oneSignalId},
  } = state;

  return {
    deviceInfoData,
    oneSignalId,
    isSetPasswordLoading,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      submitPassword,
      setFirmName,
      setFirmNo,
      setProfileImage,
      setMobileNo,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SetPasswordScreen);

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
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 1.0,
    elevation: 6,
  },
  registerInnerView: {
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 40,
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
  backImage: {
    width: deviceHeight / 35,
    height: deviceHeight / 35,
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
  link: {
    fontSize: Constants.FONT_SIZE.S,
    color: Constants.COLOR.BLACK_COLOR,
    textAlign: 'center',
    marginVertical: 15,
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
    marginBottom: 20,
    alignSelf: 'center',
    width: deviceHeight * (5 / 10),
    height: deviceHeight * (3 / 28),
  },
});

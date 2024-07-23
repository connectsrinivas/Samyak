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
  BackHandler,
  Linking
} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import Constants, {ACTIONS} from '../util/Constants';
import Utility from '../util/Utility';
// import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {verifyOTPSubmit, verifyOTPResend} from '../actions/VerificationAction';
import LoadingScreen from './common/LoadingScreen';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Actions, ActionConst} from 'react-native-router-flux';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

class VerificationScreen extends Component {
 //  static propTypes = {
  //   isVerificationLoading: PropTypes.bool,
  //   verifyOTPSubmit: PropTypes.func,
  //   verifyOTPResend: PropTypes.func,
  // };

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      otp: '',
      isResetPassword: this.props.isResetPassword,
      isOTPGenerated: this.props.isResetPassword === true ? false : true,
    };
  }

  async componentDidMount() {
    if (this.state.isResetPassword) {
    } else {
      //Mobile Number
      const value1 = await AsyncStorage.getItem(
        Constants.ASYNC.ASYNC_PHONE_NUMBER,
      );
      if (value1) {
        this.setState({phoneNumber: value1});
        this._resendOTP({isResent: false});
      }
    }
  }

  render() {
    return this._renderScreens();
  }

  _renderScreens = () => {
    if (this.props.isVerificationLoading) {
      return this._screenLoading();
    } else {
      if (Platform.OS === 'ios') {
        return this._renderVerificationMainViewIos();
      } else {
        return this._renderVerificationMainViewAndroid();
      }
    }
  };
  _swipeEnableIos = () => {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <KeyboardAwareScrollView>
          <View style={styles.bodyContainerTop}>
            <View style={styles.titleView}>
              {this.state.isOTPGenerated ? null : (
                <TouchableOpacity
                  style={{alignSelf: 'center'}}
                  onPress={() => {
                    Actions.pop();
                  }}>
                  <Image
                    resizeMode="contain"
                    source={require('../images/backArrowBlack.png')}
                    style={styles.backImage}
                  />
                </TouchableOpacity>
              )}
              {this._setTitle()}
            </View>
          </View>
          <View style={styles.bodyContainerBottom} />
          {this._renderVerificationView()}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  };
  onSwipe = directions => {
    if (directions === 'SWIPE_RIGHT') {
      Actions.pop();
    }
  };
  _renderVerificationMainViewIos = () => {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    if (this.state.isOTPGenerated === false) {
      return (
        <GestureRecognizer
          onSwipe={direction => this.onSwipe(direction)}
          config={config}
          style={{flex: 1}}>
          {this._swipeEnableIos()}
        </GestureRecognizer>
      );
    } else {
      return this._swipeEnableIos();
    }
  };
  _renderVerificationMainViewAndroid = () => {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <KeyboardAwareScrollView>
          <View style={styles.bodyContainerTop}>
            <View style={styles.titleView}>
              {this.state.isOTPGenerated ? null : (
                <TouchableOpacity
                  style={{alignSelf: 'center'}}
                  onPress={() => {
                    Actions.pop();
                  }}>
                  <Image
                    resizeMode="contain"
                    source={require('../images/backArrowBlack.png')}
                    style={styles.backImage}
                  />
                </TouchableOpacity>
              )}
              {this._setTitle()}
            </View>
          </View>
          <View style={styles.bodyContainerBottom} />
          {this._renderVerificationView()}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  };

  _renderVerificationView = () => {
    return (
      <KeyboardAwareScrollView style={styles.registerContainer}>
        <View style={styles.registerInnerView}>
          <View style={{marginHorizontal: 10}}>
            <Image
              resizeMode="contain"
              // source={require('../images/Samyak_Logo.png')}
              source={require('../images/Samyak_Splash_Logo.png')}
              style={styles.image}
            />
            <Text style={styles.placeholder}>Phone Number</Text>
            <TextInput
              style={styles.inputs}
              placeholder="Enter the Phone Number"
              placeholderTextColor={Constants.COLOR.FONT_HINT}
              value={this.state.phoneNumber}
              editable={this.state.isResetPassword}
              keyboardType="number-pad"
              underlineColorAndroid="transparent"
              onChangeText={phoneNumber => this.setState({phoneNumber})}
              onSubmitEditing={() => {
                this._validateInputs();
              }}
            />
            {this._renderOtpView()}
            {this._renderButtonView()}
            {this._renderLinkView()}
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  };
  _setTitle = () => {
    if (this.state.isResetPassword) {
      return <Text style={styles.title}>Reset Password</Text>;
    } else {
      return <Text style={styles.title}>Verification</Text>;
    }
  };

  _renderOtpView = () => {
    if (this.state.isOTPGenerated) {
      {
        Platform.OS === 'android'
          ? BackHandler.addEventListener(
              'hardwareBackPress',
              this.onHandleBackButton,
            )
          : null;
      }
      return (
        <View>
          <Text style={styles.placeholder}>Enter OTP</Text>
          <TextInput
            style={styles.inputs}
            placeholder="Enter OTP"
            keyboardType="numeric"
            autoCapitalize={'none'}
            returnKeyType={'done'}
            maxLength={8}
            underlineColorAndroid="transparent"
            onChangeText={otp => this.setState({otp})}
            onSubmitEditing={() => {
              this._validateInputs();
            }}
          />
          <TouchableOpacity
            style={styles.linkView}
            onPress={() => {
              this._resendOTP({isResent: true});
            }}>
            <Text style={styles.link}>Resend OTP</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  };
  onHandleBackButton = () => {
    return true;
  };
  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.onHandleBackButton,
    );
  }

  _renderButtonView = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this._validateInputs();
        }}>
        <Text style={styles.button}>
          {/* {this.state.isResetPassword === true ? (<Text>Reset</Text>) : (<Text>Verify</Text>)} */}
          {this.state.isResetPassword === true ? (
            this.state.isOTPGenerated === true ? (
              <Text>Reset</Text>
            ) : (
              <Text>Get OTP</Text>
            )
          ) : (
            <Text>Verify</Text>
          )}
        </Text>
      </TouchableOpacity>
    );
  };

  _renderLinkView = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          Actions.popTo('LoginScreen');
        }}>
        <Text style={styles.linkRegister}>Back to Login</Text>
      </TouchableOpacity>
    );
  };

  _screenLoading = () => {
    return <LoadingScreen />;
  };

  _validateInputs() {
    if (this.state.phoneNumber.trim().length < 10) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_MOBILE_NO,
      );
    } else if (
      this.state.isOTPGenerated === true
        ? this.state.otp.trim().length < 3
        : false
    ) {
      // } else if (this.state.otp.trim().length < 3 || !this.state.isOTPGenerated) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_OTP,
      );
    } else {
      this.state.isOTPGenerated === true
        ? this._submitButtonClick()
        : this._resendOTP({isResent: false});
    }
  }

  _submitButtonClick() {
    this.props.verifyOTPSubmit(this.state.phoneNumber, this.state.otp);
  }
  _resendOTP(isResent) {
    this.props.verifyOTPResend(
      this.state.phoneNumber,
      isResent,
      (isSuccess, message) => {
        if (isSuccess === true) {
          this.setState({isOTPGenerated: true});
          let smsLink = AsyncStorage.configUri.sm_gw_li
            .replace('XXXMOBILE_NOXXX', this.state.phoneNumber)
            .replace('XXXMESSAGEXXX', message);

          fetch(smsLink, {
            method: 'GET',
          })
            .then(response => response.json())
            .then(responseJson => {
              console.log(smsLink);
              console.log(responseJson);
            })
            .catch(error => {
              console.error(error);
            });
        }
      },
    );
  }
}

const mapStateToProps = (state, props) => {
  const {
    verificationState: {isVerificationLoading},
  } = state;

  return {
    isVerificationLoading,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      verifyOTPSubmit,
      verifyOTPResend,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VerificationScreen);

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
    marginBottom: 20,
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
    marginVertical: 10,
  },
  backImage: {
    width: deviceHeight / 35,
    height: deviceHeight / 35,
  },
  linkRegister: {
    fontSize: Constants.FONT_SIZE.SM,
    color: Constants.COLOR.BLACK_COLOR,
    textAlign: 'center',
    marginVertical: 10,
  },
});

import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
// import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LoadingScreen from './common/LoadingScreen';
import { registerOnSubmit } from '../actions/RegisterAction';
import DatePicker from 'react-native-datepicker';
import { Actions } from 'react-native-router-flux';
import CheckBox from 'react-native-check-box';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

const deviceWidth = Dimensions.get('window').width;

class RegisterScreen extends Component {
  //  static propTypes = {
  //   isRegistrationLoading:  PropTypes.bool,
  //   registerOnSubmit: PropTypes.func,
  //   deviceInfoData: PropTypes.object,
  //   oneSignalId: PropTypes.string,
  // };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      dob: '',
      email: '',
      phoneNumber: '',
      referralCode: '',
      gender: ' ',
      isShowCalendarView: false,
      isTermsChecked: false,
    };
  }

  render() {
    return this._renderScreen();
  }
  _renderScreen = () => {
    if (this.props.isRegistrationLoading) {
      return this._screenLoading();
    } else {
      return this._renderRegisterMainView();
    }
  };

  _screenLoading = () => {
    return <LoadingScreen />;
  };

  _registerButtonClick = () => {
    this.props.registerOnSubmit(
      this.state.name,
      moment(this.state.dob, 'DD/MM/YYYY').format('YYYY/MM/DD'),
      this.state.email,
      this.state.phoneNumber,
      this.state.referralCode,
      this.state.gender,
      this.props.deviceInfoData.device_id,
      this.props.oneSignalId,
      this.props.deviceInfoData.os_version,
      this.props.deviceInfoData.device_type,
      this.props.deviceInfoData.device_info,
      this.props.deviceInfoData.app_version,
    );
  };

  _renderRegisterMainView = () => {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <KeyboardAwareScrollView>
          <View style={styles.bodyContainerTop}>
            <View style={styles.titleView}>
              <TouchableOpacity
                style={{ alignSelf: 'center' }}
                onPress={() => {
                  Actions.pop();
                }}>
                <Image
                  resizeMode="contain"
                  source={require('../images/backArrowBlack.png')}
                  style={styles.backImage}
                />
              </TouchableOpacity>
              <Text style={styles.title}>Registration </Text>
            </View>
          </View>
          <View style={styles.bodyContainerBottom} />
          {this._renderRegisterView()}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  };

  _renderRegisterView = () => {
    return (
      <View style={styles.registerContainer}>
        <View style={styles.registerInnerView}>
          <View style={{ marginHorizontal: 10 }}>
            <Image
              resizeMode="contain"
              source={require('../images/Samyak_Splash_Logo.png')}
              style={styles.image}
            />
            <Text style={styles.placeholder}>Full Name</Text>
            <TextInput
              style={styles.inputs}
              placeholder="Enter the Full Name"
              placeholderTextColor={Constants.COLOR.FONT_HINT}
              value={this.state.name}
              underlineColorAndroid="transparent"
              returnKeyType={'next'}
              onChangeText={name => this.setState({ name })}
            />
            <Text style={styles.placeholder}>DOB</Text>
            <DatePicker
              style={styles.dateInputs}
              date={this.state.dob}
              mode={'date'}
              showIcon={false}
              maxDate={new Date()}
              placeholder={'Enter the Date of Birth'}
              placeholderTextColor={Constants.COLOR.FONT_HINT}
              format={'DD/MM/YYYY'}
              confirmBtnText={'Done'}
              cancelBtnText={'Cancel'}
              onDateChange={dob => {
                this.setState({ dob });
              }}
              customStyles={{
                placeholderText: {
                  fontSize: Constants.FONT_SIZE.SM,
                  color: Constants.COLOR.FONT_HINT,
                },
                dateText: {
                  fontSize: Constants.FONT_SIZE.SM,
                },
                dateInput: {
                  paddingVertical: deviceHeight / 133.4,
                  borderWidth: 0,
                  paddingHorizontal: 15,
                  alignItems: 'flex-start',
                },
              }}
            />
            <Text style={styles.placeholder}>Email (optional)</Text>
            <TextInput
              ref={input => (this.email = input)}
              style={styles.inputs}
              placeholder="Enter the Email Address"
              placeholderTextColor={Constants.COLOR.FONT_HINT}
              value={this.state.email}
              autoCapitalize={'none'}
              underlineColorAndroid="transparent"
              returnKeyType={'next'}
              onSubmitEditing={() => this.number.focus()}
              onChangeText={email => this.setState({ email })}
            />
            <Text style={styles.placeholder}>Phone Number/User Name</Text>
            <TextInput
              ref={input => (this.number = input)}
              style={styles.inputs}
              placeholder="Enter the Phone Number"
              placeholderTextColor={Constants.COLOR.FONT_HINT}
              value={this.state.phoneNumber}
              editable={true}
              keyboardType="number-pad"
              underlineColorAndroid="transparent"
              returnKeyType={'next'}
              onSubmitEditing={() => this.referral.focus()}
              onChangeText={phoneNumber =>
                this.setState({
                  phoneNumber: phoneNumber.replace(/[^0-9]/g, ''),
                })
              }
            />
            <Text style={styles.placeholder}>Referral Code (optional)</Text>
            <TextInput
              ref={input => (this.referral = input)}
              style={styles.inputs}
              placeholder="Enter the Referral Code"
              placeholderTextColor={Constants.COLOR.FONT_HINT}
              value={this.state.referralCode}
              keyboardType="default"
              autoCapitalize={'none'}
              returnKeyType={'done'}
              underlineColorAndroid="transparent"
              onChangeText={referralCode => this.setState({ referralCode })}
              onSubmitEditing={() => {
                this._validateInputs();
              }}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CheckBox
              style={{ padding: 10 }}
              onClick={() => {
                this.setState({
                  isTermsChecked: !this.state.isTermsChecked,
                });
              }}
              isChecked={this.state.isTermsChecked}
            />
            <TouchableOpacity
              onPress={() => {
                Actions.TermsAndCondition();
              }}>
              <Text style={styles.termsAndCondition}>
                I Agree to the Terms and Condition
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              this._validateInputs();
            }}>
            <Text style={styles.button}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginRight: 10,
          }}>
          <Text
            style={{
              fontSize: Constants.FONT_SIZE.S,
              color: Constants.COLOR.BLACK_COLOR,
              textAlign: 'center',
              marginVertical: 5,
            }}>
            {`Version: ${DeviceInfo.getVersion()}`}
            {/* (${DeviceInfo.getBuildNumber()}) */}
          </Text>
        </View>
      </View>
    );
  };

  _validateInputs = () => {
    if (this.state.name.trim().length < 1) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_NAME,
      );
    } else if (this.state.dob.trim().length < 1) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_DOB,
      );
    } else if (this.state.phoneNumber.trim().length < 6) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_MOBILE_NO,
      );
    } else if (this.state.phoneNumber.trim().length > 15) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_MOBILE_NO,
      );
    } else if (this._validateEmail(this.state.email) === false) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.INVALID_EMAIL,
      );
    } else if (!this.state.isTermsChecked) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.CHECK_TERMS_CONDITION,
      );
    } else {
      this._registerButtonClick();
    }
  };

  _validateEmail = text => {
    if (text.trim().length > 0) {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(text) === false) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };
}

const mapStateToProps = (state, props) => {
  const {
    registrationState: { isRegistrationLoading },
    configState: { deviceInfoData },
    splashState: { oneSignalId },
  } = state;

  return {
    deviceInfoData,
    oneSignalId,
    isRegistrationLoading,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      registerOnSubmit,
    },

    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegisterScreen);

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
    height: 700,
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
  termsAndCondition: {
    marginTop: 10,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 10,
    fontSize: Constants.FONT_SIZE.SM,
    color: 'blue',
    textAlign: 'left',
    textDecorationLine: 'underline',
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
  dateInputs: {
    height: 50,
    paddingVertical: 5,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    overflow: 'hidden',
    borderBottomWidth: 1,
    marginBottom: 20,
    width: '100%',
  },
  link: {
    fontSize: Constants.FONT_SIZE.M,
    color: 'white',
    textAlign: 'right',
    marginTop: 10,
    marginBottom: 15,
    marginLeft: 0,
    marginRight: 0,
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
  calenderContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calenderSubContainer: {
    width: deviceWidth / 1.2,
    height: deviceWidth / 1.3,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    borderColor: Constants.COLOR.WHITE_COLOR,
    elevation: 2,
  },
});

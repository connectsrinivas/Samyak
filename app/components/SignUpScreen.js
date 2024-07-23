/*************************************************
 * SukraasLIS
 * @exports
 * @class SignUpScreen.js
 * @extends Component
 * Created by Jagadish Sellamuthu on 12/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
// import PropTypes from 'prop-types';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import Spinner from 'react-native-spinkit';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import CardView from 'react-native-cardview';
import {Actions} from 'react-native-router-flux';

import {
  signupButtonSubmit,
  signupWithDobButtonSubmit,
  checkUsernameAvailable,
  resetToInitial,
} from '../actions/SignupAction';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
let timerID;

class SignUpScreen extends Component {
 //  static propTypes = {
  //   isSingupLoading: PropTypes.bool,
  //   needDOB: PropTypes.bool,
  //   checkingStatus: PropTypes.number,

  //   signupButtonSubmit: PropTypes.func,
  //   signupWithDobButtonSubmit: PropTypes.func,
  //   checkUsernameAvailable: PropTypes.func,
  //   resetToInitial: PropTypes.func,
  // };

  constructor(props) {
    super(props);
    timerID = undefined;
    this.state = {
      firstname: 'DONALD',
      lastname: 'MURPHREE',
      username: '',
      empID: '164662',
      password: '',
      passwordSecure: true,
      confirmPassword: '',
      confirmPasswordSecure: true,
      mobile: '+919500088639',
      workEmail: '',
      dob: '1954-07-28',
    };
  }

  componentDidMount() {
    this.props.resetToInitial();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  _validateInputs() {
    if (this.state.firstname.trim() === '') {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_FIRSTNAME,
      );
    } else if (this.state.lastname.trim() === '') {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_LASTNAME,
      );
    } else if (this.state.username.trim() === '') {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_USERNAME,
      );
    } else if (this.props.checkingStatus !== 3) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_USERNAME,
      );
    } else if (this.state.empID.trim() === '') {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_EMP_ID,
      );
    } else if (this.state.password.trim().length < 8) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_PASSWORD,
      );
    } else if (
      this.state.password.trim() !== this.state.confirmPassword.trim()
    ) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.VALID_PASSWORD,
      );
    } else if (this.state.mobile.trim().length < 10) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_MOBILE_NO,
      );
    } else if (
      this.state.workEmail.trim() !== '' &&
      !Utility.validateEmail(this.state.workEmail.trim())
    ) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.INVALID_EMAIL,
      );
    } else if (this.props.needDOB && this.state.dob.trim() === '') {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_DOB,
      );
    } else {
      if (!this.props.needDOB) {
        this.props.signupButtonSubmit(
          this.state.firstname,
          this.state.lastname,
          this.state.username,
          this.state.empID,
          this.state.password,
          this.state.mobile,
          this.state.workEmail,
        );
      } else {
        this.props.signupWithDobButtonSubmit(
          this.state.firstname,
          this.state.lastname,
          this.state.username,
          this.state.empID,
          this.state.password,
          this.state.mobile,
          this.state.workEmail,
          this.state.dob,
        );
      }
    }
  }

  _renderSignUpButton = () => {
    const {isSingupLoading} = this.props;
    if (isSingupLoading) {
      return (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Spinner
            isVisible={isSingupLoading}
            size={20}
            type={'Wave'}
            color={'white'}
          />
        </View>
      );
    } else {
      return (
        <Text style={{color: 'white', fontSize: Constants.FONT_SIZE.L}}>
          Submit
        </Text>
      );
    }
  };

  _renderDob = () => {
    const {needDOB} = this.props;
    if (needDOB) {
      return (
        <View>
          <View
            style={{
              backgroundColor: Constants.COLOR.FONT_HINT,
              height: 1,
              marginBottom: deviceHeight * (1 / 20),
            }}
          />

          <TextInput
            ref={input => (this.dobInputText = input)}
            style={styles.textinput}
            underlineColorAndroid={'transparent'}
            placeholder={'DOB'}
            value={this.state.dob}
            onChangeText={dob => {
              this.setState({dob});
            }}
            placeholderTextColor={Constants.COLOR.FONT_HINT}
            autoCapitalize={'none'}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              this._validateInputs();
            }}
          />
        </View>
      );
    } else {
      return null;
    }
  };

  renderCheckingStatus() {
    if (this.props.checkingStatus === 1) {
      return (
        <ActivityIndicator size="small" color={Constants.COLOR.THEME_COLOR_2} />
      );
    } else if (this.props.checkingStatus === 2) {
      return (
        <Image
          style={{height: deviceHeight / 40, width: deviceHeight / 40}}
          source={require('../images/RedCross.png')}
        />
      );
    } else if (this.props.checkingStatus === 3) {
      return (
        <Image
          style={{height: deviceHeight / 40, width: deviceHeight / 40}}
          source={require('../images/GreenTick.png')}
        />
      );
    } else {
      return null;
    }
  }

  /**
   * Renders Splash Screen Design
   */
  render() {
    return (
      <View
        style={styles.container}
        pointerEvents={this.props.isSingupLoading ? 'none' : 'auto'}>
        {
          //toolbar starts
        }
        <View style={styles.toolbar}>
          <TouchableOpacity
            onPress={() => {
              Actions.pop();
            }}>
            <Image
              resizeMode="contain"
              source={require('../images/Back.png')}
              style={styles.backImage}
            />
          </TouchableOpacity>
          <Text style={styles.toolbarTitleText} numberOfLines={1}>
            Registration
          </Text>

          <View style={styles.toolbarRightImage} />
        </View>
        {
          //toolbar ends
        }

        <KeyboardAwareScrollView>
          <View style={{padding: deviceHeight * (1 / 35)}}>
            <CardView cardElevation={4} cardMaxElevation={4} cornerRadius={10}>
              <View
                style={{
                  padding: deviceHeight * (1 / 40),
                  backgroundColor: '#ffffff',
                }}>
                <TextInput
                  style={styles.textinput}
                  underlineColorAndroid={'transparent'}
                  placeholder={'First Name'}
                  value={this.state.firstname}
                  onChangeText={firstname => {
                    this.setState({firstname});
                  }}
                  placeholderTextColor={Constants.COLOR.FONT_HINT}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  onSubmitEditing={() => this.lastnameInputText.focus()}
                />

                <View
                  style={{
                    backgroundColor: Constants.COLOR.FONT_HINT,
                    height: 1,
                    marginBottom: deviceHeight * (1 / 20),
                  }}
                />

                <TextInput
                  ref={input => (this.usernameInputText = input)}
                  style={styles.textinput}
                  underlineColorAndroid={'transparent'}
                  placeholder={'Last Name'}
                  value={this.state.lastname}
                  onChangeText={lastname => {
                    this.setState({lastname});
                  }}
                  placeholderTextColor={Constants.COLOR.FONT_HINT}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  onSubmitEditing={() => this.usernameInputText.focus()}
                />

                <View
                  style={{
                    backgroundColor: Constants.COLOR.FONT_HINT,
                    height: 1,
                    marginBottom: deviceHeight * (1 / 20),
                  }}
                />

                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    ref={input => (this.usernameInputText = input)}
                    style={[styles.textinput, {flex: 1}]}
                    underlineColorAndroid={'transparent'}
                    placeholder={'User Name'}
                    value={this.state.username}
                    onChangeText={username => {
                      this.setState({username});
                      if (timerID) {
                        clearTimeout(timerID);
                        timerID = undefined;
                      }
                      if (username.trim().length > 3) {
                        timerID = setTimeout(() => {
                          this.props.checkUsernameAvailable(
                            this.state.username.trim(),
                          );
                        }, 3000);
                      }
                    }}
                    placeholderTextColor={Constants.COLOR.FONT_HINT}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    onSubmitEditing={() => this.empIDInputText.focus()}
                  />

                  {this.renderCheckingStatus()}
                </View>

                <View
                  style={{
                    backgroundColor: Constants.COLOR.FONT_HINT,
                    height: 1,
                    marginBottom: deviceHeight * (1 / 20),
                  }}
                />

                <TextInput
                  ref={input => (this.empIDInputText = input)}
                  style={styles.textinput}
                  underlineColorAndroid={'transparent'}
                  placeholder={'Employee ID'}
                  value={this.state.empID}
                  onChangeText={empID => {
                    this.setState({empID});
                  }}
                  placeholderTextColor={Constants.COLOR.FONT_HINT}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  onSubmitEditing={() => this.passwordInputText.focus()}
                />

                <View
                  style={{
                    backgroundColor: Constants.COLOR.FONT_HINT,
                    height: 1,
                    marginBottom: deviceHeight * (1 / 20),
                  }}
                />

                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    ref={input => (this.passwordInputText = input)}
                    style={[styles.textinput, {flex: 1}]}
                    underlineColorAndroid={'transparent'}
                    placeholder={'Password'}
                    value={this.state.password}
                    onChangeText={password => {
                      this.setState({password});
                    }}
                    placeholderTextColor={Constants.COLOR.FONT_HINT}
                    autoCapitalize={'none'}
                    secureTextEntry={this.state.passwordSecure}
                    returnKeyType={'next'}
                    onSubmitEditing={() =>
                      this.confirmPasswordInputText.focus()
                    }
                  />

                  <TouchableOpacity
                    style={{paddingVertical: deviceHeight / 66.7}}
                    onPress={() => {
                      this.setState({
                        passwordSecure: this.state.passwordSecure
                          ? false
                          : true,
                      });
                    }}>
                    <Image
                      source={
                        this.state.passwordSecure
                          ? require('../images/EyeHidden.png')
                          : require('../images/EyeView.png')
                      }
                      resizeMode={'contain'}
                      style={{
                        width: deviceHeight / 26.68,
                        height: deviceHeight / 26.68,
                        marginRight: deviceWidth / 75,
                      }}
                    />
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    backgroundColor: Constants.COLOR.FONT_HINT,
                    height: 1,
                  }}
                />

                <Text
                  style={{
                    color: 'red',
                    fontSize: Constants.FONT_SIZE.S,
                    marginTop: deviceHeight * (1 / 60),
                    marginBottom: deviceHeight * (1 / 40),
                  }}>
                  Use atleast 8 characters
                </Text>

                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    ref={input => (this.confirmPasswordInputText = input)}
                    style={[styles.textinput, {flex: 1}]}
                    underlineColorAndroid={'transparent'}
                    placeholder={'Confirm Password'}
                    value={this.state.confirmPassword}
                    onChangeText={confirmPassword => {
                      this.setState({confirmPassword});
                    }}
                    placeholderTextColor={Constants.COLOR.FONT_HINT}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    secureTextEntry={this.state.confirmPasswordSecure}
                    onSubmitEditing={() => this.mobileInputText.focus()}
                  />

                  <TouchableOpacity
                    style={{paddingVertical: deviceHeight / 66.7}}
                    onPress={() => {
                      this.setState({
                        confirmPasswordSecure: this.state.confirmPasswordSecure
                          ? false
                          : true,
                      });
                    }}>
                    <Image
                      source={
                        this.state.confirmPasswordSecure
                          ? require('../images/EyeHidden.png')
                          : require('../images/EyeView.png')
                      }
                      resizeMode={'contain'}
                      style={{
                        width: deviceHeight / 26.68,
                        height: deviceHeight / 26.68,
                        marginRight: deviceWidth / 75,
                      }}
                    />
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    backgroundColor: Constants.COLOR.FONT_HINT,
                    height: 1,
                    marginBottom: deviceHeight * (1 / 20),
                  }}
                />

                <TextInput
                  ref={input => (this.mobileInputText = input)}
                  style={styles.textinput}
                  underlineColorAndroid={'transparent'}
                  placeholder={'Cell Phone #'}
                  value={this.state.mobile}
                  onChangeText={mobile => {
                    this.setState({mobile});
                  }}
                  placeholderTextColor={Constants.COLOR.FONT_HINT}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  onSubmitEditing={() => this.workEmailInputText.focus()}
                />

                <View
                  style={{
                    backgroundColor: Constants.COLOR.FONT_HINT,
                    height: 1,
                    marginBottom: deviceHeight * (1 / 20),
                  }}
                />

                <TextInput
                  ref={input => (this.workEmailInputText = input)}
                  style={styles.textinput}
                  underlineColorAndroid={'transparent'}
                  placeholder={'Work Email (Optional)'}
                  value={this.state.workEmail}
                  onChangeText={workEmail => {
                    this.setState({workEmail});
                  }}
                  placeholderTextColor={Constants.COLOR.FONT_HINT}
                  autoCapitalize={'none'}
                  returnKeyType={this.props.needDOB ? 'next' : 'done'}
                  onSubmitEditing={() => {
                    if (this.props.needDOB) {
                      this.dobInputText.focus();
                    } else {
                      this._validateInputs();
                    }
                  }}
                />

                {this._renderDob()}

                <View
                  style={{
                    backgroundColor: Constants.COLOR.FONT_HINT,
                    height: 1,
                    marginBottom: deviceHeight * (1 / 60),
                  }}
                />

                {/* <Text style={{color: '#FF5B5C', fontSize: deviceHeight * (1/50)}}>
                   * Required Field
                 </Text> */}
              </View>
            </CardView>
          </View>
        </KeyboardAwareScrollView>

        <TouchableOpacity
          style={{
            backgroundColor: Constants.COLOR.THEME_COLOR_2,
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            this._validateInputs();
          }}>
          {this._renderSignUpButton()}
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state, props) => {
  //props can be called as ownProps
  const {
    signupState: {isSingupLoading, needDOB, checkingStatus},
  } = state;

  return {
    isSingupLoading,
    needDOB,
    checkingStatus,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      signupButtonSubmit,
      signupWithDobButtonSubmit,
      checkUsernameAvailable,
      resetToInitial,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignUpScreen);

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.COLOR.SCREEN_BG,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: deviceHeight / 100,
  },
  toolbarTitleText: {
    flex: 8,
    fontSize: Constants.FONT_SIZE.XL,
    color: Constants.COLOR.THEME_COLOR,
    padding: 10,
  },
  backImage: {
    height: deviceHeight / 35,
    width: deviceHeight / 35,
    marginLeft: deviceHeight / 35,
  },
  toolbarRightImage: {
    height: deviceHeight / 35,
    width: deviceHeight / 35,
    marginRight: 10,
  },
  textinput: {
    flex: 1,
    color: Constants.COLOR.THEME_COLOR_2,
    padding: 5,
    fontSize: Constants.FONT_SIZE.L,
  },
});

/*************************************************
 * SukraasLIS
 * @exports
 * @class SignInScreen.js
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
} from 'react-native';
// import PropTypes from 'prop-types';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import Spinner from 'react-native-spinkit';
import DeviceInfo from 'react-native-device-info';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Actions} from 'react-native-router-flux';
import {loginButtonSubmit} from '../actions/SignInAction';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class SignInScreen extends Component {
 //  static propTypes = {
  //   isPageLoading: PropTypes.bool,
  //   isLoginLoading: PropTypes.bool,

  //   loginButtonSubmit: PropTypes.func,
  // };

  constructor(props) {
    super(props);

    this.state = {
      username: 'test',
      password: 'testtest',
      versionNumber: '',
      buildNumber: '',
    };
  }

  componentDidMount() {
    this.setState({buildNumber: DeviceInfo.getBuildNumber()});
    this.setState({versionNumber: DeviceInfo.getVersion()});
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  _validateInputs() {
    if (this.state.username.trim().length < 4) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_USERNAME,
      );
    } else if (this.state.password.trim().length < 8) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_PASSWORD,
      );
    } else {
      this.props.loginButtonSubmit(
        this.state.username.trim(),
        this.state.password.trim(),
      );
    }
  }

  _renderLoginButton() {
    if (this.props.isLoginLoading) {
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Spinner
            isVisible={this.props.isLoginLoading}
            size={20}
            type={'Wave'}
            color={'white'}
          />
        </View>
      );
    } else {
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.loginText}>Login</Text>

          <Image
            style={{
              width: deviceHeight / 35,
              height: deviceHeight / 35,
              marginLeft: deviceHeight / 60,
            }}
            resizeMode="contain"
            source={require('../images/signin.png')}
          />
        </View>
      );
    }
  }

  /**
   * Renders activity indicator when version api is being invoked
   */
  _renderScreen = () => {
    const {isPageLoading} = this.props;

    if (isPageLoading) {
      return (
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              resizeMode="contain"
              source={require('../images/BigLogo.png')}
              style={styles.image}
            />
          </View>

          <Spinner
            style={{marginTop: deviceHeight / 10}}
            isVisible={true}
            size={40}
            type={'Wave'}
            color={Constants.COLOR.THEME_COLOR_2}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <KeyboardAwareScrollView>
            <View
              style={{
                paddingHorizontal: deviceHeight * (1 / 35),
                height: Dimensions.get('window').height,
                justifyContent: 'center',
              }}>
              <Image
                style={{
                  width: deviceWidth * (2 / 3),
                  height: deviceWidth * (1 / 5),
                  marginTop: deviceHeight * (1 / 30),
                }}
                resizeMode="contain"
                source={require('../images/BigLogo.png')}
              />

              <Text
                style={{
                  color: Constants.COLOR.FONT_COLOR,
                  fontSize: Constants.FONT_SIZE.XXXL,
                  marginTop: deviceHeight * (1 / 20),
                  fontWeight: 'bold',
                }}>
                Welcome
              </Text>

              <Text
                style={{
                  color: Constants.COLOR.FONT_COLOR,
                  fontSize: Constants.FONT_SIZE.XL,
                }}>
                Sign in to continue
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: deviceHeight / 25,
                }}>
                <Image
                  style={{width: deviceHeight / 40, height: deviceHeight / 40}}
                  resizeMode="contain"
                  source={require('../images/username.png')}
                />

                <TextInput
                  style={styles.textinput}
                  underlineColorAndroid={'transparent'}
                  placeholder={'Username'}
                  value={this.state.username}
                  onChangeText={username => {
                    this.setState({username});
                  }}
                  placeholderTextColor={Constants.COLOR.FONT_HINT}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  onSubmitEditing={() => this.passwordInputText.focus()}
                />
              </View>

              <View
                style={{backgroundColor: Constants.COLOR.FONT_COLOR, height: 1}}
              />

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: deviceHeight / 25,
                }}>
                <Image
                  style={{width: deviceHeight / 40, height: deviceHeight / 40}}
                  resizeMode="contain"
                  source={require('../images/password.png')}
                />

                <TextInput
                  ref={input => (this.passwordInputText = input)}
                  style={styles.textinput}
                  underlineColorAndroid={'transparent'}
                  placeholder={'Password'}
                  value={this.state.password}
                  onChangeText={password => {
                    this.setState({password});
                  }}
                  placeholderTextColor={Constants.COLOR.FONT_HINT}
                  autoCapitalize={'none'}
                  returnKeyType={'done'}
                  onSubmitEditing={() => {
                    this._validateInputs();
                  }}
                  secureTextEntry={true}
                />
              </View>

              <View
                style={{backgroundColor: Constants.COLOR.FONT_COLOR, height: 1}}
              />

              <View
                style={{flexDirection: 'row', marginTop: deviceHeight / 10}}>
                <View style={{flex: 1}} />

                <TouchableOpacity
                  style={{
                    flex: 5,
                    backgroundColor: Constants.COLOR.THEME_COLOR,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    this._validateInputs();
                  }}>
                  {this._renderLoginButton()}
                </TouchableOpacity>

                <View style={{flex: 1}} />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: deviceHeight / 50,
                  justifyContent: 'center',
                }}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </View>

              <View
                style={{marginTop: deviceHeight / 10, alignItems: 'center'}}>
                <Text style={styles.versionText}>Powered By</Text>

                <Image
                  style={{width: deviceWidth / 2, height: deviceWidth / 9}}
                  resizeMode="contain"
                  source={require('../images/poweredBy.png')}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      );
    }
  };

  /**
   * Renders Splash Screen Design
   */
  render() {
    return this._renderScreen();
  }
}

const mapStateToProps = (state, props) => {
  //props can be called as ownProps
  const {
    signInState: {isPageLoading, isLoginLoading},
  } = state;

  return {
    isPageLoading,
    isLoginLoading,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      loginButtonSubmit,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignInScreen);

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: deviceHeight * (5 / 12),
    height: deviceHeight * (3 / 20),
  },
  textinput: {
    flex: 1,
    color: Constants.COLOR.FONT_COLOR,
    padding: 10,
    fontSize: Constants.FONT_SIZE.L,
  },
  loginText: {
    color: 'white',
    fontSize: Constants.FONT_SIZE.L,
  },
  forgotText: {
    color: Constants.COLOR.FONT_COLOR,
    fontSize: Constants.FONT_SIZE.M,
    paddingLeft: 10,
    paddingVertical: 10,
  },
  versionText: {
    color: Constants.COLOR.FONT_COLOR,
    fontSize: Constants.FONT_SIZE.S,
    padding: 5,
  },
});

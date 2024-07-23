/*************************************************
 * SukraasLIS
 * @exports
 * @class SettingsScreen.js
 * @extends Component
 * Created by Monisha on 20/05/2020
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
  TouchableOpacity,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import {Actions} from 'react-native-router-flux';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {clearAllStates} from '../../actions/LogoutAction';
import store from '../../store';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

const clearAppData = async function() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
    Actions.splashScreen();
  } catch (error) {}
};

class SettingsScreen extends Component {
 //  static propTypes = {
  //   clearAllStates: PropTypes.func,
  //   showManageAddress: PropTypes.bool,
  // };

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
    };
  }


  async componentDidMount() {
    console.log('showManageAddress', this.props.showManageAddress);   
   await AsyncStorage.getItem(Constants.ASYNC.ASYNC_PHONE_NUMBER)
      .then(value => {
        this.setState({phoneNumber: value});
      })
      .done();
  }

  internetAlert(Message) {
    Alert.alert(
      Constants.ALERT.TITLE.FAILED,
      Message,
      [
        {
          text: Constants.ALERT.BTN.OK,
          onPress: () => {},
        },
      ],
      {cancelable: false},
    );
  }

  logoutButtonClicked() {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      Alert.alert(
        Constants.ALERT.TITLE.INFO,
        Constants.ALERT.MESSAGE.LOGOUT_MESSAGE,
        [
          {
            text: Constants.ALERT.BTN.YES,
            onPress: () => {
              this.props.clearAllStates(this.state.phoneNumber);
              clearAppData();
            },
          },
          {text: Constants.ALERT.BTN.NO, onPress: () => {}},
        ],
        {cancelable: false},
      );
    } else {
      this.internetAlert(Constants.VALIDATION_MSG.NO_INTERNET);
    }
  }

  render() {
    const {showManageAddress} = this.props;

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <TouchableOpacity
            style={[styles.subContainer, {marginTop: 15}]}
            onPress={() => {
              Actions.manageBranchScreen({isFromSettings: true});
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={[styles.profileImageView, {backgroundColor: '#696A6D'}]}>
                <Image
                  style={[styles.avatar, {}]}
                  resizeMode="contain"
                  source={require('../../images/code-branch1.png')}
                />
              </View>
              <Text
                style={{
                  flex: 1,
                  paddingHorizontal: 20,
                  fontSize: Constants.FONT_SIZE.L,
                }}>
                Manage Branch
              </Text>
              <Image
                style={[styles.avatar]}
                resizeMode="contain"
                source={require('../../images/rightArrow.png')}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subContainer]}
            onPress={() => {
              Actions.manageUsersScreen();
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={[styles.profileImageView, {backgroundColor: '#1E564A'}]}>
                <Image
                  style={[styles.avatar, {}]}
                  resizeMode="contain"
                  source={require('../../images/user1.png')}
                />
              </View>
              <Text
                style={{
                  flex: 1,
                  paddingHorizontal: 20,
                  fontSize: Constants.FONT_SIZE.L,
                }}>
                Manage Members
              </Text>
              <Image
                style={[styles.avatar]}
                resizeMode="contain"
                source={require('../../images/rightArrow.png')}
              />
            </View>
          </TouchableOpacity>
          {showManageAddress ? (
            <TouchableOpacity
              style={[styles.subContainer]}
              onPress={() => {
                Actions.manageAddressScreen();
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={[
                    styles.profileImageView,
                    {backgroundColor: '#AF794E'},
                  ]}>
                  <Image
                    style={[styles.avatar, {}]}
                    resizeMode="contain"
                    source={require('../../images/map-marker-alt.png')}
                  />
                </View>
                <Text
                  style={{
                    flex: 1,
                    paddingHorizontal: 20,
                    fontSize: Constants.FONT_SIZE.L,
                  }}>
                  Manage Address
                </Text>
                <Image
                  style={[styles.avatar]}
                  resizeMode="contain"
                  source={require('../../images/rightArrow.png')}
                />
              </View>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.subContainer}
            onPress={() => {
              Actions.aboutScreen();
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={[styles.profileImageView, {backgroundColor: '#172073'}]}>
                <Image
                  style={[styles.avatar, {}]}
                  resizeMode="contain"
                  source={require('../../images/info.png')}
                />
              </View>
              <Text
                style={{
                  flex: 1,
                  paddingHorizontal: 20,
                  fontSize: Constants.FONT_SIZE.L,
                }}>
                About
              </Text>
              <Image
                style={[styles.avatar]}
                resizeMode="contain"
                source={require('../../images/rightArrow.png')}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.subContainer}
            onPress={() => {
              Actions.contactUsScreen();
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={[styles.profileImageView, {backgroundColor: '#EF9724'}]}>
                <Image
                  style={[styles.avatar, {}]}
                  resizeMode="contain"
                  source={require('../../images/phone1.png')}
                />
              </View>
              <Text
                style={{
                  flex: 1,
                  paddingHorizontal: 20,
                  fontSize: Constants.FONT_SIZE.L,
                }}>
                Contact Us
              </Text>
              <Image
                style={[styles.avatar]}
                resizeMode="contain"
                source={require('../../images/rightArrow.png')}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.subContainer}
            onPress={() => this.logoutButtonClicked()}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={[styles.profileImageView, {backgroundColor: '#E92E40'}]}>
                <Image
                  style={[styles.avatar, {}]}
                  resizeMode="contain"
                  source={require('../../images/sign-out.png')}
                />
              </View>
              <Text
                style={{
                  flex: 1,
                  paddingHorizontal: 20,
                  fontSize: Constants.FONT_SIZE.L,
                }}>
                Logout
              </Text>
              <Image
                style={[styles.avatar]}
                resizeMode="contain"
                source={require('../../images/rightArrow.png')}
              />
            </View>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
const mapStateToProps = (state, props) => {
  const {
    configState: {showManageAddress},
  } = state;

  return {
    showManageAddress,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      clearAllStates,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
  },
  subContainer: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  avatar: {
    width: deviceHeight / 35,
    height: deviceHeight / 35,
  },
  profileImageView: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

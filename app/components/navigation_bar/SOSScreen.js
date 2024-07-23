/* eslint-disable no-undef */
/*************************************************
 * SukraasLIS
 * @exports
 * @class SOSScreen.js
 * @extends Component
 * Created by Sankar on 25/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import LoadingScreen from '../common/LoadingScreen';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import { Actions } from 'react-native-router-flux';
import store from '../../store';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import {
  updateSOSAlert,
  showSosLoading,
  hideSosLoading,
} from '../../actions/SosAction';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

class SOSScreen extends Component {
  //  static propTypes = {
  //   isSosLoading: PropTypes.bool,
  //   mobileNo: PropTypes.string,
  //   updateSOSAlert: PropTypes.func,
  //   showSosLoading: PropTypes.func,
  //   hideSosLoading: PropTypes.func,
  // };

  constructor(props) {
    super(props);
    this.state = {
      formatAddress: '',
      latitude: '',
      longitude: '',
      isYesButtonClicked: false,
      isNoButtonClicked: false,
    };
  }

  enableLocationAlert() {
    Alert.alert(
      Constants.ALERT.TITLE.INFO,
      Constants.ALERT.MESSAGE.ENABLE_LOCATION,
      [
        {
          text: Constants.ALERT.BTN.YES,
          onPress: () => {
            Linking.openURL('app-settings:');
          },
        },
        { text: Constants.ALERT.BTN.NO, onPress: () => { } },
      ],
      { cancelable: false },
    );
  }
  enablePermissionAlert() {
    Alert.alert(
      Constants.ALERT.TITLE.INFO,
      Constants.ALERT.MESSAGE.ENABLE_LOCATION_PERMISSION,
      [
        {
          text: Constants.ALERT.BTN.OK,
          onPress: () => { },
        },
      ],
      { cancelable: false },
    );
  }

  internetAlert(Message, isClose) {
    Alert.alert(
      Constants.ALERT.TITLE.FAILED,
      Message,
      [
        {
          text: Constants.ALERT.BTN.OK,
          onPress: () => {
            if (isClose) {
              Actions.pop();
            }
          },
        },
      ],
      { cancelable: false },
    );
  }

  componentDidMount() {
    //Init Geocoder with Api key...
    Geocoder.init('AIzaSyC5NYjd063ybuLVcVreJ7Up9PSH1q8CHdA', {
      language: 'en',
    });
  }

  render() {
    if (this.props.isSosLoading) {
      return this._screenLoading();
    } else {
      return this._renderBodyView();
    }
  }

  _screenLoading = () => {
    return <LoadingScreen />;
  };

  _renderBodyView = () => {
    return (
      <View style={styles.mainContainer}>
        <TouchableOpacity
          onPress={() => {
            Actions.pop();
          }}>
          <Image
            style={styles.headerRightImage}
            resizeMode="contain"
            source={require('../../images/black_cross.png')}
          />
        </TouchableOpacity>

        <View style={styles.innerContainer}>
          <Text style={styles.startText}> SOS ALERT </Text>

          <Text style={styles.centerText}>
            Are you sure you want to send an emergency alert message to our
            Customer Service?
          </Text>

          <TouchableOpacity
            disabled={this.state.isYesButtonClicked}
            style={styles.yesButton}
            onPress={() => this._onPressLocateMe()}>
            <Text style={styles.buttonText}> Yes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={this.state.isNoButtonClicked}
            style={styles.noButton}
            onPress={() => {
              this.setState({
                isNoButtonClicked: true,
              });
              Actions.pop();
              setTimeout(() => {
                this.setState({
                  isNoButtonClicked: false,
                });
              }, 2000);
            }}>
            <Text style={styles.buttonText}> No </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //Tap to Locate me Button
  _onPressLocateMe = () => {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      this.setState({
        isYesButtonClicked: true,
      });

      //Check Location is enable or not
      // if (Platform.OS === 'android') {
      //   {
      //     RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      //       interval: 10000,
      //       fastInterval: 5000,
      //     })
      //       .then(data => {
      //         this._getCurrentLocationHandler();
      //       })
      //       .catch(err => {
      //         console.log(err);
      //       });
      //   }
      // }


      //removed fastinterval for the version 2.0.1
      if (Platform.OS === 'android') {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000 })
          .then(data => {
            this._getCurrentLocationHandler();
          })
          .catch(err => {
            console.log(err);
          });
      }
      else {
        this._onPressUseCurrentLocation();
      }
      setTimeout(() => {
        this.setState({
          isYesButtonClicked: false,
        });
      }, 2000);
    } else {
      this.internetAlert(Constants.VALIDATION_MSG.NO_INTERNET, false);
    }
  };

  _onPressUseCurrentLocation = async () => {
    await Geolocation.requestAuthorization();
    this._getCurrentLocationHandler();
  };

  // getCurrent Location
  _getCurrentLocationHandler = () => {
    Geolocation.getCurrentPosition(
      pos => {
        console.log('_getCurrentLocationHandler pos', pos);

        this.props.showSosLoading();
        this.getAddress(pos.coords.latitude, pos.coords.longitude);
      },
      err => {
        console.log('_getCurrentLocationHandler err', err);
        this.props.hideSosLoading();
        if (err.code === 1) {
          this.enablePermissionAlert();
        }
        //Check enable Location on IOS
        if (Platform.OS === 'ios') {
          if (err.code === 2) {
            this.enableLocationAlert();
          }
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 200000,
        maximumAge: 10000,
      },
    );
  };

  //Get Address Results
  getAddress = (lat, lng) => {
    try {
      Geocoder.from(lat, lng)
        .then(json => {
          let address_components = json.results[0].address_components;
          if (address_components.length > 0) {
            this.setState(prevState => {
              return {
                formatAddress: json.results[0].formatted_address,
                latitude: lat.toString(),
                longitude: lng.toString(),
              };
            });

            if (
              this.state.formatAddress !== '' &&
              this.state.latitude !== '' &&
              this.state.longitude !== ''
            ) {
              let postData = {
                UserName: this.props.mobileNo,
                Latitude: this.state.latitude,
                Longitude: this.state.longitude,
                Full_Address: this.state.formatAddress,
              };
              this.props.updateSOSAlert(postData, (isSuccess, responseData) => {
                let smsLink = AsyncStorage.configUri.sm_gw_li
                  .replace(
                    'XXXMOBILE_NOXXX',
                    responseData.Alert_Receive_Numbers,
                  )
                  .replace('XXXMESSAGEXXX', responseData.Alert_Content);

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
              });
            }
          } else {
            this.props.hideSosLoading();
            this.setState({
              formatAddress: '',
              latitude: lat.toString(),
              longitude: lng.toString(),
            });
          }
        })
        .catch(error => console.warn(error));
    } catch (e) {
      console.log('Error, ', e);
      this.props.hideSosLoading();
    }
  };
}
const mapStateToProps = (state, props) => {
  const {
    sosState: { isSosLoading },
    configState: { mobileNo },
  } = state;

  return {
    isSosLoading,
    mobileNo,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { updateSOSAlert, showSosLoading, hideSosLoading },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SOSScreen);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#eef3fd',
    padding: 10,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },

  innerContainer: {
    backgroundColor: '#e1ebf9',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 5,
    padding: 10,
    marginHorizontal: 15,
    borderRadius: 5,
    marginVertical: 40,
  },

  startText: {
    color: 'black',
    fontSize: Constants.FONT_SIZE.XXXL,
    paddingTop: 25,
  },

  centerText: {
    color: 'black',
    fontSize: Constants.FONT_SIZE.M,
    paddingTop: 50,
    marginHorizontal: 10,
  },

  yesButton: {
    backgroundColor: '#58afff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    width: deviceWidth / 1.3,
    marginTop: 50,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 1.0,
    elevation: 6,
    shadowRadius: 15,
  },

  noButton: {
    backgroundColor: '#fc464f',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    width: deviceWidth / 1.3,
    marginTop: 20,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 1.0,
    elevation: 6,
    shadowRadius: 15,
  },

  buttonText: {
    fontSize: Constants.FONT_SIZE.L,
    paddingVertical: 10,
    color: '#FFFFFF',
  },

  headerRightImage: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: deviceHeight / 40,
    height: deviceHeight / 40,
    marginTop: 10,
    marginRight: 15,
  },
});

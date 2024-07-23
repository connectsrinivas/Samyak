/*************************************************
 * SukraasLIS
 * @exports
 * @class LocationScreen.js
 * @extends Component
 * Created by Shiva Shankar on 15/06/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { Actions } from 'react-native-router-flux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import Geocoder from 'react-native-geocoding';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import store from '../store';


const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

let address_components = [];
class LocationScreen extends Component {
  enableLocationAlert() {
    Alert.alert(
      // Constants.ALERT.TITLE.INFO,
      // Constants.ALERT.MESSAGE.ENABLE_LOCATION,
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
  constructor(props) {
    super(props);
    this.state = {
      isGEOAPIDisabled: false,
      doneBtnClicked: false,
      focusedLocation: {
        latitude: store.getState().configState.branchLatitude,
        longitude: store.getState().configState.branchLongitude,
        latitudeDelta: 0.8,
        longitudeDelta: (deviceWidth / deviceHeight) * 0.8,
      },
      locationChoose: true,
      address: {
        Street: '',
        Place: '',
        City: '',
        State: '',
        PinCode: '',
        Latitude: '',
        Longitude: '',
        Address_Type_Desc: this.props.addressType,
        Address_Type_Code: this.props.addressTypeCode,
      },
      formatAddress: '',
      doneBtnDisabled: false,
      closeBtnDisabled: false,
      locationIconBtnClicked: false,
    };
  }
  //Close button click
  _closeClick = () => {
    Actions.pop();
  };

 async componentDidMount() {
    //Initialize Geo Code Api
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      Geocoder.init('AIzaSyCR_Jh0VwkkEprAsYZb-g0FFTzpcNff_5c', {
        language: 'en',
      });
      if (this.props.lat !== '' && this.props.lng !== '') {
        this.setState((prevState) => {
          return {
            focusedLocation: {
              ...prevState.focusedLocation,
              latitude: parseFloat(this.props.lat),
              longitude: parseFloat(this.props.lng),
            },
          };
        });
        this.getAddress(parseFloat(this.props.lat), parseFloat(this.props.lng));
      } else {
        this.getAddress(
          this.state.focusedLocation.latitude,
          this.state.focusedLocation.longitude,
        );
      }
    } else {
      this.internetAlert(Constants.VALIDATION_MSG.NO_INTERNET, true);
    }
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
              this._closeClick();
            }
          },
        },
      ],
      { cancelable: false },
    );
  }
  // Get Lat long drag on Map
  pickLocationHandler = (event) => {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      this.setState({
        doneBtnDisabled: true,
      });
      if (event.location !== undefined && !event.location) {
      } else {
        event.stopPropagation();
      }

      this.setState({
        formatAddress: '',
        doneBtnClicked: false,
        address: {
          Street: '',
          Place: '',
          City: '',
          State: '',
          PinCode: '',
          Latitude: '',
          Longitude: '',
          Address_Type_Desc: this.props.addressType,
          Address_Type_Code: this.props.addressTypeCode,
        },
      });
      const coords = event.nativeEvent.coordinate;
      this.setState((prevState) => {
        return {
          doneBtnClicked: true,
          focusedLocation: {
            ...prevState.focusedLocation,
            latitudeDelta: 0.8,
            longitudeDelta: (deviceWidth / deviceHeight) * 0.8,

            latitude: coords.latitude,
            longitude: coords.longitude,
          },
          locationChoose: true,
        };
      });
      if (this.map !== null) {
        this.map.animateToRegion({
          ...this.state.focusedLocation,
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      }

      if (!this.state.isGEOAPIDisabled) {
        this.setState({
          isGEOAPIDisabled: true,
        });
        this.getAddress(coords.latitude, coords.longitude);
      }
    } else {
      this.internetAlert(Constants.VALIDATION_MSG.NO_INTERNET, false);
    }
  };

  //Get Address Results
  getAddress = (lat, lng) => {
    try {
      setTimeout(() => {
        this.setState({
          isGEOAPIDisabled: false,
        });
      }, 1000);

      fetch(
        'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        lat +
        ',' +
        lng +
        '&key=' +
        'AIzaSyCR_Jh0VwkkEprAsYZb-g0FFTzpcNff_5c',
      )
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(
            'ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson),
          );
          address_components = responseJson.results[0].address_components;

          if (address_components.length > 3) {
            this.setState((prevState) => {
              return {
                address: {
                  ...prevState.rowData,
                  Street:
                    address_components[0].long_name +
                    ',' +
                    address_components[1].long_name,
                  Place: address_components[2].long_name,
                  City:
                    address_components[
                      address_components.length - 4
                    ].long_name,
                  State:
                    address_components[
                      address_components.length - 3
                    ].long_name,
                  PinCode:
                    address_components[
                      address_components.length - 1
                    ].long_name,
                  Latitude: this.state.focusedLocation.latitude,
                  Longitude: this.state.focusedLocation.longitude,
                  Address_Type_Desc: this.props.addressType,
                  Address_Type_Code: this.props.addressTypeCode,
                },
                formatAddress: responseJson.results[0].formatted_address,
              };
            });
            this.setState({
              doneBtnDisabled: false,
              doneBtnClicked: true,
            });
          } else {
            this.setState({
              doneBtnDisabled: false,
            });
            this.setState({
              formatAddress: '',
              doneBtnClicked: false,
            });
            Utility.showAlert(
              Constants.ALERT.TITLE.FAILED,
              Constants.VALIDATION_MSG.ADDRESS_ALERT,
            );
          }
        })
        .catch((error) => console.warn(error));
    } catch (e) {
      this.setState({
        doneBtnDisabled: false,
      });
      this.setState({
        formatAddress: '',
        doneBtnClicked: false,
        address: {
          Street: '',
          Place: '',
          City: '',
          State: '',
          PinCode: '',
          Latitude: '',
          Longitude: '',
          Address_Type_Desc: this.props.addressType,
          Address_Type_Code: this.props.addressTypeCode,
        },
      });
      Utility.showAlert(
        Constants.ALERT.TITLE.FAILED,
        Constants.VALIDATION_MSG.ADDRESS_ALERT,
      );
    }
  };

  _onPressDoneBtn = () => {
    const { latitude, longitude } = this.state.focusedLocation;
    const { address, doneBtnClicked } = this.state;
    if (doneBtnClicked === false) {
      Alert.alert(
        Constants.ALERT.TITLE.INFO,
        Constants.ALERT.MESSAGE.SELECT_LOCATION,
        [{ text: Constants.ALERT.BTN.OK, onPress: () => { } }],
        { cancelable: false },
      );
    } else {
      Actions.pop({
        refresh: {
          rowData: address,
        },
        timeout: 1,
      });
    }
  };
  //Tap to Locate me Button
  _onPressLocateMe = () => {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      // Check Location is enable or not
      if (Platform.OS === 'android') {
        {
          RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
            interval: 10000,
            fastInterval: 5000,
          })
            .then(data => {
              this._getCurrentLocationHandler();
            })
            .catch(err => {
              console.log(err);
            });
        }
      } 

      //removed fastinterval for the version 2.0.1
      if (Platform.OS === 'android') {
        {
          RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
            interval: 10000,
          })
            .then((data) => {
              this._getCurrentLocationHandler();
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } else {
        Geolocation.requestAuthorization();
        this._getCurrentLocationHandler();
      }
    } else {
      this.internetAlert(Constants.VALIDATION_MSG.NO_INTERNET, false);
    }
  };

  // getCurrent Location
  _getCurrentLocationHandler = () => {
    Geolocation.getCurrentPosition(
      (pos) => {
        const coordsEvent = {
          nativeEvent: {
            coordinate: {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            },
          },
          location: false,
        };
        this.pickLocationHandler(coordsEvent);
      },
      (err) => {
        console.log(err);
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
  _renderMapView = (marker) => {
    return (
      <View>
        <MapView
          // onMapReady={this.defaultMarkerView()}
          initialRegion={this.state.focusedLocation}
          style={styles.map}
          onPress={this.pickLocationHandler}
          onPoiClick={this.pickLocationHandler}
          ref={(ref) => (this.map = ref)}>
          {marker}
        </MapView>
        <TouchableOpacity
          disabled={this.state.locationIconBtnClicked}
          onPress={() => {
            this.setState({
              locationIconBtnClicked: true,
            });
            this._onPressLocateMe();
            setTimeout(() => {
              this.setState({
                locationIconBtnClicked: false,
              });
            }, 1000);
          }}
          style={{ position: 'absolute', top: 10, right: 10 }}>
          <Image
            style={{ width: 50, height: 50 }}
            source={require('../images/locateImage.png')}
          />
        </TouchableOpacity>
        {this._renderAddress()}
        <TouchableOpacity
          disabled={this.state.doneBtnDisabled}
          style={styles.button}
          onPress={() => {
            this.setState({
              doneBtnDisabled: true,
            });
            this._onPressDoneBtn();
            setTimeout(() => {
              this.setState({
                doneBtnDisabled: false,
              });
            }, 1000);
          }}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  };
  _renderAddress = () => {
    if (
      this.state.formatAddress !== null &&
      this.state.formatAddress !== undefined &&
      this.state.formatAddress.length > 0
    ) {
      return (
        <Text style={styles.latlng}>
          Address: {this.state.formatAddress}
        </Text>
      );
    } else {
      return <View />;
    }
  };
  render() {
    let marker = null;
    if (this.state.locationChoose) {
      marker = (
        <Marker
          coordinate={this.state.focusedLocation}
          draggable
          onDragEnd={(e) => this.pickLocationHandler(e)}
        />
      );
    }
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 5,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: Constants.FONT_SIZE.L,
                marginHorizontal: 8,
                marginVertical: 20,
                color: Constants.COLOR.BLACK_COLOR,
                fontWeight: '600',
              }}>
              Pick Your Location
            </Text>
            <TouchableOpacity
              disabled={this.state.closeBtnDisabled}
              onPress={() => {
                this.setState({
                  closeBtnDisabled: true,
                });
                this._closeClick();
                setTimeout(() => {
                  this.setState({
                    closeBtnDisabled: false,
                  });
                }, 1000);
              }}>
              <Image
                style={[styles.closeImageStyle]}
                source={require('../images/black_cross.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {this._renderMapView(marker)}
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
  },
  map: {
    width: '100%',
    height: deviceHeight / 2,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: Constants.COLOR.BUTTON_BG,
    alignSelf: 'center',
    paddingVertical: 15,
    paddingHorizontal: 45,
    marginVertical: 20,
    borderRadius: 16,
  },
  buttonText: {
    color: Constants.COLOR.WHITE_COLOR,
    fontSize: Constants.FONT_SIZE.M,
    textAlign: 'center',
  },
  closeImageStyle: {
    alignSelf: 'flex-end',
    marginHorizontal: 8,
    marginVertical: 20,
    width: deviceHeight / 35,
    height: deviceHeight / 35,
  },
  latlng: {
    textAlign: 'center',
    padding: 20,
    fontSize: Constants.FONT_SIZE.M,
    color: Constants.COLOR.BLACK_COLOR,
  },
});

export default LocationScreen;


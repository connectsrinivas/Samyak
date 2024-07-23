/*************************************************
 * SukraasLIS
 * @exports
 * @class AddAddressScreen.js
 * @extends Component
 * Created by Monisha on 01/06/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import { Actions } from 'react-native-router-flux';
import { Dropdown } from 'react-native-material-dropdown-v2';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
// import PropTypes from 'prop-types';
import {
  invokeSubmitAddress,
  invokeUpdateAddress,
  invokeAddressType,
} from '../actions/AddEditAddressActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';
import LoadingScreen from './common/LoadingScreen';
import store from '../store';
import getDistance from 'geolib/es/getDistance';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class AddUsersScreen extends Component {
  // static propTypes = {
  //   street: PropTypes.object,
  //   isEditButtonTouched: PropTypes.bool,
  //   rowData: PropTypes.object,

  //   invokeSubmitAddress: PropTypes.func,
  //   invokeUpdateAddress: PropTypes.func,
  //   invokeAddressType: PropTypes.func,
  //   addressTypeList: PropTypes.array,
  //   isSubmitButtonLoading: PropTypes.bool,
  //   isUpdateButtonLoading: PropTypes.bool,
  // };

  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      addressType: '',
      addressTypeCode: '',
      street: '',
      place: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      value: 0,
      latitude: '',
      longitude: '',
      locationBtnDisabled: false,
      closeAddressBtnDisabled: false,
    };
  }

  successAlert(Message) {
    Alert.alert(
      Constants.ALERT.TITLE.SUCCESS,
      Message,
      [
        {
          text: Constants.ALERT.BTN.OK,
          onPress: () => {
            this._closeClick();
          },
        },
      ],
      { cancelable: false },
    );
  }

  internetAlert(Message) {
    Alert.alert(
      Constants.ALERT.TITLE.FAILED,
      Message,
      [
        {
          text: Constants.ALERT.BTN.OK,
          onPress: () => {
            this._closeClick();
          },
        },
      ],
      { cancelable: false },
    );
  }

  async componentDidMount() {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      this.props.invokeAddressType();
      const { isEditButtonTouched, rowData } = this.props;
      await AsyncStorage.getItem(Constants.ASYNC.ASYNC_PHONE_NUMBER)
        .then(value => {
          this.setState({ userName: value });
        })
        .done();
      this.setState({
        addressType: isEditButtonTouched ? rowData.addressType : '',
        street: isEditButtonTouched ? rowData.Street : '',
        place: isEditButtonTouched ? rowData.Place : '',
        city: isEditButtonTouched ? rowData.City : '',
        state: isEditButtonTouched ? rowData.State : '',
        pincode: isEditButtonTouched ? rowData.PinCode : '',
        latitude: isEditButtonTouched ? rowData.Latitude : '',
        longitude: isEditButtonTouched ? rowData.Longitude : '',
        landmark: isEditButtonTouched ? rowData.Landmark : '',
      });

    } else {
      this.internetAlert(Constants.VALIDATION_MSG.NO_INTERNET);
    }
  }
  _closeClick = () => {
    Actions.pop();
  };

  componentWillReceiveProps(nextProps) {
    if (_.has(nextProps, 'rowData')) {
      this.setState({
        street: nextProps.rowData.Street,
        place: nextProps.rowData.Place,
        city: nextProps.rowData.City,
        state: nextProps.rowData.State,
        pincode: nextProps.rowData.PinCode,
        latitude: nextProps.rowData.Latitude,
        longitude: nextProps.rowData.Longitude,
        addressType: nextProps.rowData.Address_Type_Desc,
        addressTypeCode: nextProps.rowData.Address_Type_Code,
      });
    } else {
    }
  }

  _validateInputs() {
    const { addressType, street, city, state, pincode, place } = this.state;
    if (this.state.addressType.trim().length < 1) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_ADDRESS_TYPE,
      );
    } else if (street.trim() === '') {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_STREET,
      );
    } else if (place.trim() == '') {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_PLACE,
      );
    } else if (city.trim() === '') {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_CITY,
      );
    } else if (state.trim() === '') {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_STATE,
      );
    } else if (pincode.trim() === '') {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_PINCODE,
      );
    } else {
      this._submitClick();
    }
  }

  _submitClick() {
    const {
      addressType,
      addressTypeCode,
      street,
      city,
      state,
      pincode,
      place,
      landmark,
      latitude,
      longitude,
      userName,
    } = this.state;
    console.log('7777777777777777   latitude  7777777777777777', latitude);
    console.log('00000000000000000000 longitude 00000000000000', longitude);
    const { isEditButtonTouched } = this.props;
    if (isEditButtonTouched) {
      let dictSubmitInfo = {
        Username: userName.trim(),
        Address_Type: addressTypeCode.trim(),
        Street: street.trim(),
        City: city.trim(),
        State: state.trim(),
        Pincode: pincode.trim(),
        Place: place.trim(),
        Landmark: landmark.trim(),
        Latitude: latitude,
        Longitude: longitude,
      };
      if (latitude === '' || longitude === '') {
        Utility.showAlert(
          Constants.ALERT.TITLE.INFO,
          Constants.VALIDATION_MSG.NO_LAT_LNG,
        );
      } else if (this.props.distance === 0) {
        this.props.invokeSubmitAddress(dictSubmitInfo, isSuccess => {
          if (isSuccess === true) {
            this.successAlert(Constants.ALERT.MESSAGE.ADD_ADDRESS_SUCCESS);
          }
        });
      } else {
        let localDistance = getDistance(
          {
            latitude: this.props.branchLatitude,
            longitude: this.props.branchLongitude,
          },
          { latitude: latitude, longitude: longitude },
          1,
        );
        if (localDistance / 1000 < this.props.distance) {
          this.props.invokeUpdateAddress(dictSubmitInfo, isSuccess => {
            if (isSuccess === true) {
              this.successAlert(Constants.ALERT.MESSAGE.UPDATE_ADDRESS_SUCCESS);
            }
          });
        } else {
          Utility.showAlert(
            Constants.ALERT.TITLE.INFO,
            Constants.VALIDATION_MSG.DISTANCE_LONG,
          );
        }
      }
    } else {
      let dictSubmitInfo = {
        Username: userName.trim(),
        Address_Type: addressTypeCode.trim(),
        Street: street.trim(),
        City: city.trim(),
        State: state.trim(),
        Pincode: pincode.trim(),
        Place: place.trim(),
        Landmark: landmark.trim(),
        Latitude: latitude,
        Longitude: longitude,
      };
      if (latitude === '' || longitude === '') {
        Utility.showAlert(
          Constants.ALERT.TITLE.INFO,
          Constants.VALIDATION_MSG.NO_LAT_LNG,
        );
      } else if (this.props.distance === 0) {
        this.props.invokeSubmitAddress(dictSubmitInfo, isSuccess => {
          if (isSuccess === true) {
            this.successAlert(Constants.ALERT.MESSAGE.ADD_ADDRESS_SUCCESS);
          }
        });
      } else {
        let localDistance = getDistance(
          {
            latitude: this.props.branchLatitude,
            longitude: this.props.branchLongitude,
          },
          { latitude: latitude, longitude: longitude },
          1,
        );
        if (localDistance / 1000 < this.props.distance) {
          this.props.invokeSubmitAddress(dictSubmitInfo, isSuccess => {
            if (isSuccess === true) {
              this.successAlert(Constants.ALERT.MESSAGE.ADD_ADDRESS_SUCCESS);
            }
          });
        } else {
          Utility.showAlert(
            Constants.ALERT.TITLE.INFO,
            Constants.VALIDATION_MSG.DISTANCE_LONG,
          );
        }
      }
    }
  }
  _screenLoading = () => {
    return <LoadingScreen />;
  };

  _renderContentView() {
    return (
      <View style={{ paddingHorizontal: 20, paddingVertical: 10, top: 10 }}>
        <TouchableOpacity
          style={{
            paddingVertical: 15,
            backgroundColor: Constants.COLOR.SELECT_LOCATION_BG_COLOR,
            borderRadius: 10,
            paddingHorizontal: 15,
            // fontSize: Constants.FONT_SIZE.M,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          disabled={this.state.locationBtnDisabled}
          onPress={() => {
            this.setState({
              locationBtnDisabled: true,
            });
            Actions.LocationScreen({
              addressType: this.state.addressType,
              addressTypeCode: this.state.addressTypeCode,
              lat: this.state.latitude,
              lng: this.state.longitude,
            });
            setTimeout(() => {
              this.setState({
                locationBtnDisabled: false,
              });
            }, 1000);
          }}>
          <Text
            style={{
              color: Constants.COLOR.WHITE_COLOR,
              fontSize: Constants.FONT_SIZE.M,
            }}>
            Select location on map
          </Text>
          <Image source={require('../images/locationArrow.png')} />
        </TouchableOpacity>
        <Dropdown
          disabled={this.props.isEditButtonTouched ? true : false}
          containerStyle={{
            backgroundColor: Constants.COLOR.WHITE_COLOR,
            borderRadius: 25,
            marginTop: 25,
          }}
          placeholder="Address Type"
          value={this.state.addressType}
          baseColor={Constants.COLOR.FONT_HINT}
          textColor={Constants.COLOR.BLACK_COLOR}
          data={this.props.addressTypeList}
          fontSize={Constants.FONT_SIZE.L}
          valueExtractor={({ Address_Type_Desc }) => Address_Type_Desc}
          dropdownOffset={{ top: 0, left: 0 }}
          pickerStyle={{
            borderRadius: 10,
            width: deviceWidth - 40,
            left: 20,
          }}
          selectedItemColor={
            this.state.city === ''
              ? Constants.COLOR.FONT_HINT
              : Constants.COLOR.THEME_COLOR
          }
          onChangeText={(value, index, data) => {
            this.setState({ addressType: value });
            this.setState({ addressTypeCode: data[index].Address_Type_Code });
          }}
          dropdownPosition={-4.5}
        />
        <TextInput
          style={{
            paddingVertical: 15,
            backgroundColor: Constants.COLOR.WHITE_COLOR,
            borderRadius: 25,
            marginTop: 25,
            paddingHorizontal: 15,
            fontSize: Constants.FONT_SIZE.M,
            color: Constants.COLOR.BLACK_COLOR,
          }}
          placeholder={'Street'}
          value={this.state.street}
          onChangeText={street => {
            this.setState({ street });
          }}
          placeholderTextColor={Constants.COLOR.FONT_HINT}
          autoCapitalize={'none'}
          returnKeyType={'next'}
          onSubmitEditing={() => this.place.focus()}
        />

        <TextInput
          ref={input => (this.place = input)}
          style={{
            paddingVertical: 15,
            backgroundColor: Constants.COLOR.WHITE_COLOR,
            borderRadius: 25,
            paddingHorizontal: 15,
            marginTop: 25,
            fontSize: Constants.FONT_SIZE.M,
            color: Constants.COLOR.BLACK_COLOR,
          }}
          placeholder={'Place'}
          value={this.state.place}
          onChangeText={place => {
            this.setState({ place });
          }}
          placeholderTextColor={Constants.COLOR.FONT_HINT}
          autoCapitalize={'none'}
          returnKeyType={'next'}
          onSubmitEditing={() => this.city.focus()}
        />

        <TextInput
          ref={input => (this.city = input)}
          style={{
            paddingVertical: 15,
            backgroundColor: Constants.COLOR.WHITE_COLOR,
            borderRadius: 25,
            paddingHorizontal: 15,
            marginTop: 25,
            fontSize: Constants.FONT_SIZE.M,
            color: Constants.COLOR.BLACK_COLOR,
          }}
          placeholder={'City'}
          value={this.state.city}
          onChangeText={city => {
            this.setState({ city });
          }}
          placeholderTextColor={Constants.COLOR.FONT_HINT}
          autoCapitalize={'none'}
          returnKeyType={'next'}
          onSubmitEditing={() => this.states.focus()}
        />

        <TextInput
          ref={input => (this.states = input)}
          style={{
            paddingVertical: 15,
            backgroundColor: Constants.COLOR.WHITE_COLOR,
            borderRadius: 25,
            paddingHorizontal: 15,
            marginTop: 25,
            fontSize: Constants.FONT_SIZE.M,
            color: Constants.COLOR.BLACK_COLOR,
          }}
          placeholder={'State'}
          value={this.state.state}
          onChangeText={state => {
            this.setState({ state });
          }}
          placeholderTextColor={Constants.COLOR.FONT_HINT}
          autoCapitalize={'none'}
          returnKeyType={'next'}
          onSubmitEditing={() => this.pincode.focus()}
        />

        <TextInput
          ref={input => (this.pincode = input)}
          style={{
            paddingVertical: 15,
            backgroundColor: Constants.COLOR.WHITE_COLOR,
            borderRadius: 25,
            paddingHorizontal: 15,
            marginTop: 25,
            fontSize: Constants.FONT_SIZE.M,
            color: Constants.COLOR.BLACK_COLOR,
          }}
          keyboardType={'numeric'}
          placeholder={'Pincode'}
          value={this.state.pincode}
          onChangeText={pincode => {
            this.setState({ pincode });
          }}
          placeholderTextColor={Constants.COLOR.FONT_HINT}
          autoCapitalize={'none'}
          returnKeyType={'next'}
          onSubmitEditing={() => this.landmark.focus()}
        />
        <TextInput
          ref={input => (this.landmark = input)}
          style={{
            paddingVertical: 15,
            backgroundColor: Constants.COLOR.WHITE_COLOR,
            borderRadius: 25,
            paddingHorizontal: 15,
            marginTop: 25,
            fontSize: Constants.FONT_SIZE.M,
            color: Constants.COLOR.BLACK_COLOR,
          }}
          placeholder={'Landmark(Optional)'}
          value={this.state.landmark}
          onChangeText={landmark => {
            this.setState({ landmark });
          }}
          placeholderTextColor={Constants.COLOR.FONT_HINT}
          autoCapitalize={'none'}
          returnKeyType={'done'}
          onSubmitEditing={() => this._validateInputs()}
        />

        <TouchableOpacity
          style={{
            paddingVertical: 15,
            backgroundColor: Constants.COLOR.BUTTON_BG,
            borderRadius: 50,
            paddingHorizontal: 10,
            marginTop: 40,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
          }}
          onPress={() => {
            this._validateInputs();
          }}>
          <Text
            style={{
              color: Constants.COLOR.WHITE_COLOR,
              fontSize: Constants.FONT_SIZE.M,
              fontWeight: '600',
            }}>
            {this.props.isEditButtonTouched ? 'Update' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  _renderAddAddressView = () => {
    const { isEditButtonTouched } = this.props;
    return (
      <View style={styles.mainContainer}>
        <KeyboardAwareScrollView>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 25,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: Constants.FONT_SIZE.L,
                margin: 16,
                color: Constants.COLOR.FONT_HINT,
                fontWeight: '600',
              }}>
              {isEditButtonTouched ? 'Edit Address' : 'Add Address'}
            </Text>
            <TouchableOpacity
              disabled={this.state.closeAddressBtnDisabled}
              onPress={() => {
                this.setState({
                  closeAddressBtnDisabled: true,
                });
                this._closeClick();
                setTimeout(() => {
                  this.setState({
                    closeAddressBtnDisabled: false,
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
          {this._renderContentView()}
        </KeyboardAwareScrollView>
      </View>
    );
  };

  render() {
    if (this.props.isSubmitButtonLoading || this.props.isUpdateButtonLoading) {
      return this._screenLoading();
    } else {
      return this._renderAddAddressView();
    }
  }
}
const mapStateToProps = (state, props) => {
  const {
    addAddressState: { isSubmitButtonLoading },
    updateAddressState: { isUpdateButtonLoading },
    addressTypeState: { addressTypeList },
    configState: { distance, branchLatitude, branchLongitude },
    deviceState: { isNetworkConnectivityAvailable },
  } = state;

  return {
    isSubmitButtonLoading,
    isUpdateButtonLoading,
    addressTypeList,
    distance,
    branchLatitude,
    branchLongitude,
    isNetworkConnectivityAvailable,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      invokeSubmitAddress,
      invokeUpdateAddress,
      invokeAddressType,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddUsersScreen);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Constants.COLOR.LAB_SEARCH_SCREEN_BG,
  },
  closeImageStyle: {
    alignSelf: 'flex-end',
    margin: 16,
    width: deviceHeight / 35,
    height: deviceHeight / 35,
  },
  checkBoxView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBoxText: {
    color: '#949494',
    fontSize: Constants.FONT_SIZE.M,
  },
});




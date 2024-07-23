/* eslint-disable react-native/no-inline-styles */
/*************************************************
 * SukraasLIS
 * @exports
 * @class PatientInfo.js
 * @extends Component
 * Created by Kishore on 29/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';

import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Alert,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import Constants from '../../util/Constants';
import ButtonNext from '../common/ButtonNext';
import LabTestHeader from './LabTestHeader';
import {Actions} from 'react-native-router-flux';
import UserAddress from './UserAddress';
import ButtonBack from '../common/ButtonBack';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import LoadingScreen from '../common/LoadingScreen';
import Utility from '../../util/Utility';
import {
  getPatientList,
  getUserAddress,
  setSelectedUserAddress,
  setSelectedPatient,
  setLoginMobileNumber,
  setLoginFirmNumber,
} from '../../actions/PatientInfoAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getDistance from 'geolib/es/getDistance';

let patientInfoData = [];
class PatientInfo extends Component {
 //  static propTypes = {
  //   getPatientList: PropTypes.func,
  //   getUserAddress: PropTypes.func,
  //   arrPatientInfo: PropTypes.array,
  //   arrUserAddress: PropTypes.array,
  //   selectedAddress: PropTypes.array,
  //   selectedPatient: PropTypes.array,
  //   isPatientInfoLoading: PropTypes.bool,
  //   isUserAddressLoading: PropTypes.bool,
  //   isNetworkConnectivityAvailable: PropTypes.bool,
  //   cartCount: PropTypes.number,
  //   cartArray: PropTypes.array,
  //   cartAmount: PropTypes.string,
  //   bookingDate: PropTypes.string,
  //   bookingTime: PropTypes.string,
  //   bookingType: PropTypes.number,
  //   patientLimit: PropTypes.number,
  // };

  constructor(props) {
    super(props);
    this.state = {
      isSelected: '',
      patientName: '',
      patientTitle: '',
      btnNextDisabled: false,
      btnBackDisabled: false,
      btnAddPatientDisabled: false,
      addressSelectedValue: '',
      selectedItem: null,
      btnAddressDisabled: false,
    };
    //clearing the previous saved data
    this.props.setSelectedUserAddress('');
    this.props.setSelectedPatient('');
  }

    componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        //clearing the previous saved data
        this.props.setSelectedUserAddress('');
        this.props.setSelectedPatient('');
        this.setState({
          isSelected: '',
          patientName: '',
          patientTitle: '',
          selectedItem: null,
        });
        this._getAsyncAndAPICall();
      },
    );
  }

  // _getAsyncAndAPICall = () => {
  //   AsyncStorage.multiGet([
  //     Constants.ASYNC.ASYNC_PHONE_NUMBER,
  //     Constants.ASYNC.ASYNC_DEFAULT_FIRM_NO,
  //   ])
  //     .then(value => {
  //       this.props.setLoginMobileNumber(value[0][1]);
  //       this.props.setLoginFirmNumber(value[1][1]);
  //       this.props.getPatientList(value[0][1]);
  //       if (this.props.bookingType === 'HOME') {
  //         this.props.getUserAddress(value[0][1]);
  //       }
  //     })
  //     .done();
  // };

  _getAsyncAndAPICall = async () => {
    try {
      const values = await AsyncStorage.multiGet([
        Constants.ASYNC.ASYNC_PHONE_NUMBER,
        Constants.ASYNC.ASYNC_DEFAULT_FIRM_NO,
      ]);
      
      const mobileNumber = values[0][1];
      const firmNumber = values[1][1];
  
      this.props.setLoginMobileNumber(mobileNumber);
      this.props.setLoginFirmNumber(firmNumber);
      this.props.getPatientList(mobileNumber);
  
      if (this.props.bookingType === 'HOME') {
        this.props.getUserAddress(mobileNumber);
      }
    } catch (error) {
      console.error("Error fetching AsyncStorage values:", error);
    }
  };
  

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  /**
   * Lifecycle  callback triggered after new props received
   * @param {Object} prevProps - refers props before updating component
   */
  componentDidUpdate(prevProps) {
    const {arrPatientInfo} = this.props;
    if (prevProps.arrPatientInfo !== arrPatientInfo) {
      if (arrPatientInfo.length > 0) {
      }
    }
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 25,
          width: 10,
        }}
      />
    );
  };

  selectItem(item) {
    this.setState({
      isSelected: item.Pt_Code,
      patientName: item.Pt_Name,
      patientTitle: item.Pt_Title_Desc,
    });
  }
  userInfoList = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.selectItem(item);
          this.props.setSelectedPatient(item);
        }}>
        {this.state.isSelected === item.Pt_Code ? (
          <View style={[styles.subContainerView, {backgroundColor: '#C0C0C0'}]}>
            <Image
              source={require('../../images/userRound.png')}
              style={styles.avatar}
            />
            <Text style={{textAlign: 'center', marginRight: 5}}>
              {item.RelationShip_Name}
            </Text>
          </View>
        ) : (
          <View style={styles.subContainerView}>
            <Image
              source={require('../../images/userRound.png')}
              style={styles.avatar}
            />
            <Text style={{textAlign: 'center', marginRight: 5}}>
              {item.RelationShip_Name}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  _checkPatientLimit() {
    const {patientLimit, arrPatientInfo} = this.props;

    this.setState({
      btnAddPatientDisabled: true,
    });

    if (arrPatientInfo) {
      if (arrPatientInfo.length < patientLimit) {
        Actions.addUsersScreen({isFromAdd: true, rowData: {}});
        setTimeout(() => {
          this.setState({
            btnAddPatientDisabled: false,
          });
        }, 1000);
      } else {
        Alert.alert(
          Constants.ALERT.TITLE.FAILED,
          'Maximum patient limit is reached',
          [
            {
              text: Constants.ALERT.BTN.OK,
              onPress: () => {
                setTimeout(() => {
                  this.setState({
                    btnAddPatientDisabled: false,
                  });
                }, 1000);
              },
            },
          ],
          {cancelable: false},
        );
      }
    } else {
      if (patientLimit < 1) {
        Alert.alert(
          Constants.ALERT.TITLE.FAILED,
          'Maximum patient limit is reached',
          [
            {
              text: Constants.ALERT.BTN.OK,
              onPress: () => {
                setTimeout(() => {
                  this.setState({
                    btnAddPatientDisabled: false,
                  });
                }, 1000);
              },
            },
          ],
          {cancelable: false},
        );
      } else {
        Actions.addUsersScreen({isFromAdd: true, rowData: {}});
        setTimeout(() => {
          this.setState({
            btnAddPatientDisabled: false,
          });
        }, 1000);
      }
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView style={styles.mainView}>
        <LabTestHeader selectValue={3} />
        <View style={styles.titleView}>
          <Text style={{fontSize: Constants.FONT_SIZE.M}}>Choose Patient </Text>
          <TouchableOpacity
            disabled={this.state.btnAddPatientDisabled}
            onPress={() => {
              this._checkPatientLimit();
            }}>
            <Text style={{color: '#0F97F5', fontSize: Constants.FONT_SIZE.M}}>
              Add
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.patientView}>{this._renderPatientView()}</View>

        <View style={styles.userAddressMain}>{this._renderUserAddress()}</View>

        <View style={styles.bottomButtonsView}>
          <TouchableOpacity
            disabled={this.state.btnBackDisabled}
            onPress={() => {
              this.setState({
                btnBackDisabled: true,
              });
              Actions.pop();
              setTimeout(() => {
                this.setState({
                  btnBackDisabled: false,
                });
              }, 1000);
            }}>
            <ButtonBack />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={this.state.btnNextDisabled}
            onPress={() => {
              this.setState({
                btnNextDisabled: true,
              });
              this._nextClick();
              setTimeout(() => {
                this.setState({
                  btnNextDisabled: false,
                });
              }, 1000);
            }}>
            <ButtonNext />
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  }
  _nextClick = () => {
    if (this.props.isNetworkConnectivityAvailable) {
      if (this.props.bookingType === 'HOME') {
        console.log(this.props.selectedAddress,"this.props.selectedAddress");
        console.log(this.props.selectedPatient,"this.props.selectedAddress");
        if (
          this.props.selectedAddress.hasOwnProperty('Address_Type_Code') &&
          this.props.selectedPatient.hasOwnProperty('Pt_Code')
        ) {
          Actions.labTestPaymentDetails();
        } else {
          Utility.showAlert(
            Constants.ALERT.TITLE.ERROR,
            Constants.VALIDATION_MSG.NO_PATIENT_ADDRESS_SELECTED,
          );
        }
      } else {
        if (this.props.selectedPatient.hasOwnProperty('Pt_Code')) {
          Actions.labTestPaymentDetails();
        } else {
          Utility.showAlert(
            Constants.ALERT.TITLE.ERROR,
            Constants.VALIDATION_MSG.NO_PATIENT_SELECTED,
          );
        }
      }
    } else {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_INTERNET,
      );
    }
  };
  _renderUserAddress = () => {
    if (this.props.bookingType === 'HOME') {
      return this._renderUserAddressView();
    } else {
      return <View />;
    }
  };

  _renderPatientView = () => {
    if (this.props.isPatientInfoLoading) {
      return <LoadingScreen />;
    } else {
      if (this.props.arrPatientInfo.length > 0) {
        return (
          <View style={{flex: 1}}>
            <FlatList
              style={{alignSelf: 'center', paddingBottom: 10}}
              data={this.props.arrPatientInfo}
              extraData={this.state.isSelected}
              horizontal={true}
              renderItem={this.userInfoList}
              ItemSeparatorComponent={this.renderSeparator}
            />
            {this._renderPatientName()}
          </View>
        );
      } else {
        return (
          <View>
            <Text
              style={{
                textAlign: 'center',
                margin: 20,
              }}>
              No Data Available
            </Text>
          </View>
        );
      }
    }
  };

  _renderPatientName = () => {
    if (this.state.patientName === '') {
      return null;
    } else {
      return (
        <Text style={styles.patientNameText}>
          Patient Name :{' '}
          {` ${this.state.patientTitle} ${this.state.patientName}`}
        </Text>
      );
    }
  };

  _renderUserAddressView = () => {
    return (
      <View style={styles.mainView}>
        <View style={styles.headerTitle}>
          <Text style={{fontSize: Constants.FONT_SIZE.M}}>Choose Address </Text>
          <TouchableOpacity
            disabled={this.state.btnAddressDisabled}
            onPress={() => {
              this.setState({
                btnAddressDisabled: true,
              });
              Actions.addAddressScreen();
              setTimeout(() => {
                this.setState({
                  btnAddressDisabled: false,
                });
              }, 1000);
            }}>
            <Text style={{color: '#0F97F5', fontSize: Constants.FONT_SIZE.M}}>
              Add
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{flexDirection: 'row', marginVertical: 0, marginRight: 10}}>
          {this._renderContents()}
        </View>
      </View>
    );
  };

  _renderContents = () => {
    if (this.props.isUserAddressLoading) {
      return <LoadingScreen />;
    } else {
      if (
        this.props.arrUserAddress != null &&
        this.props.arrUserAddress.length > 0
      ) {
        return (
          <FlatList
            data={this.props.arrUserAddress}
            extraData={this.state.selectedItem}
            renderItem={this.addressList}
            ItemSeparatorComponent={this.renderSeparator}
          />
        );
      } else {
        return (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                margin: 20,
              }}>
              No Data Available
            </Text>
          </View>
        );
      }
    }
  };

  _addressClick = (item, index) => {
    // this.props.setSelectedUserAddress(item);
    this.selectItemAddress(item, index);
  };

  addressList = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this._addressClick(item, index);
        }}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.AddressContentView}>
            <Text style={{padding: 5, fontSize: Constants.FONT_SIZE.M}}>
              {item.Address_Type_Desc}
            </Text>
            <Text style={{padding: 5, fontSize: Constants.FONT_SIZE.SM}}>
              {item.Full_Address}
            </Text>
            {this._renderLandmark(item)}
          </View>
          <View style={styles.circleContentView}>
            {this.state.selectedItem === index ? (
              <View style={styles.selectedCircleShapeView} />
            ) : (
              <View style={styles.circle} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _renderLandmark = item => {
    if (
      item.Landmark !== null &&
      item.Landmark !== undefined &&
      item.Landmark !== '' &&
      item.Landmark.trim().length > 0
    ) {
      return (
        <Text style={{padding: 5, fontSize: Constants.FONT_SIZE.SM}}>
          Landmark: {item.Landmark}
        </Text>
      );
    } else {
      return <Text style={{padding: 5, fontSize: Constants.FONT_SIZE.SM}} />;
    }
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 10,
          // width: '2%',
          backgroundColor: 'white',
        }}
      />
    );
  };

  selectItemAddress(item, index) {
    if (item.Latitude === '' || item.Longitude === '') {
      Utility.showAlert(
        Constants.ALERT.TITLE.INFO,
        Constants.VALIDATION_MSG.UPDATE_ADDRESS_ON_MAP,
      );
    } else if (this.props.distance === 0) {
      this.setState({selectedItem: index});
      this.props.setSelectedUserAddress(item);
    } else {
      let calculateDistance = getDistance(
        {
          latitude: this.props.branchLatitude,
          longitude: this.props.branchLongitude,
        },
        {latitude: item.Latitude, longitude: item.Longitude},
        1,
      );
      if (calculateDistance / 1000 < this.props.distance) {
        this.setState({selectedItem: index});
        this.props.setSelectedUserAddress(item);
      } else {
        Utility.showAlert(
          Constants.ALERT.TITLE.INFO,
          Constants.VALIDATION_MSG.DISTANCE_LONG,
        );
      }
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const {
    patientInfoState: {
      isPatientInfoLoading,
      isUserAddressLoading,
      arrPatientInfo,
      arrUserAddress,
      selectedAddress,
      selectedPatient,
    },
    labTestSummaryState: {
      cartCount,
      cartArray,
      cartAmount,
      bookingDate,
      bookingTime,
      bookingType,
    },
    deviceState: {isNetworkConnectivityAvailable},
    configState: {distance, branchLatitude, branchLongitude, patientLimit},
  } = state;
  return {
    isNetworkConnectivityAvailable,
    isPatientInfoLoading,
    isUserAddressLoading,
    arrPatientInfo,
    arrUserAddress,
    selectedAddress,
    selectedPatient,
    cartCount,
    cartArray,
    cartAmount,
    bookingDate,
    bookingTime,
    bookingType,
    distance,
    branchLatitude,
    branchLongitude,
    patientLimit,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getPatientList,
      getUserAddress,
      setSelectedUserAddress,
      setSelectedPatient,
      setLoginMobileNumber,
      setLoginFirmNumber,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatientInfo);

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  patientView: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
  userAddressMain: {},
  subContainerView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 20,
    width: '90%',
    paddingHorizontal: 10,
    marginHorizontal: 10,
    backgroundColor: 'white',
  },
  avatar: {
    marginVertical: 5,
    marginHorizontal: 10,
    resizeMode: 'contain',
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    alignSelf: 'center',
    // alignItems: 'center',
  },

  bottomButtonsView: {
    marginVertical: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
  },
  patientNameText: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 10,
    fontSize: Constants.FONT_SIZE.M,
    color: Constants.COLOR.BLACK_COLOR,
    fontWeight: 'normal',
  },

  mainViewOne: {
    flex: 1,
  },
  headerTitle: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  circle: {
    width: 18,
    height: 18,
    borderRadius: 18 / 2,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    alignSelf: 'center',
    marginHorizontal: 8,
    marginVertical: 16,
    borderColor: '#ACACAC',
    borderWidth: 5,
  },
  selectedCircleShapeView: {
    width: 18,
    height: 18,
    borderRadius: 18 / 2,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    alignSelf: 'center',
    marginHorizontal: 8,
    marginVertical: 16,
    borderColor: Constants.COLOR.LAB_CHOOSE_BG,
    borderWidth: 5,
  },
  AddressContentView: {
    flex: 5,
    backgroundColor: '#F7F7F7',
    padding: 20,
    marginLeft: 10,
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  circleContentView: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    margin: 0,
    flexDirection: 'row-reverse',
  },
});

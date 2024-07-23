
/*************************************************
 * SukraasLIS
 * @exports
 * @class AddUsersScreen.js
 * @extends Component
 * Created by Monisha on 29/05/2020
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
  Platform,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Constants from '../util/Constants';
import Utility from '../util/Utility';
import { Actions } from 'react-native-router-flux';
import { Dropdown } from 'react-native-material-dropdown-v2';
import DatePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from './common/LoadingScreen';
import {
  invokeGetGender,
  invokeGetRelationShip,
  invokeAddPatient,
  invokeUpdatePatient,
  invokeGetTitle,
  invokeGetPatientList,
  invokeGetPatientNonLinked,
  invokeSendOtpPatientLink,
  invokeVerifyOtpPatientLink,
} from '../actions/AddPatientAction';
import { bindActionCreators } from 'redux';
import store from '../store';
import moment from 'moment';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class AddUsersScreen extends Component {
  ////  static propTypes = {
  //   genderList: PropTypes.array,
  //   relationList: PropTypes.array,
  //   linkedPatientList: PropTypes.array,
  //   invokeGetGender: PropTypes.func,
  //   invokeGetTitle: PropTypes.func,
  //   invokeAddPatient: PropTypes.func,
  //   invokeUpdatePatient: PropTypes.func,
  //   invokeGetRelationShip: PropTypes.func,
  //   invokeGetPatientList: PropTypes.func,
  //   invokeGetPatientNonLinked: PropTypes.func,
  //   invokeSendOtpPatientLink: PropTypes.func,
  //   invokeVerifyOtpPatientLink: PropTypes.func,

  //   title: PropTypes.object,
  //   rowData: PropTypes.object,
  //   isSubmitPatientLoading: PropTypes.bool,
  // };

  constructor(props) {
    super(props);
    if (this.props.isFromAdd) {
      this.state = {
        phoneNumber: '',
        title: 'Add Member',
        name: '',
        dob: '',
        showDatePicker: false,
        gender: '',
        relation: '',
        userPhoneNumber: '',
        gender_code: '',
        relationship_code: '',
        relation_sex_code: '',
        closeUserBtnDisabled: false,
        patientTitle: '',
        titleCode: '',
        isShowPopup: false,
        selectedItemIndex: -1,
        selectedPatientCode: '',
        isDisableMobileNumber: true,
        userOTP: '',
        otpText: 'Send OTP',
        isOtpVerified: false,
      };
    } else {
      this.state = {
        Pt_Code: this.props.rowData.Pt_Code,
        phoneNumber: '',
        title: 'Edit Member',
        name: this.props.rowData.Pt_Name,
        // dob: moment(this.props.rowData.Pt_Dob, 'YYYY/MM/DD').format(
        //   'DD/MM/YYYY',
        // ),
        dob: moment(this.props.rowData.Pt_Dob, 'YYYY/MM/DD').format('YYYY-MM-DD'),
        gender: this.props.rowData.Pt_Gender,
        relation: this.props.rowData.RelationShip_Name,
        userPhoneNumber: this.props.rowData.Pt_Mobile_No,
        gender_code: this.props.rowData.gender_code,
        relationship_code: this.props.rowData.RelationShip_Code,
        relation_sex_code: this.props.rowData.relation_sex_code,
        closeUserBtnDisabled: false,
        patientTitle: this.props.rowData.Pt_Title_Desc,
        titleCode: this.props.rowData.Pt_Title_Code,
        isDisableMobileNumber: true,
        userOTP: '',
        isOtpVerified: false,
      };
    }
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
      this.props.invokeGetGender();
      this.props.invokeGetRelationShip();
      this.props.invokeGetTitle();
      await AsyncStorage.getItem(Constants.ASYNC.ASYNC_PHONE_NUMBER)
        .then(value => {
          this.setState({ phoneNumber: value });
        })
        .done();
    } else {
      this.internetAlert(Constants.VALIDATION_MSG.NO_INTERNET);
    }
  }

  _closeClick = () => {
    Actions.pop();
  };

  _validateInputs() {
    if (this.state.patientTitle.trim() === '') {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_TITLE,
      );
    } else if (this.state.name.trim() === '') {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_NAME,
      );
    } else if (this.state.dob.trim() === '') {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_DOB,
      );
    } else if (this.state.gender.trim() === '') {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_GENDER,
      );
    } else if (this.state.userPhoneNumber.trim() < 5) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_MOBILE_NO,
      );
    } else if (this.state.relationship_code.trim() === '') {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_RELATION,
      );
    } else if (!this.state.isDisableMobileNumber && !this.state.isOtpVerified) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.OTP_VERIFY_CHECK,
      );
    } else {
      this._submitClick();
    }
  }

  _submitClick = () => {
    this.props.isFromAdd === true ? this._callAdd() : this._callUpdate();
  };

  _callAdd = () => {
    this.props.invokeAddPatient(
      this.state.phoneNumber,
      this.state.name,
      moment(this.state.dob, 'YYYY-MM-DD').format('YYYY/MM/DD'),
      // moment(this.state.dob, 'YYYY-MM-DD').format('YYYY-MM-DD'),
      this.state.gender,
      this.state.userPhoneNumber,
      this.state.relationship_code,
      this.state.titleCode,
      this.state.selectedPatientCode,
    );
  };

  _callUpdate = () => {
    this.props.invokeUpdatePatient(
      this.state.Pt_Code,
      this.state.phoneNumber,
      this.state.name,
      moment(this.state.dob, 'YYYY-MM-DD').format('YYYY/MM/DD'),
      // moment(this.state.dob, 'YYYY-MM-DD').format('YYYY-MM-DD'),
      this.state.gender,
      this.state.userPhoneNumber,
      this.state.relationship_code,
      this.state.titleCode,
    );
  };

  _renderContentView() {
    // const formattedDate = this.state.dob ? moment(this.state.dob).format('DD/MM/YYYY') : '';
    const formattedDate = this.state.dob ? moment(this.state.dob, 'YYYY-MM-DD').format('DD/MM/YYYY') : '';

    const _generateDateObject = (dateString) => {
      const [day, month, year] = dateString.split('/').map(Number);
      const dateObject = new Date(year, month - 1, day);
      return dateObject;
    }
    return (
      <View style={{ paddingHorizontal: 20, paddingVertical: 10, top: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            maxLength={15}
            style={[
              styles.inputNumberStyle,
              this.props.isFromAdd
                ? {
                  borderBottomLeftRadius: 25,
                  borderTopLeftRadius: 25,
                }
                : { borderRadius: 25 },
            ]}
            placeholder={'Phone Number'}
            editable={this.state.isDisableMobileNumber}
            value={this.state.userPhoneNumber}
            keyboardType="number-pad"
            onChangeText={userPhoneNumber => {
              this.setState({
                userPhoneNumber: userPhoneNumber.replace(/[^0-9]/g, ''),
              });
            }}
            placeholderTextColor={Constants.COLOR.FONT_HINT}
            autoCapitalize={'none'}
            returnKeyType={'next'}
          />
          {this.props.isFromAdd ? (
            <TouchableOpacity
              style={{
                flex: 0.5,
                backgroundColor: Constants.COLOR.WHITE_COLOR,
                paddingVertical: Platform.OS ? 27 : 29,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 25,
                borderBottomEndRadius: 25,
                borderTopRightRadius: 25,
              }}
              onPress={() => {
                if (this.state.isDisableMobileNumber) {
                  if (this.state.userPhoneNumber !== '') {
                    this._onPhoneNumberSubmit();
                  } else {
                    Utility.showAlert(
                      Constants.ALERT.TITLE.ERROR,
                      Constants.VALIDATION_MSG.NO_MOBILE_NO,
                    );
                  }
                } else {
                  this._setEmptyInput();
                }
              }}>
              {this.state.isDisableMobileNumber ? (
                <Image
                  style={[styles.linkImageStyle]}
                  source={require('../images/search.png')}
                  resizeMode="contain"
                />
              ) : (
                <Image
                  style={[styles.linkImageStyle]}
                  source={require('../images/black_cross.png')}
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>
          ) : null}
        </View>
        <View>
          <Dropdown
            containerStyle={{
              backgroundColor: Constants.COLOR.WHITE_COLOR,
              borderRadius: 25,
              marginTop: 25,
            }}
            lineWidth={0}
            value={this.state.patientTitle}
            inputContainerStyle={{
              paddingVertical: 15,
              backgroundColor: Constants.COLOR.WHITE_COLOR,
              borderRadius: 25,
              paddingHorizontal: 15,
              marginTop: 10,
            }}
            placeholder="Title"
            dropdownPosition={-5.5}
            placeholderTextColor={Constants.COLOR.FONT_HINT}
            data={this.props.titleList}
            fontSize={Constants.FONT_SIZE.L}
            valueExtractor={({ Title_Desc }) => Title_Desc}
            dropdownOffset={{ top: 0, left: 0 }}
            pickerStyle={{
              position: 'absolute',
              borderRadius: 10,
              width: deviceWidth - 40,
              left: 20,
            }}
            selectedItemColor={
              this.state.gender == ''
                ? Constants.COLOR.FONT_HINT
                : Constants.COLOR.THEME_COLOR
            }
            onChangeText={(Title_Desc, index, data) => [
              this.setState({ patientTitle: Title_Desc }),
              this.setState({ titleCode: data[index].Title_Code }),
            ]}
          />

          <TextInput
            ref={input => (this.name = input)}
            style={{
              marginTop: 25,
              paddingVertical: 15,
              backgroundColor: Constants.COLOR.WHITE_COLOR,
              borderRadius: 25,
              paddingHorizontal: 15,
              fontSize: Constants.FONT_SIZE.L,
              color: Constants.COLOR.BLACK_COLOR,
            }}
            placeholder={'Name'}
            value={this.state.name}
            onChangeText={name => {
              this.setState({ name });
            }}
            placeholderTextColor={Constants.COLOR.FONT_HINT}
            autoCapitalize={'none'}
            returnKeyType={'next'}
          />
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ position: 'relative', flex: 1 }}>
                  <TextInput
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 15,
                      backgroundColor: '#fff',
                      borderRadius: 25,
                      marginTop: 25,
                      width: '100%',
                    }}
                    onFocus={() => this.setState({ showDatePicker: true })}
                    placeholder="Select DOB"
                    value={formattedDate}
                    editable={false}
                  />
                  <TouchableWithoutFeedback onPress={() => this.setState({ showDatePicker: true })}>
                    <View style={{ position: 'absolute', right: 15, top: 40 }}>
                      <Image
                        source={require('../images/calenderIcon.jpg')}
                        style={{ width: 20, height: 20 }}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
              {this.state.showDatePicker && (
                <DatePicker
                  value={this.state.dob ? _generateDateObject(this.state.dob) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      this.setState({ dob: selectedDate.toISOString().split('T')[0] });
                    }
                    this.setState({ showDatePicker: false });
                  }}
                />
              )}
            </View>
          </TouchableWithoutFeedback>

          <Dropdown
            containerStyle={{
              backgroundColor: Constants.COLOR.WHITE_COLOR,
              borderRadius: 25,
              marginTop: 25,
            }}
            lineWidth={0}
            value={this.state.gender}
            inputContainerStyle={{
              paddingVertical: 15,
              backgroundColor: Constants.COLOR.WHITE_COLOR,
              borderRadius: 25,
              paddingHorizontal: 15,
              marginTop: 10,
            }}
            placeholder="Sex"
            dropdownPosition={-5.5}
            placeholderTextColor={Constants.COLOR.FONT_HINT}
            data={this.props.genderList}
            fontSize={Constants.FONT_SIZE.L}
            valueExtractor={({ Gender_Desc }) => Gender_Desc}
            dropdownOffset={{ top: 0, left: 0 }}
            pickerStyle={{
              position: 'absolute',
              borderRadius: 10,
              width: deviceWidth - 40,
              left: 20,
            }}
            selectedItemColor={
              this.state.gender == ''
                ? Constants.COLOR.FONT_HINT
                : Constants.COLOR.THEME_COLOR
            }
            onChangeText={(Gender_Desc, index, data) => [
              this.setState({ gender: Gender_Desc }),
              this.setState({ gender_code: data[index].Gender_Code }),
            ]}
          />
          <Dropdown
            containerStyle={{
              backgroundColor: Constants.COLOR.WHITE_COLOR,
              borderRadius: 25,
              marginTop: 25,
            }}
            lineWidth={0}
            value={this.state.relation}
            inputContainerStyle={{
              paddingVertical: 15,
              backgroundColor: Constants.COLOR.WHITE_COLOR,
              borderRadius: 25,
              paddingHorizontal: 15,
              marginTop: 10,
            }}
            dropdownPosition={-5.5}
            placeholder="Patient Relation"
            pickerStyle={{
              position: 'absolute',
              borderRadius: 10,
              width: deviceWidth - 40,
              left: 20,
            }}
            placeholderTextColor={Constants.COLOR.FONT_HINT}
            data={this.props.relationList}
            fontSize={Constants.FONT_SIZE.L}
            valueExtractor={({ RelationShip_Desc }) => RelationShip_Desc}
            dropdownOffset={{ top: 0, left: 0 }}
            rippleInsets={{ top: 10, bottom: 10, right: 0, left: 0 }}
            selectedItemColor={
              this.state.relation == ''
                ? Constants.COLOR.FONT_HINT
                : Constants.COLOR.THEME_COLOR
            }
            onChangeText={(RelationShip_Desc, index, data) => [
              this.setState({ relation: RelationShip_Desc }),
              this.setState({ relationship_code: data[index].RelationShip_Code }),
              this.setState({ relation_sex_code: data[index].Sex_Code }),
            ]}
          />

          {!this.state.isDisableMobileNumber ? this._renderOtpSection() : null}
          <TouchableOpacity
            style={{
              backgroundColor: Constants.COLOR.BUTTON_BG,
              borderRadius: 50,
              paddingHorizontal: 10,
              marginTop: 30,
              marginBottom: 150,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 11,
            }}
            onPress={() => {
              this._validateInputs();
            }}>
            <Text
              style={{
                color: Constants.COLOR.WHITE_COLOR,
                fontSize: Constants.FONT_SIZE.L,
                fontWeight: '600',
              }}>
              {this.props.isFromAdd === true ? (
                <Text>Submit</Text>
              ) : (
                <Text>Update</Text>
              )}
            </Text>
          </TouchableOpacity>
        </View>
        {this.props.linkedPatientList.length > 0 && this.props.isFromAdd ? (
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.isShowPopup}>
            <View style={[styles.containerModal]}>
              <View>
                <View style={styles.subContainerModal}>
                  <TouchableOpacity
                    onPress={() => {
                      this._setEmptyInput();
                      this.setState({ isShowPopup: false });
                    }}>
                    <Image
                      style={[styles.closeImageStyle]}
                      source={require('../images/black_cross.png')}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>

                  {this.props.isShowPatientListLoading ? (
                    <LoadingScreen />
                  ) : (
                    <FlatList
                      data={this.props.linkedPatientList}
                      extraData={this.state.selectedItemIndex}
                      renderItem={this.patientListItem}
                      ItemSeparatorComponent={this.renderSeparator}
                    />
                  )}
                  {this.props.isShowPatientListLoading ? null : (
                    <TouchableOpacity
                      style={{
                        paddingVertical: 15,
                        backgroundColor: 'green',
                        borderRadius: 50,
                        paddingHorizontal: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginHorizontal: 30,
                        marginVertical: 10,
                      }}
                      onPress={() => {
                        if (this.state.selectedItemIndex === -1) {
                          Utility.showAlert(
                            Constants.ALERT.TITLE.ERROR,
                            Constants.VALIDATION_MSG.NO_PATIENT,
                          );
                        } else {
                          this._getPatientLinkDetails();
                        }
                      }}>
                      <Text
                        style={{
                          color: Constants.COLOR.WHITE_COLOR,
                          fontSize: Constants.FONT_SIZE.L,
                          fontWeight: '600',
                        }}>
                        Submit
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </Modal>
        ) : null}
      </View>
    );
  }

  _renderOtpSection = () => {
    return (
      <View style={{ marginTop: 10 }}>
        <Text
          style={{
            fontSize: Constants.FONT_SIZE.L,
            color: Constants.COLOR.FONT_HINT,
            paddingVertical: 10,
            marginLeft: 8,
          }}>
          Enter Your Verification Code
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            maxLength={15}
            style={[
              styles.otpNumberStyle,
              this.props.isFromAdd
                ? {
                  borderBottomLeftRadius: 25,
                  borderTopLeftRadius: 25,
                }
                : { borderRadius: 25 },
              {
                paddingVertical: Platform.OS === 'ios' ? 12 : 14,
              },
            ]}
            placeholder={'Code'}
            editable={!this.state.isOtpVerified}
            value={this.state.userOTP}
            keyboardType="number-pad"
            onChangeText={userOTP => {
              this.setState({
                userOTP: userOTP.replace(/[^0-9]/g, ''),
              });
            }}
            placeholderTextColor={Constants.COLOR.FONT_HINT}
            autoCapitalize={'none'}
            returnKeyType={'done'}
            onSubmitEditing={() => {
              this._onOtpVerification();
            }}
          />
          {this.props.isFromAdd ? (
            <TouchableOpacity
              disabled={this.state.isOtpVerified}
              style={{
                flex: 1.5,
                backgroundColor: Constants.COLOR.WHITE_COLOR,
                paddingVertical: Platform.OS === 'ios' ? 2 : 14,
                alignItems: 'center',
                borderBottomEndRadius: 25,
                borderTopRightRadius: 25,
                borderLeftColor: '#808080',
                borderLeftWidth: 0.5,
              }}
              onPress={() => {
                if (this.state.userOTP !== '') {
                  this._onOtpVerification();
                } else {
                  Utility.showAlert(
                    Constants.ALERT.TITLE.ERROR,
                    Constants.VALIDATION_MSG.NO_OTP,
                  );
                }
              }}>
              {this.state.isOtpVerified ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#008000',
                      fontWeight: 'bold',
                      fontSize: Constants.FONT_SIZE.M,
                      paddingHorizontal: 5,
                    }}>
                    Verified
                  </Text>
                  <Image
                    style={{
                      tintColor: '#008000',
                      width: deviceHeight / 38,
                      height: deviceHeight / 38,
                      paddingHorizontal: 5,
                    }}
                    source={require('../images/roundTick.png')}
                    resizeMode="contain"
                  />
                </View>
              ) : (
                <Text
                  style={{
                    color: '#808080',
                    fontWeight: 'bold',
                    fontSize: Constants.FONT_SIZE.M,
                    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
                  }}>
                  Verify
                </Text>
              )}
            </TouchableOpacity>
          ) : null}
        </View>
        {!this.state.isOtpVerified ? (
          <TouchableOpacity
            style={styles.otpButton}
            onPress={() => {
              this._onSendOTP();
            }}>
            <Text style={styles.otpText}>{this.state.otpText}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };
  patientListItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this._onClickPatient(item, index);
        }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.patientContentView}>
            <Text style={{ padding: 2, fontSize: Constants.FONT_SIZE.M }}>
              {item.Pt_Name +
                ' , ' +
                item.Pt_First_Age +
                'Y' +
                ' , ' +
                item.Pt_Gender}
            </Text>
            <Text style={{ padding: 2, fontSize: Constants.FONT_SIZE.SM }}>
              {moment(item.Pt_Dob, 'YYYY/MM/DD').format('DD/MM/YYYY')}
            </Text>
          </View>
          <View style={styles.circleContentView}>
            {this.state.selectedItemIndex === index ? (
              <View style={styles.selectedCircleShapeView} />
            ) : (
              <View style={styles.circle} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _onClickPatient = (item, index) => {
    this.setState({
      selectedItemIndex: index,
      selectedPatientCode: item.Pt_Code,
    });
  };
  _getPatientLinkDetails = () => {
    this.setState(
      {
        isShowPopup: false,
      },
      () => {
        this.props.invokeGetPatientNonLinked(
          this.state.phoneNumber,
          this.state.selectedPatientCode,
          (isSuccess, data) => {
            if (isSuccess) {
              this.setState({
                name: data.Patient_Name,
                dob: moment(data.DOB, 'YYYY/MM/DD').format('DD/MM/YYYY'),
                gender: data.Gender,
                relation: '',
                userPhoneNumber: data.Mobile_No,
                gender_code: data.Gender_Code,
                relationship_code: '',
                relation_sex_code: '',
                patientTitle: data.Title_Desc,
                titleCode: data.Title_Code,
                selectedPatientCode: data.Patient_Code,
                isDisableMobileNumber: false,
              });
            } else {
              this._setEmptyInput();
            }
          },
        );
      },
    );
  };

  _renderOtpSection = () => {
    return (
      <View style={{ marginTop: 10 }}>
        <Text
          style={{
            fontSize: Constants.FONT_SIZE.L,
            color: Constants.COLOR.FONT_HINT,
            paddingVertical: 10,
            marginLeft: 8,
          }}>
          Enter Your Verification Code
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            maxLength={15}
            style={[
              styles.otpNumberStyle,
              this.props.isFromAdd
                ? {
                  borderBottomLeftRadius: 25,
                  borderTopLeftRadius: 25,
                }
                : { borderRadius: 25 },
              {
                paddingVertical: Platform.OS === 'ios' ? 12 : 14,
              },
            ]}
            placeholder={'Code'}
            editable={!this.state.isOtpVerified}
            value={this.state.userOTP}
            keyboardType="number-pad"
            onChangeText={userOTP => {
              this.setState({
                userOTP: userOTP.replace(/[^0-9]/g, ''),
              });
            }}
            placeholderTextColor={Constants.COLOR.FONT_HINT}
            autoCapitalize={'none'}
            returnKeyType={'done'}
            onSubmitEditing={() => {
              this._onOtpVerification();
            }}
          />
          {this.props.isFromAdd ? (
            <TouchableOpacity
              disabled={this.state.isOtpVerified}
              style={{
                flex: 1.5,
                backgroundColor: Constants.COLOR.WHITE_COLOR,
                paddingVertical: Platform.OS === 'ios' ? 2 : 14,
                alignItems: 'center',
                borderBottomEndRadius: 25,
                borderTopRightRadius: 25,
                borderLeftColor: '#808080',
                borderLeftWidth: 0.5,
              }}
              onPress={() => {
                if (this.state.userOTP !== '') {
                  this._onOtpVerification();
                } else {
                  Utility.showAlert(
                    Constants.ALERT.TITLE.ERROR,
                    Constants.VALIDATION_MSG.NO_OTP,
                  );
                }
              }}>
              {this.state.isOtpVerified ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#008000',
                      fontWeight: 'bold',
                      fontSize: Constants.FONT_SIZE.M,
                      paddingHorizontal: 5,
                      paddingVertical: Platform.OS === 'ios' ? 12 : 14,
                    }}>
                    Verified
                  </Text>
                  <Image
                    style={{
                      tintColor: '#008000',
                      width: deviceHeight / 38,
                      height: deviceHeight / 38,
                      paddingHorizontal: 5,
                    }}
                    source={require('../images/roundTick.png')}
                    resizeMode="contain"
                  />
                </View>
              ) : (
                <Text
                  style={{
                    color: '#808080',
                    fontWeight: 'bold',
                    fontSize: Constants.FONT_SIZE.M,
                    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
                  }}>
                  Verify
                </Text>
              )}
            </TouchableOpacity>
          ) : null}
        </View>
        {!this.state.isOtpVerified ? (
          <TouchableOpacity
            style={styles.otpButton}
            onPress={() => {
              this._onSendOTP();
            }}>
            <Text style={styles.otpText}>{this.state.otpText}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };
  _onSendOTP = () => {
    this.props.invokeSendOtpPatientLink(
      this.state.phoneNumber,
      this.state.selectedPatientCode,
      this.state.userPhoneNumber,
      isSuccess => {
        if (isSuccess) {
          this.setState({ otpText: 'Resend OTP' });
        }
      },
    );
  };
  _onOtpVerification = () => {
    this.props.invokeVerifyOtpPatientLink(
      this.state.phoneNumber,
      this.state.selectedPatientCode,
      this.state.userOTP,
      isSuccess => {
        if (isSuccess) {
          this.setState({ isOtpVerified: true });
        }
      },
    );
  };
  _setEmptyInput = () => {
    this.setState({
      name: '',
      dob: '',
      gender: '',
      relation: '',
      userPhoneNumber: '',
      gender_code: '',
      relationship_code: '',
      relation_sex_code: '',
      patientTitle: '',
      titleCode: '',
      selectedPatientCode: '',
      isDisableMobileNumber: true,
      selectedItemIndex: -1,
      userOTP: '',
      otpText: 'Send OTP',
      isOtpVerified: false,
    });
  };
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 2,
          backgroundColor: 'white',
        }}
      />
    );
  };

  _onPhoneNumberSubmit = () => {
    this.props.invokeGetPatientList(
      this.state.phoneNumber,
      this.state.userPhoneNumber,
      isSuccess => {
        if (isSuccess) {
          this.setState({
            isShowPopup: true,
          });
        } else {
          this.setState({
            name: '',
            dob: '',
            gender: '',
            relation: '',
            gender_code: '',
            relationship_code: '',
            relation_sex_code: '',
            patientTitle: '',
            titleCode: '',
          });
        }
      },
    );
  };

  _renderAddPatientView = () => {
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
              {this.state.title}
            </Text>
            <TouchableOpacity
              disabled={this.state.closeUserBtnDisabled}
              onPress={() => {
                this.setState({
                  closeUserBtnDisabled: true,
                });
                this._closeClick();
                setTimeout(() => {
                  this.setState({
                    closeUserBtnDisabled: false,
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
    if (this.props.isSubmitPatientLoading) {
      return this._screenLoading();
    } else {
      return this._renderAddPatientView();
    }
  }

  _screenLoading = () => {
    return <LoadingScreen />;
  };
}

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
  loginText: {
    color: 'white',
    fontSize: Constants.FONT_SIZE.L,
  },
  textinput: {
    flex: 1,
    color: Constants.COLOR.THEME_COLOR_2,
    padding: 5,
    fontSize: Constants.FONT_SIZE.L,
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
  patientContentView: {
    flex: 5,
    backgroundColor: '#F7F7F7',
    padding: 5,
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  circleContentView: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    margin: 0,
    flexDirection: 'row-reverse',
  },
  containerModal: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subContainerModal: {
    width: deviceWidth - 40,
    height: deviceHeight - 80,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    borderColor: Constants.COLOR.WHITE_COLOR,
    elevation: 2,
  },
  linkImageStyle: {
    alignSelf: 'flex-end',
    width: deviceHeight / 35,
    height: deviceHeight / 35,
    position: 'absolute',
    right: 20,
  },
  inputNumberStyle: {
    marginTop: 25,
    paddingVertical: 15,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    paddingHorizontal: 15,
    fontSize: Constants.FONT_SIZE.L,
    color: Constants.COLOR.BLACK_COLOR,
    flex: 2,
  },
  otpNumberStyle: {
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    paddingHorizontal: 15,
    fontSize: Constants.FONT_SIZE.L,
    color: Constants.COLOR.BLACK_COLOR,
    flex: 2,
  },
  otpButton: {
    width: deviceWidth - 40,
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 20,
    alignSelf: 'flex-end',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#58afff',
  },
  otpText: {
    color: '#58afff',
    fontSize: Constants.FONT_SIZE.M,
    textAlign: 'center',
    paddingVertical: 11,
  },
});
const mapStateToProps = (state, props) => {
  const {
    genderState: { genderList, isSubmitPatientLoading },
    relationState: { relationList, linkedPatientList, isShowPatientListLoading },
    patientTitleState: { titleList },
    deviceState: { isNetworkConnectivityAvailable },
  } = state;

  return {
    genderList,
    relationList,
    isSubmitPatientLoading,
    titleList,
    linkedPatientList,
    isNetworkConnectivityAvailable,
    isShowPatientListLoading,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      invokeGetGender,
      invokeGetRelationShip,
      invokeAddPatient,
      invokeUpdatePatient,
      invokeGetTitle,
      invokeGetPatientList,
      invokeGetPatientNonLinked,
      invokeSendOtpPatientLink,
      invokeVerifyOtpPatientLink,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddUsersScreen);

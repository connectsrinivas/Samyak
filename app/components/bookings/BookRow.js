/* eslint-disable react-native/no-inline-styles */
/*************************************************
 * SukraasLIS
 * @exports
 * @class BookingRow.js
 * @extends Component
 * Created by Sankar on 12/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  Platform,
} from 'react-native';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import moment from 'moment';
import { Actions } from 'react-native-router-flux';
const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
import store from '../../store';

const deviceWidth = Dimensions.get('window').width;

class BookRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: '',
    };
  }
  render() {
    const month = this.props.rowData.Visit_Date;
    const date = moment(month, 'YYYY/MM/DD');
    const monthName = date.format('MMMM');
    const formatedDate = date.format('DD,YYYY');
    return (

      <View style={styles.mainContainer}>
        <View style={styles.subViewContainerOne}>
          <Text style={styles.monthTextStyle}>{monthName}</Text>
          <Text style={[styles.dateTimeTextStyle, { alignSelf: 'flex-end' }]}>
            {formatedDate}
          </Text>
          <View style={styles.timeBackground}>
            <Text style={[styles.dateTimeTextStyle, { alignSelf: 'center' }]}>
              {this.props.rowData.Visit_Time}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.subViewContainerTwo,
            { backgroundColor: this.props.rowData.BookingType_ColorCode },
            // this.props.rowData.Booking_Type === 'W'
            //   ? {backgroundColor: '#DEDEDE'}
            //   : {},
          ]}>
          <View style={{ flexDirection: 'row', paddingHorizontal: 5 }}>
            <Text
              style={[styles.addressTextStyle, { width: deviceHeight / 5 }]}
              numberOfLines={2}>
              {this.props.rowData.Pt_Title_Desc} {this.props.rowData.Pt_Name},{' '}
              {this.props.rowData.Pt_First_Age},{' '}
              {this.props.rowData.Pt_Relation_Desc}
            </Text>
            <View
              style={{
                padding: 5,
                flex: 1,
                flexDirection: 'row',
                paddingHorizontal: 15,
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <Image
                style={{
                  width: deviceHeight / 35,
                  height: deviceHeight / 35,
                  marginHorizontal: 5,
                }}
                source={require('../../images/placeholder.png')}
              />
              <Text
                style={{ alignSelf: 'center', color: 'red' }}
                numberOfLines={1}>
                {this.props.rowData.Branch_Name}
              </Text>
            </View>
          </View>

          <View style={styles.bookingIdMainView}>
            <View style={styles.bookingIdSubViewOne}>
              <View style={styles.rowDirectionView}>
                <Image
                  source={require('../../images/booking_id_img.png')}
                  style={styles.imageStyle}
                />
                <Text style={styles.bookingIdTextStyle}>
                  {this.props.rowData.Booking_No}
                </Text>
              </View>
              {this._displayEditView()}
            </View>
            <View style={styles.bookingIdSubViewTwo}>
              {this._displayPayNow()}
              <Image
                source={require('../../images/next.png')}
                style={styles.nextImageStyle}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row' }}>
            {this.props.rowData.Booking_Status_Desc !== '' ? (
              <View
                style={[
                  styles.tagBackgroundView,
                  this.props.rowData.isBookingCompleted
                    ? { backgroundColor: Constants.COLOR.BOOK_SUBMITTED_BG }
                    : { backgroundColor: Constants.COLOR.BOOK_PENDING_BG },
                ]}>
                <Text style={[styles.statusTextStyleView]}>
                  {this.props.rowData.Booking_Status_Desc}
                </Text>
              </View>
            ) : (
              <View style={[styles.tagBackgroundView]}>
                <Text style={[styles.statusTextStyleView]} />
              </View>
            )}
            {this._renderPhoneNo()}
          </View>
        </View>
      </View>

    );
  }

  _renderPhoneNo = () => {
    if (
      this.props.rowData.Collector_Mobile_No !== undefined &&
      this.props.rowData.Collector_Mobile_No.trim().length > 0
    ) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.dialCall(this.props.rowData.Collector_Mobile_No);
          }}
          style={[
            styles.tagBackground,
            { backgroundColor: Constants.COLOR.BOOK_PHONE_BG },
          ]}>
          <View style={styles.circleBackground}>
            <Image
              style={styles.callImage}
              source={require('../../images/callIcon.png')}
            />
          </View>
          <Text style={[styles.statusTextStyle, { marginStart: 3 }]}>
            {this.props.rowData.Collector_Mobile_No}
          </Text>
        </TouchableOpacity>
      );
    } else {
      return <View style={([styles.tagBackground], { flex: 0.95 })} />;
    }
  };

  dialCall(number) {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  }

  _displayPayNow = () => {
    if (this.props.rowData.Due_Amount === 0) {
      return <View />;
    } else {
      if (
        this.props.rowData.Due_Amount > 0 &&
        this.props.rowData.Is_Cancelled === false
      ) {
        return (
          <TouchableOpacity
            style={styles.blueBackground}
            onPress={() => {
              this._payNowClick(this.props.rowData);
            }}>
            <Text style={styles.payNowText}> Pay Now </Text>
          </TouchableOpacity>
        );
      } else {
        return <View />;
      }
    }
  };

  _payNowClick = rowDataJson => {
    let invoiceNumber =
      '000000000000' + Math.floor(10000000 + Math.random() * 90000000);
    let orderBookingData = {
      UserName: store.getState().configState.mobileNo,
      Firm_No: rowDataJson.Firm_No,
      Booking_Type: rowDataJson.Booking_Type,
      Booking_Date: rowDataJson.Booking_Date,
      Booking_Time: rowDataJson.Booking_Time,
      Booking_No: rowDataJson.Booking_No,
      Paid_Amount: rowDataJson.Due_Amount,
      Due_Amount: rowDataJson.Due_Amount,
      Pay_Ref_No: '',
      Pay_Mode: 'O',
      Pay_Request_Ref_No: '',
    };

    Actions.payumoney({
      isPayNow: true,
      ptName: rowDataJson.Pt_Name,
      phoneNo: store.getState().configState.mobileNo,
      InvoiceNumber: invoiceNumber,
      orderData: orderBookingData,
      postBodyData: orderBookingData,
      Amount_Payable: rowDataJson.Due_Amount,
      productinfo: rowDataJson.Booking_No,
    });
  };

  _displayEditView = () => {
    if (this.props.rowData.Sid_No.trim().length > 0) {
      return (
        <View style={styles.rowDirectionView}>
          <Image
            resizeMode="contain"
            source={require('../../images/sample_id_img.png')}
            style={styles.imageStyle}
          />
          <Text style={styles.bookingIdTextStyle}>
            {this.props.rowData.Sid_No}
          </Text>
        </View>
      );
    } else {
      return <View />;
    }
  };
}

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 8,
    marginHorizontal: 10,
    flexDirection: 'row',
    flex: 1,
    height: Platform.OS === 'android' ? deviceHeight / 6.5 : null,
  },
  subViewContainerOne: {
    flex: 1,
    backgroundColor: Constants.COLOR.BOOK_LEFT_SIDE_BG,
    borderBottomStartRadius: 25,
    borderTopStartRadius: 25,
    justifyContent: 'space-between',
  },
  subViewContainerTwo: {
    flex: 2,
    justifyContent: 'space-around',
    borderWidth: 0.3,
    borderColor: 'gray',
    borderBottomEndRadius: 25,
    borderTopEndRadius: 25,
  },
  monthTextStyle: {
    marginTop: 5,
    fontSize: Constants.FONT_SIZE.L,
    color: Constants.COLOR.BOOK_DATE_TIME_TEXT_COLOR,
    alignSelf: 'flex-end',
    paddingVertical: 4,
    paddingEnd: 10,
  },
  dateTimeTextStyle: {
    fontSize: Constants.FONT_SIZE.SM,
    color: Constants.COLOR.BOOK_DATE_TIME_TEXT_COLOR,
    paddingVertical: 4,
    paddingEnd: 10,
  },
  addressTextStyle: {
    alignSelf: 'flex-start',
    fontSize: Constants.FONT_SIZE.SM,
    padding: 5,
    color: Constants.COLOR.BOOK_ADDRESS_TEXT_COLOR,
    fontWeight: 'bold',
  },
  bookingIdMainView: {
    flexDirection: 'row',
    marginLeft: 10,
    flex: 1,
  },
  bookingIdSubViewOne: {
    flexDirection: 'row',
    alignSelf: 'center',
    flex: 1.5,
  },
  bookingIdSubViewTwo: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  bookingIdTextStyle: {
    alignSelf: 'flex-start',
    fontSize: Constants.FONT_SIZE.S,
    padding: 5,
    color: Constants.COLOR.BOOK_ID_TEXT_COLOR,
  },
  tagBackgroundView: {
    borderRadius: 12,
    alignSelf: 'center',
    marginHorizontal: 10,
    marginBottom: 5,
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTextStyleView: {
    marginHorizontal: 0,
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingVertical: 5,
    color: 'white',
    fontSize: Constants.FONT_SIZE.XS,
  },
  statusTextStyle: {
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingVertical: 5,
    color: 'white',
    fontSize: Constants.FONT_SIZE.XS,
  },
  imageStyle: {
    width: 14,
    height: 14,
    alignSelf: 'center',
  },
  nextImageStyle: {
    width: deviceHeight / 35,
    height: deviceHeight / 35,
    paddingRight: 5,
    alignSelf: 'center',
  },
  tagBackground: {
    borderRadius: 12,
    alignSelf: 'center',
    marginHorizontal: 10,
    marginBottom: 5,
    flex: Platform.OS === 'ios' ? null : 1,
    flexDirection: 'row',
  },
  blueBackground: {
    backgroundColor: Constants.COLOR.BOOK_PAY_BG,
    borderRadius: 5,
    marginRight: 5,
    alignSelf: 'center',
  },
  rowDirectionView: {
    flexDirection: 'row',
  },
  payNowText: {
    padding: 5,
    color: 'white',
    fontSize: Constants.FONT_SIZE.XS,
  },
  circleBackground: {
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    backgroundColor: Constants.COLOR.BOOK_SHADOW_BG,
  },
  timeBackground: {
    backgroundColor: Constants.COLOR.BOOK_SHADOW_BG,
    borderBottomStartRadius: 25,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  callImage: {
    width: 12,
    height: 12,
    alignSelf: 'center',
    marginTop: 5,
  },
});

export default BookRow;




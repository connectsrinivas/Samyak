/*************************************************
 * SukraasLIS
 * @exports
 * @class OnlinePaymentSuccess.js
 * @extends Component
 * Created by Shiva Sankar on 28/06/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import SummaryRow from '../lab_test/SummaryRow';
import Constants from '../../util/Constants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import BookDetails from './BookDetails';
import ButtonHome from '../common/ButtonHome';
import QRCode from 'react-native-qrcode-svg';
import {Actions} from 'react-native-router-flux';
// import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import SummaryBottom from '../lab_test/SummaryBottom';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoadingScreen from '../common/LoadingScreen';
import HTML from 'react-native-render-html';

import {
  setSelectedUserAddress,
  setSelectedPatient,
} from '../../actions/PatientInfoAction';

import {orderBookingAPI} from '../../actions/LabTestPaymentDetailsAction';

import {deleteUploadImage} from '../../actions/UploadPrescriptionAction';

import {
  setCartCount,
  setCartAmount,
  setCartArray,
  setDate,
  setTime,
  setType,
  emptySampleCollectionArray,
  resetSampleCollectionAmount,
} from '../../actions/LabTestSummaryAction';

import {setLabTestSearchToInitial} from '../../actions/LabTestAction';

class OnlinePaymentSuccess extends Component {
 //  static propTypes = {
  //   cartCount: PropTypes.number,
  //   cartArray: PropTypes.array,
  //   selectedAddress: PropTypes.array,
  //   selectedPatient: PropTypes.array,
  //   arrApplyPromoDetails: PropTypes.object,
  //   bookingSuccessData: PropTypes.object,
  //   postBodyData: PropTypes.object,
  //   cartAmount: PropTypes.number,
  //   currency: PropTypes.string,
  //   firmName: PropTypes.string,
  //   firmNo: PropTypes.string,
  //   isPaymentDetailLoading: PropTypes.bool,
  // };

  constructor(props) {
    super(props);
    this.state = {
      cartArray: this.props.cartArray,
      cartCount: this.props.cartCount,
      cartAmount: this.props.cartAmount,
      bookDetails: this.props.selectedAddress,
    };
  }

  componentDidMount() {
    this.props.orderBookingAPI(
      this.props.postBodyData,
      this.props.isPayNow,
      isCompleted => {
        if (isCompleted === true) {
          this.props.deleteUploadImage();
        }
      },
    );
  }

  componentWillUnmount() {
    //clearing the previous saved data
    this.props.setSelectedUserAddress('');
    this.props.setSelectedPatient('');
    this.props.setLabTestSearchToInitial();
    this.props.setCartCount('');
    this.props.setCartAmount('');
    this.props.setCartArray('');
    this.props.setDate('');
    this.props.setTime('');
    this.props.setType('');
    this.props.emptySampleCollectionArray();
    this.props.resetSampleCollectionAmount();
  }

  render() {
    if (this.props.isPaymentDetailLoading) {
      return <LoadingScreen />;
    } else {
      return this._renderOrderSuccessView();
    }
  }

  _renderOrderSuccessView = () => {
    return (
      <KeyboardAwareScrollView>
        <View style={styles.mainContainer}>
          <View style={styles.bodyContainer}>
            <View style={styles.successView}>
              <Image
                style={styles.successImage}
                source={require('../../images/roundTick.png')}
                resizeMode="contain"
              />
              <View style={styles.successMessageView}>
                <Text style={styles.successMessage}>
                  {!this.props.isPayNow
                    ? 'Order Placed Successfully '
                    : 'Payment Updated Successfully '}
                </Text>
                <Text style={styles.bookingIdMessage}>
                  Booking id : {this.props.bookingSuccessData.Booking_No}
                </Text>
              </View>
            </View>

            {!this.props.isPayNow ? this._renderSummaryView() : null}

            <View style={styles.bookDetailsView}>
              {/* <Text style={styles.headerText}>Booking Details</Text> */}
              {!this.props.isPayNow ? (
                <BookDetails
                  bookData={this.state.bookDetails}
                  bookingDate={this.props.bookingDate}
                  bookingTime={this.props.bookingTime}
                  bookingType={this.props.bookingType}
                  activeBranchDetails={this.state.activeBranchDetails}
                  patientDetails={this.props.selectedPatient}
                  currency={this.props.currency}
                />
              ) : null}
            </View>
            <View style={styles.qrCodeView}>
              {this.props.bookingSuccessData.QRCode_Data !== undefined &&
              this.props.bookingSuccessData.QRCode_Data !== '' ? (
                <View
                  style={{
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <QRCode
                    value={this.props.bookingSuccessData.QRCode_Data}
                    size={100}
                    color="black"
                    backgroundColor="white"
                  />
                  <View style={{marginVertical: 8}}>
                    <Text style={styles.qrNotedLabel}>
                      Please take a screenshot of this QR code
                    </Text>
                    <Text style={styles.qrNotedLabel}>
                      This can be used for Walkin Bookings
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={() => {
                Actions.homeTabBar();
              }}>
              <ButtonHome />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  };

  _renderSummaryRow = ({item}) => {
    return (
      <SummaryRow
        rowData={item}
        isHeaderBackground={Constants.COLOR.LAB_PAY_SUMMARY_BG}
        isShowDivider={true}
        currency={this.props.currency}
      />
    );
  };

  _renderSummaryView = () => {
    if (this.props.sampleCollectionArr.length > 0) {
      return (
        <View style={styles.summaryView}>
          <Text style={styles.headerText}>Summary</Text>
          <FlatList
            style={{marginTop: 8}}
            data={this.props.sampleCollectionArr}
            renderItem={this._renderSummaryRow}
            keyExtractor={this._keyExtractor}
          />
          <SummaryBottom
            data={this.props.arrApplyPromoDetails}
            cartAmount={this.props.sampleCollectionCartAmount}
            currency={this.props.currency}
          />
        </View>
      );
    } else {
      return <View />;
    }
  };

  _keyExtractor = data => {
    return data.headerId;
  };
}

const mapStateToProps = (state, props) => {
  //props can be called as ownProps
  const {
    labTestPaymentDetailsState: {
      bookingSuccessData,
      isPaymentDetailLoading,
      sampleCollectionData,
      sampleCollectionArr,
      sampleCollectionCartAmount,
    },
    labTestSummaryState: {
      bookingDate,
      bookingTime,
      bookingType,
      cartCount,
      cartArray,
      cartAmount,
    },
    patientInfoState: {selectedAddress, selectedPatient},
    dashboardState: {arrApplyPromoDetails},
    configState: {currency, firmName, firmNo},
  } = state;

  return {
    cartCount,
    cartArray,
    cartAmount,
    bookingDate,
    bookingTime,
    bookingType,
    selectedAddress,
    arrApplyPromoDetails,
    selectedPatient,
    bookingSuccessData,
    currency,
    firmName,
    firmNo,
    isPaymentDetailLoading,
    sampleCollectionData,
    sampleCollectionArr,
    sampleCollectionCartAmount,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setSelectedUserAddress,
      setSelectedPatient,
      setLabTestSearchToInitial,
      setCartCount,
      setCartAmount,
      setCartArray,
      setDate,
      setTime,
      setType,
      orderBookingAPI,
      deleteUploadImage,
      emptySampleCollectionArray,
      resetSampleCollectionAmount,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OnlinePaymentSuccess);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
  },
  bodyContainer: {
    marginTop: 8,
    marginHorizontal: 8,
    marginBottom: 20,
  },
  successView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  successImage: {
    width: 45,
    height: 45,
  },
  successMessageView: {
    marginVertical: 4,
  },
  successMessage: {
    fontSize: Constants.FONT_SIZE.M,
    paddingHorizontal: 8,
    color: '#6A6A6A',
    fontWeight: 'bold',
  },
  bookingIdMessage: {
    fontSize: Constants.FONT_SIZE.S,
    paddingHorizontal: 8,
    color: '#6A6A6A',
  },
  summaryView: {
    marginVertical: 8,
    marginHorizontal: 4,
  },
  headerText: {
    fontSize: Constants.FONT_SIZE.M,
    color: '#6A6A6A',
    fontWeight: 'bold',
  },
  bookDetailsView: {
    marginVertical: 8,
    marginHorizontal: 4,
  },
  addressView: {
    marginTop: 8,
    backgroundColor: Constants.COLOR.LAB_PAY_SUMMARY_BG,
    elevation: 0.2,
    justifyContent: 'space-around',
  },
  addressText: {
    fontSize: Constants.FONT_SIZE.SM,
    paddingHorizontal: 8,
    paddingVertical: 12,
    marginRight: 12,
    color: Constants.COLOR.LAB_SUMMARY_TEXT,
  },
  dateTimeView: {
    flexDirection: 'row',
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: Constants.FONT_SIZE.SM,
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  qrCodeView: {
    marginVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrNotedLabel: {
    fontSize: Constants.FONT_SIZE.SM,
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  totalView: {
    backgroundColor: Constants.COLOR.LAB_TOTAL_VIEW,
    height: 50,
  },
  subTotalText: {
    color: Constants.COLOR.LAB_SUB_TOTAL_FONT,
    fontSize: Constants.FONT_SIZE.L,
    alignSelf: 'center',
    marginRight: 20,
  },
  subTotalView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cartItemText: {
    margin: 15,
    fontSize: Constants.FONT_SIZE.M,
    color: Constants.COLOR.LAB_CART_ITEM_FONT,
  },
});

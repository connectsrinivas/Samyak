/*************************************************
 * SukraasLIS
 * @exports
 * @class CashPaymentSuccess.js
 * @extends Component
 * Created by Shiva Sankar on 29/06/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import BookDetails from '../payment/BookDetails';
import ButtonHome from '../common/ButtonHome';
import Constants from '../../util/Constants';
import LabHeader from '../lab_test/LabTestHeader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Actions} from 'react-native-router-flux';
import SummaryRow from '../lab_test/SummaryRow';
// import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import SummaryBottom from '../lab_test/SummaryBottom';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoadingScreen from '../common/LoadingScreen';
// import HTML from 'react-native-render-html';
import RenderHtml from 'react-native-render-html';

import {
  setSelectedUserAddress,
  setSelectedPatient,
} from '../../actions/PatientInfoAction';

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

class CashPaymentSuccess extends Component {
 //  static propTypes = {
  //   cartCount: PropTypes.number,
  //   cartArray: PropTypes.array,
  //   selectedAddress: PropTypes.array,
  //   selectedPatient: PropTypes.array,
  //   bookingSuccessData: PropTypes.object,
  //   arrApplyPromoDetails: PropTypes.object,
  //   cartAmount: PropTypes.number,
  //   bookingDate: PropTypes.string,
  //   bookingTime: PropTypes.string,
  //   bookingType: PropTypes.string,
  //   currency: PropTypes.string,
  //   firmName: PropTypes.string,
  //   firmNo: PropTypes.string,
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
    if (true) {
      return this._renderOrderSuccessView();
    } else {
      return <LoadingScreen />;
    }
  }

  _renderOrderSuccessView = () => {
    return (
      <View style={styles.mainContainer}>
        <LabHeader selectValue={4} />
        <KeyboardAwareScrollView>
          <View style={styles.bodyContainer}>
            <View style={styles.successView}>
              <Image
                style={styles.successImage}
                source={require('../../images/roundTick.png')}
                resizeMode="contain"
              />
              <View style={styles.successMessageView}>
                <Text style={styles.successMessage}>
                  Order Placed Successfully{' '}
                </Text>
                <Text style={styles.bookingIdMessage}>
                  Booking id : {this.props.bookingSuccessData.Booking_No}
                </Text>
              </View>
            </View>
            {/* <View style={styles.amountView}>
               <Text style={styles.amountText}>Amount to be Paid</Text>
              
             </View> */}
            {this._amountPaidView()}
            {this._renderSummaryView()}
            <View style={styles.bookDetailsView}>
              {/* <Text style={styles.headerText}>Booking Details</Text> */}
              <BookDetails
                bookData={this.state.bookDetails}
                bookingDate={this.props.bookingDate}
                bookingTime={this.props.bookingTime}
                bookingType={this.props.bookingType}
                patientDetails={this.props.selectedPatient}
                currency={this.props.currency}
              />
            </View>
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={() => {
                Actions.homeTabBar();
              }}>
              <ButtonHome />
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
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
  _renderSummaryRow = ({item}) => {
    return <SummaryRow rowData={item} currency={this.props.currency} />;
  };

  _keyExtractor = data => {
    return data.headerId;
  };

  _amountPaidView = () => {
    const {arrApplyPromoDetails} = this.props;
    let size = Object.keys(arrApplyPromoDetails).length;
    if (size > 0 && arrApplyPromoDetails.Payable_Amount !== 0) {
      return (
        <View style={styles.amountView}>
          <Text style={styles.amountText}>Amount to be Paid</Text>
          <View style={styles.amountText}>
            <RenderHtml
              baseFontStyle={styles.amountText}
              source={{html:
                this.props.currency + ' ' + arrApplyPromoDetails.Payable_Amount
              }}
            />
          </View>
        </View>
      );
    } else if (this.props.sampleCollectionCartAmount !== 0) {
      return (
        <View style={styles.amountView}>
          <Text style={styles.amountText}>Amount to be Paid</Text>
          <View style={styles.amountText}>
            <RenderHtml
              baseFontStyle={styles.amountText}
              source={{html:
                this.props.currency +
                ' ' +
                this.props.sampleCollectionCartAmount
              }}
            />
          </View>
        </View>
      );
    }
  };
}
const mapStateToProps = (state, props) => {
  //props can be called as ownProps
  const {
    labTestPaymentDetailsState: {
      bookingSuccessData,
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
    selectedAddress,
    bookingDate,
    bookingTime,
    bookingType,
    arrApplyPromoDetails,
    selectedPatient,
    bookingSuccessData,
    currency,
    firmName,
    firmNo,
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
      emptySampleCollectionArray,
      resetSampleCollectionAmount,
    },
    dispatch,
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CashPaymentSuccess);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Constants.COLOR.HALF_WHITE,
  },
  bodyContainer: {
    marginVertical: 8,
    marginHorizontal: 12,
    flexDirection: 'column',
  },
  successView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successImage: {
    width: 45,
    height: 45,
  },
  successMessageView: {
    marginVertical: 8,
  },
  successMessage: {
    fontSize: Constants.FONT_SIZE.M,
    paddingHorizontal: 8,
    color: '#6A6A6A',
    fontWeight: 'bold',
  },
  bookingIdMessage: {
    fontSize: Constants.FONT_SIZE.M,
    paddingHorizontal: 8,
    color: '#6A6A6A',
  },
  amountView: {
    backgroundColor: '#19529B',
    marginVertical: 8,
    padding: 28,
  },
  amountText: {
    fontSize: Constants.FONT_SIZE.XXL,
    color: Constants.COLOR.WHITE_COLOR,
    fontWeight: 'bold',
    padding: 8,
    alignSelf: 'center',
  },
  bookDetailsView: {
    marginVertical: 8,
    marginHorizontal: 4,
  },
  headerText: {
    fontSize: Constants.FONT_SIZE.M,
    color: '#6A6A6A',
    fontWeight: 'bold',
  },
  summaryView: {
    marginVertical: 8,
    marginHorizontal: 4,
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

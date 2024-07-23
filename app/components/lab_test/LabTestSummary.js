/*************************************************
 * SukraasLIS
 * @exports
 * @class LabTestSummary.js
 * @extends Component
 * Created by Kishore on 12/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import LabTestHeader from './LabTestHeader';
import { Actions } from 'react-native-router-flux';
import Calender from './Calender';
// import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  setCartCount,
  setCartAmount,
  setCartArray,
  setDate,
  setTime,
  setType,
  callBookingType,
  callDateBooking,
  clearSlotTimings,
} from '../../actions/LabTestSummaryAction';
import SummaryRow from './SummaryRow';
// import HTML from 'react-native-render-html';
import RenderHtml from 'react-native-render-html';
import ButtonBack from '../common/ButtonBack';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class LabTestSummary extends Component {
  //  static propTypes = {
  //   cartCount: PropTypes.number,
  //   cartArray: PropTypes.array,
  //   totalCartAmount: PropTypes.number,

  //   isCalenderLoading: PropTypes.bool,
  //   isNetworkConnectivityAvailable: PropTypes.bool,
  //   bookNowCartCount: PropTypes.number,
  //   bookNowArray: PropTypes.array,
  //   bookNowAmount: PropTypes.number,
  //   bookingType: PropTypes.string,
  //   bookingDate: PropTypes.string,

  //   bookingHomeorWalkIn: PropTypes.array,
  //   bookingTimeSlot: PropTypes.array,

  //   setCartCount: PropTypes.func,
  //   setCartAmount: PropTypes.func,
  //   setCartArray: PropTypes.func,
  //   setDate: PropTypes.func,
  //   setTime: PropTypes.func,
  //   setType: PropTypes.func,
  //   clearSlotTimings: PropTypes.func,
  //   currency: PropTypes.string,
  //   firmName: PropTypes.string,
  //   firmNo: PropTypes.string,
  // };
  constructor(props) {
    super(props);
    this.state = {
      isRestrictHome: false,
      isOptionsHomeClicked: false,
      isOptionsWalkInClicked: false,
      isFromLabs: this.props.isFromLabs,
      cartArray: this.props.isFromLabs
        ? this.props.cartArray
        : this.props.bookNowArray,
      cartCount: this.props.isFromLabs
        ? this.props.cartCount
        : this.props.bookNowCartCount,
      cartAmount: this.props.isFromLabs
        ? this.props.totalCartAmount
        : this.props.bookNowAmount,
    };
    this.props.setCartArray(this.state.cartArray);
    this.props.setCartAmount(this.state.cartAmount);
    this.props.setCartCount(this.state.cartCount);

    //clearing the previous saved data
    this.props.setDate('');
    this.props.setTime('');
    this.props.setType('');
  }

  _renderSummaryRow = ({ item }) => {
    return (
      <SummaryRow
        rowData={item}
        currency={this.props.currency}
        isFromSummary={true}
      />
    );
  };

  _keyExtractor = data => {
    return data.label;
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <LabTestHeader selectValue={2} />

        <ScrollView>
          <View style={styles.bodyContainer}>
            <Text style={styles.optionTitle}>Preferred Option</Text>

            <View style={styles.optionView}>
              <TouchableOpacity
                disabled={
                  this.props.isCalenderLoading === true
                    ? true
                    : false || this.state.isOptionsHomeClicked === true
                      ? true
                      : false
                }
                style={[
                  styles.homeOptionView,
                  this.state.isOptionsHomeClicked
                    ? { backgroundColor: '#58AFFF' }
                    : { backgroundColor: Constants.COLOR.WHITE_COLOR },
                ]}
                onPress={() => {
                  this._optionsClicked(true);
                }}>
                <Text
                  style={[
                    styles.homeWalkInText,
                    this.state.isOptionsHomeClicked
                      ? { color: Constants.COLOR.WHITE_COLOR }
                      : { color: Constants.COLOR.BLACK_COLOR },
                  ]}>
                  Home
                </Text>
              </TouchableOpacity>
              <View style={styles.verticalView} />
              <TouchableOpacity
                disabled={
                  this.props.isCalenderLoading === true
                    ? true
                    : false || this.state.isOptionsWalkInClicked === true
                      ? true
                      : false
                }
                style={[
                  styles.walkInOptionView,
                  this.state.isOptionsWalkInClicked
                    ? { backgroundColor: '#58AFFF' }
                    : { backgroundColor: Constants.COLOR.WHITE_COLOR },
                ]}
                onPress={() => {
                  this._optionsClicked(false);
                }}>
                <Text
                  style={[
                    styles.homeWalkInText,
                    this.state.isOptionsWalkInClicked
                      ? { color: Constants.COLOR.WHITE_COLOR }
                      : { color: Constants.COLOR.BLACK_COLOR },
                  ]}>
                  Walk IN
                </Text>
              </TouchableOpacity>
            </View>
            {this._renderBodyContent()}
          </View>
        </ScrollView>
      </View>
    );
  }

  _optionsClicked = isHomeClick => {
    if (this.calender !== undefined) {
      this.calender._clearCalendarData();
    }
    if (isHomeClick === true) {
      this.props.setType('HOME');
      this.props.callBookingType('Home');
      this.props.clearSlotTimings();
      return this.setState({
        isOptionsHomeClicked: true,
        isOptionsWalkInClicked: false,
      });
    } else {
      this.props.setType('WALKIN');
      this.props.callBookingType('Walkin');
      this.props.clearSlotTimings();
      return this.setState({
        isOptionsHomeClicked: false,
        isOptionsWalkInClicked: true,
      });
    }
  };

  _renderBodyContent = () => {
    if (this.state.isOptionsHomeClicked || this.state.isOptionsWalkInClicked) {
      var tempVariable = false;
      if (this.state.isOptionsHomeClicked === true) {
        for (var i = 0; i < this.state.cartArray.length; i++) {
          if (
            this.state.cartArray[i].hasOwnProperty('No_House_Visit') &&
            this.state.cartArray[i].No_House_Visit === 'Y'
          ) {
            tempVariable = true;
            this.state.cartArray[i].No_House_Visit_Message =
              'Not available for Home Visit';
          } else {
            this.state.cartArray[i].No_House_Visit_Message = '';
          }
        }
      }
      if (tempVariable === true) {
        return (
          <View>
            <Text />
            {this._renderCartSummary(true)}
          </View>
        );
      } else {
        return <View>{this._renderCalender()}</View>;
      }
    } else {
      return <View>{this._renderCartSummary(false)}</View>;
    }
  };

  _renderHomeBookingError = isShowError => {
    if (isShowError === true) {
      return (
        <Text style={styles.cartError}>
          Some TEST in cart are not available for HOME booking. Kindly remove
          those items to proceed.
        </Text>
      );
    } else {
      return null;
    }
  };

  _renderCartSummary = isShowError => {
    return (
      <View>
        {this._renderCartSummaryData(isShowError)}

        {this._renderBottomButtons()}
      </View>
    );
  };

  _renderCartSummaryData = isShowError => {
    if (this.state.cartArray !== undefined && this.state.cartArray.length > 0) {
      return (
        <View>
          {this._renderHomeBookingError(isShowError)}
          <Text style={styles.cartTitle}> Test In Cart</Text>

          <View style={styles.cartView}>
            <FlatList
              data={this.state.cartArray}
              renderItem={this._renderSummaryRow}
              keyExtractor={this._keyExtractor}
            />
          </View>

          <View style={styles.totalView}>
            <View style={styles.subTotalView}>
              <Text style={styles.subTotalText}>SubTotal </Text>
              <View style={styles.cartItemText}>
                <RenderHtml
                  baseFontStyle={styles.cartItemText}
                  source={{ html: this.props.currency + ' ' + this.state.cartAmount }}
                />
              </View>
            </View>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  _callDate = (date, bookingType) => {
    let dictDateBookingInfo = {
      Type_Of_Booking: bookingType,
      Date_Of_Booking: date,
    };
    this.props.callDateBooking(dictDateBookingInfo);
  };

  _renderCalender = () => {
    return (
      <View>
        <Calender
          onRef={ref => (this.calender = ref)}
          isCalenderLoading={this.props.isCalenderLoading}
          isfromHomeBookingType={
            this.state.isOptionsHomeClicked === true ? true : false
          }
          bookingHomeorWalkIn={this.props.bookingHomeorWalkIn}
          setDate={this.props.setDate}
          setTime={this.props.setTime}
          callDate={this._callDate}
          daySlotWise={this.props.bookingTimeSlot}
          isNetworkAvailable={this.props.isNetworkConnectivityAvailable}
        />
     
      </View>
    );
  };

  _renderBottomButtons = () => {
    return (
      <View style={styles.buttonView}>
        <TouchableOpacity
          disabled={this.state.btnBackDisabled}
          onPress={() => {
            this.setState({
              btnBackDisabled: true,
            });
            Actions.pop();
          }}>
          <ButtonBack />
        </TouchableOpacity>
      </View>
    );
  };
}

const mapStateToProps = (state, props) => {
  //props can be called as ownProps
  const {
    labTestState: { cartCount, cartArray, totalCartAmount },
    labTestSummaryState: {
      bookingTimeSlot,
      bookingHomeorWalkIn,
      isCalenderLoading,
    },
    dashboardState: { bookNowArray, bookNowCartCount, bookNowAmount },
    configState: { currency, firmName, firmNo },
    deviceState: { isNetworkConnectivityAvailable },
  } = state;

  return {
    isNetworkConnectivityAvailable,
    cartCount,
    cartArray,
    totalCartAmount,
    bookNowAmount,
    bookNowCartCount,
    bookNowArray,
    bookingTimeSlot,
    bookingHomeorWalkIn,
    isCalenderLoading,
    currency,
    firmName,
    firmNo,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setCartArray,
      setCartAmount,
      setCartCount,
      setDate,
      setTime,
      setType,
      callBookingType,
      callDateBooking,
      clearSlotTimings,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LabTestSummary);

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Constants.COLOR.HALF_WHITE,
    flex: 1,
  },
  bodyContainer: {
    flex: 1,
    marginHorizontal: 12,
    marginBottom: 5,
  },
  buttonView: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 0,
    flexDirection: 'row',
  },
  optionTitle: {
    fontSize: Constants.FONT_SIZE.M,
    marginTop: 16,
    fontWeight: 'bold',
    color: Constants.COLOR.BLACK_COLOR,
  },
  cartTitle: {
    fontSize: Constants.FONT_SIZE.M,
    marginTop: 16,
    color: Constants.COLOR.LAB_CART_ITEM_FONT,
  },
  cartError: {
    fontSize: Constants.FONT_SIZE.S,
    marginTop: 16,
    color: 'red',
  },
  optionView: {
    flexDirection: 'row',
    width: deviceWidth / 2,
    borderColor: Constants.COLOR.BLACK_COLOR,
    borderWidth: 0.3,
    borderRadius: 20,
    marginTop: 16,
    justifyContent: 'space-around',
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    overflow: 'hidden',
  },
  homeOptionView: {
    flex: 1,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  walkInOptionView: {
    flex: 1,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  verticalView: {
    borderRightColor: Constants.COLOR.LAB_CART_ITEM_FONT,
    borderRightWidth: 0.5,
  },
  homeWalkInText: {
    fontSize: Constants.FONT_SIZE.M,
    color: Constants.COLOR.BLACK_COLOR,
    textAlign: 'center',
    marginHorizontal: Platform.OS === 'android' ? 5 : null,
    padding: 10,
  },
  cartView: {
    marginTop: 16,
    backgroundColor: Constants.COLOR.LAB_CART_VIEW,
  },
  cartItemText: {
    margin: 15,
    fontSize: Constants.FONT_SIZE.SM,
    color: Constants.COLOR.LAB_CART_ITEM_FONT,
  },
  totalView: {
    backgroundColor: Constants.COLOR.LAB_TOTAL_VIEW,
    height: 50,
  },
  subTotalText: {
    color: Constants.COLOR.LAB_SUB_TOTAL_FONT,
    fontSize: Constants.FONT_SIZE.SM,
    alignSelf: 'center',
    marginRight: 20,
  },
  subTotalView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  summaryRowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

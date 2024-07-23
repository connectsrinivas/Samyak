/* eslint-disable no-undef */
/*************************************************
 * SukraasLIS
 * @exports
 * @class BookingsScreen.js
 * @extends Component
 * Created by Sankar on 12/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import BookRow from './BookRow';
import store from '../../store';
import Loading from '../common/Loading';
import { invokeBookingList } from '../../actions/BookingAction';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Constants from '../../util/Constants';
import LoadingScreen from '../common/LoadingScreen';
const currentScene = 'bookingsScreen';

const propTypes = {
  mobileNo: PropTypes.bool,
  isBookingLoading: PropTypes.bool,
  ispulltoRefreshloading: PropTypes.bool,
  arrbookingOrderlist: PropTypes.array,
  invokeBookingList: PropTypes.func,
};

class BookingsScreen extends Component {
  static propTypes = propTypes;
  //  static propTypes = {
  //   mobileNo: PropTypes.bool,
  //   isBookingLoading: PropTypes.bool,
  //   ispulltoRefreshloading: PropTypes.bool,
  //   arrbookingOrderlist: PropTypes.array,
  //   invokeBookingList: PropTypes.func,
  // };

  constructor(props) {
    super(props);
    this.state = {
      name: this.props.mobileNo,
      btnAddPatientDisabled: false,
      btnClickDisabled: false,
    };
  }

  componentDidMount() {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      this.willFocusSubscription = this.props.navigation.addListener(
        'willFocus',
        () => {
          this._getAsyncAndAPICall();
        },
      );
    } else {
      this.internetAlert(Constants.VALIDATION_MSG.NO_INTERNET);
    }
  }


  componentWillUnmount() {
    // Unsubscribe from the 'willFocus' event to prevent memory leaks
    if (this.willFocusSubscription) {
      this.willFocusSubscription.remove();
    }
  }


  _getAsyncAndAPICall = () => {
    this.props.invokeBookingList(this.state.name);
  };

  internetAlert(Message) {
    Alert.alert(
      Constants.ALERT.TITLE.FAILED,
      Message,
      [
        {
          text: Constants.ALERT.BTN.OK,
          onPress: () => {
            // Actions.pop();
          },
        },
      ],
      { cancelable: false },
    );
  }

  _navigateScreen = item => {
    if (Actions.currentScene === currentScene) {
      Actions.BookingDetailsScreen({
        UserName: this.state.name,
        Booking_Type: item.Booking_Type,
        Firm_No: item.Firm_No,
        Booking_Date: item.Booking_Date,
        Booking_No: item.Booking_No,
        Branch_Name: item.Branch_Name,
      });
    }
  };



  render() {
    return this._renderScreen();
  }

  _renderScreen = () => {
    if (this.props.isBookingLoading) {
      return this._screenLoading();
    } else {
      if (
        this.props.arrbookingOrderlist.length > 0 &&
        this.props.arrbookingOrderlist.length !== null &&
        this.props.arrbookingOrderlist.length !== undefined
      ) {
        return this._renderBookingView();
      } else {
        return (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>No Data found!</Text>
          </View>
        );
      }
    }
  };

  _screenLoading = () => {
    return <LoadingScreen />;
  };

  _renderBookingRow = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this._navigateScreen(item);
        }}>
        <BookRow rowData={item} />
      </TouchableOpacity>
    );
  };

  _renderBookingView = () => {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View>
          <FlatList
            showsVerticalScrollIndicator={true}
            data={this.props.arrbookingOrderlist}
            renderItem={this._renderBookingRow}
            onRefresh={() => this.onRefresh()}
            refreshing={this.props.isBookingLoading}
            keyExtractor={this._keyExtractor}
          />
        </View>
      </SafeAreaView>
    );
  };
  onRefresh() {
    this.props.invokeBookingList(this.state.name);
  }

  componentWillUnmount() {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      this.willFocusSubscription.remove();
    }
  }

  _keyExtractor = data => {
    return data.month;
  };
}

const mapStateToProps = (state, props) => {
  const {
    bookingState: {
      isBookingLoading,
      ispulltoRefreshloading,
      arrbookingOrderlist,
    },
    configState: { mobileNo },
  } = state;
  return {
    mobileNo,
    isBookingLoading,
    ispulltoRefreshloading,
    arrbookingOrderlist,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      invokeBookingList,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BookingsScreen);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
  },
});

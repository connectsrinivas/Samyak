/* eslint-disable react-native/no-inline-styles */
/*************************************************
 * SukraasLIS
 * @exports
 * @class RatingsView.js
 * @extends Component
 * Created by Sankar on 12/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, { Component } from 'react';
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
// import PropTypes from 'prop-types';
import Utility from '../../util/Utility';
import Constants from '../../util/Constants';
import { bindActionCreators } from 'redux';
import {
  invokeUpdateRatings,
  invokePostRateCode,
} from '../../actions/BookingDetailAction';
import { connect } from 'react-redux';
import LoadingScreen from '../common/LoadingScreen';
import { numericLiteral } from '../../../node_modules/@babel/types';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

let postValues = {};
let postRatingCodeValue = {};

class RatingServiceView extends Component {
  //  static propTypes = {
  //   isRatingServiceLoading: PropTypes.bool,
  //   isNetworkConnectivityAvailable: PropTypes.bool,
  //   invokeUpdateRatings: PropTypes.func,
  //   invokePostRateCode: PropTypes.func,
  // };
  constructor(props) {
    super(props);
    this.state = {
      titleText: '',
      serviceRatingValue: this.props.serviceRatingValue,
      phlebRatingValue: this.props.phlebRatingValue,
      isAlreadyRatingCodeSelected: false,
      ratingString: this.props.ratingString,
      isRefreshRatingDes: null,
      isShowProps: this.props.isFromRating,
      isShowRatingCodeProps: this.props.isFromRatingCode,
    };
    postValues = this.props.postData;
    postRatingCodeValue = this.props.postRatingCode;
  }

  componentDidMount() {
    this.setState({ titleText: 'How would you like to rate the service?' });
  }

  render() {
    if (this.props.isRatingServiceLoading) {
      return <LoadingScreen />;
    } else {
      return this._renderScreen();
    }
  }
  _onPressRating = ratingValue => {
    if (this.props.isNetworkConnectivityAvailable) {
      this.setState(
        {
          serviceRatingValue: ratingValue,
          isShowProps: false,
        },
        () => {
          postValues.Rating_No = ratingValue;
          this.props.invokeUpdateRatings(postValues, true);
        },
      );
    } else {
      Utility.showAlertWithPopAction(
        Constants.ALERT.TITLE.FAILED,
        Constants.VALIDATION_MSG.NO_INTERNET,
      );
    }
  };

  _renderScreen() {
    return (
      <View style={styles.mainView}>
        <View style={styles.innerView}>
          <Text style={styles.titleText}>{this.state.titleText}</Text>
          {/* <AirbnbRating
            style={styles.ratingStyle}
            count={5}
            size={20}
            showRating={false}
            isDisabled={
              this.state.isShowProps
                ? this.props.serviceRatingValue > 0
                : this.state.serviceRatingValue > 0
            }
            selectedColor={'#126DEF'}
            defaultRating={
              this.state.isShowProps
                ? this.props.serviceRatingValue
                : this.state.serviceRatingValue
            }
            onFinishRating={Number => {
              this._onPressRating(Number);
            }}
          /> */}
          <Rating
            style={styles.ratingStyle}
            type="star"
            ratingCount={5}
            imageSize={20}
            showRating={false}
            readonly={
              this.state.isShowProps
                ? this.props.serviceRatingValue > 0
                : this.state.serviceRatingValue > 0
            }
            selectedColor={'#126DEF'}
            startingValue={
              this.state.isShowProps
                ? this.props.serviceRatingValue
                : this.state.serviceRatingValue
            }
            onFinishRating={(rating) => {
              this._onPressRating(rating);
            }}
          />
          <View style={{ flexDirection: 'row' }}>
            <FlatList
              data={
                this.state.isShowRatingCodeProps
                  ? this.props.ratingString
                  : this.state.ratingString
              }
              extraData={this.state.isRefreshRatingDes}
              horizontal={true}
              renderItem={this._ratingList}
            />
          </View>
        </View>
        {this._renderProfileImage()}
      </View>
    );
  }
  selectItem(index, item) {
    if (this.props.isNetworkConnectivityAvailable) {
      if (!this.props.isAlreadyRatingCodeSelected) {
        if (!this.state.isAlreadyRatingCodeSelected) {
          let ratingData = this.state.isShowRatingCodeProps
            ? this.props.ratingString
            : this.state.ratingString;
          for (let i = 0; i < ratingData.length; i++) {
            if (i === index) {
              ratingData[i].IsSelected = true;
            } else {
              ratingData[i].IsSelected = false;
            }
          }
          this.setState(
            {
              isRefreshRatingDes: index,
              ratingString: ratingData,
              isAlreadyRatingCodeSelected: true,
            },
            () => {
              postRatingCodeValue.Rating_Code = item.Rating_Code;
              this.props.invokePostRateCode(postRatingCodeValue);
            },
          );
        }
      }
    } else {
      Utility.showAlert(
        Constants.ALERT.TITLE.FAILED,
        Constants.VALIDATION_MSG.NO_INTERNET,
      );
    }
  }
  _ratingList = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => this.selectItem(index, item)}
        style={styles.flatListMainView}>
        {item.IsSelected ? (
          <Text
            style={[
              styles.flatListText,
              { backgroundColor: 'blue', color: 'white', overflow: 'hidden' },
            ]}>
            {item.Rating_Desc}
          </Text>
        ) : (
          <Text
            style={[
              styles.flatListText,
              { backgroundColor: 'white', color: 'blue', overflow: 'hidden' },
            ]}>
            {item.Rating_Desc}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  _renderProfileImage = () => {
    if (this.props.isServiceRating) {
      return <View />;
    } else {
      return <View style={styles.profileImage} />;
    }
  };
}

const styles = StyleSheet.create({
  mainView: { marginTop: 15 },
  innerView: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  titleText: {
    textAlign: 'center',
    color: 'black',
    fontSize: Constants.FONT_SIZE.SM,
    marginBottom: 10,
    marginTop: 10,
  },
  ratingStyle: {},
  profileImage: {
    bottom: 80,
    position: 'absolute',
    width: 60,
    height: 60,
    alignSelf: 'center',
    borderRadius: 60 / 2,
    overflow: 'hidden',
    backgroundColor: '#D7DBDB',
  },
  flatListText: {
    marginHorizontal: 20,
    padding: 10,
    //  backgroundColor: "black",
    borderColor: '#2C5EEE',
    borderWidth: 1.0,
    color: '#2C5EEE',
    borderRadius: 10,
  },
  flatListMainView: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    // backgroundColor: "gray"
  },
});
const mapStateToProps = (state, props) => {
  const {
    bookingDetailState: { isRatingServiceLoading },
    deviceState: { isNetworkConnectivityAvailable },
  } = state;

  return {
    isRatingServiceLoading,
    isNetworkConnectivityAvailable,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      invokeUpdateRatings,
      invokePostRateCode,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RatingServiceView);

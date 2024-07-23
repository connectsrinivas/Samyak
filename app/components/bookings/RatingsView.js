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
import { Actions } from 'react-native-router-flux';
import { invokeUpdateRatings } from '../../actions/BookingDetailAction';
import { connect } from 'react-redux';
import LoadingScreen from '../common/LoadingScreen';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

let postValues = {};

class RatingsView extends Component {
  //  static propTypes = {
  //   isRatingPhlebotomistLoading: PropTypes.bool,
  //   isNetworkConnectivityAvailable: PropTypes.bool,
  //   invokeUpdateRatings: PropTypes.func,
  // };
  constructor(props) {
    super(props);
    this.state = {
      titleText: '',
      serviceRatingValue: this.props.serviceRatingValue,
      phlebRatingValue: this.props.phlebRatingValue,
      selectedDataPosition: this.props.selectedDataPosition,
      ratingString: this.props.ratingString,
      isRefreshRatingDes: null,
      isShowProps: this.props.isFromRating,
    };
    postValues = this.props.postData;
  }

  componentDidMount() {
    this.setState({
      titleText: 'How would you like to rate the phlebotomist?',
    });
  }

  render() {
    if (this.props.isRatingPhlebotomistLoading) {
      return <LoadingScreen />;
    } else {
      return this._renderScreen();
    }
  }

  _onPressRating = ratingValue => {
    if (this.props.isNetworkConnectivityAvailable) {
      this.setState(
        {
          phlebRatingValue: ratingValue,
          isShowProps: false,
        },
        () => {
          postValues.Rating_No = ratingValue;
          this.props.invokeUpdateRatings(postValues, false);
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
                ? this.props.phlebRatingValue > 0
                : this.state.phlebRatingValue > 0
            }
            selectedColor={'#126DEF'}
            defaultRating={
              this.state.isShowProps
                ? this.props.phlebRatingValue
                : this.state.phlebRatingValue
            }
            onFinishRating={Number => {
              this.setState({phlebRatingValue: Number});
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
                ? this.props.phlebRatingValue > 0
                : this.state.phlebRatingValue > 0
            }
            selectedColor={'#126DEF'}
            startingValue={
              this.state.isShowProps
                ? this.props.phlebRatingValue
                : this.state.phlebRatingValue
            }
            onFinishRating={(rating) => {
              this.setState({ phlebRatingValue: rating });
              this._onPressRating(rating);
            }}
          />
        </View>
        {this._renderProfileImage()}
      </View>
    );
  }

  _ratingCompleted(rating) {
    console.log('Rating is: ' + rating);
  }
  _renderProfileImage = () => {
    if (this.props.isProfileImage === '') {
      return <View />;
    } else {
      return (
        <View style={styles.profileImage}>
          <TouchableOpacity
            onPress={() => {
              Actions.ZoomImageScreen({
                image: this.props.isProfileImage,
                CollectorName: this.props.collectorName,
                CollectorInfo: this.props.aboutCollector,
                PhoneNumber: this.props.phoneNumber,
              });
            }}>
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 60,
                alignSelf: 'center',
                justifyContent: 'center',
              }}
              resizeMode="contain"
              source={{ uri: this.props.isProfileImage }}
            />
          </TouchableOpacity>
        </View>
      );
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
    justifyContent: 'center',
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
    borderColor: '#2C5EEE',
    borderWidth: 1.0,
    color: '#2C5EEE',
    borderRadius: 10,
  },
  flatListMainView: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
  },
});
const mapStateToProps = (state, props) => {
  const {
    bookingDetailState: { isRatingPhlebotomistLoading },
    deviceState: { isNetworkConnectivityAvailable },
  } = state;

  return {
    isRatingPhlebotomistLoading,
    isNetworkConnectivityAvailable,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      invokeUpdateRatings,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RatingsView);

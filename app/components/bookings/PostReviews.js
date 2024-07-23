/* eslint-disable react-native/no-inline-styles */
/*************************************************
 * SukraasLIS
 * @exports
 * @class PostReviews.js
 * @extends Component
 * Created by Sankar on 12/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, {Component} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
// import PropTypes from 'prop-types';
import Utility from '../../util/Utility';
import Constants from '../../util/Constants';
const deviceWidth = Dimensions.get('window').width;
import {bindActionCreators} from 'redux';
import {invokePostReviews} from '../../actions/BookingDetailAction';
import {connect} from 'react-redux';
import Loading from '../common/Loading.js';
import LoadingScreen from '../common/LoadingScreen';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

class PostReviews extends Component {
  state = {
    textInput: '',
    isShowFeedBack: false,
    postBtnClicked: false,
  };
 //  static propTypes = {
  //   isPostReviewLoading: PropTypes.bool,
  //   invokePostReviews: PropTypes.func,
  // };
  render() {
    if (this.props.isPostReviewLoading) {
      return <LoadingScreen />;
    } else {
      return this._renderScreen();
    }
  }
  _screenLoading = () => {
    return <Loading />;
  };
  _onPostPress = postReview => {
    if (postReview.trim().length > 0) {
      let postValues = this.props.postData;
      postValues.Post_Review = postReview;
      this.props.invokePostReviews(postValues, isSuccess => {
        if (isSuccess == true) {
          this.setState({isShowFeedBack: true});
        }
      });
    }
  };

  _renderScreen() {
    if (this.state.isShowFeedBack) {
      return (
        <View style={{padding: 10}}>
          <Text style={{marginTop: 10, fontSize: Constants.FONT_SIZE.L}}>
            Feedback:
          </Text>
          <Text
            style={{
              marginTop: 5,
              marginBottom: 30,
              fontSize: Constants.FONT_SIZE.SM,
            }}>
            {this.state.textInput}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.mainView}>
          <Text style={styles.headingText}>Post your Review</Text>
          <View style={[styles.commentMainView]}>
            <TextInput
              style={styles.commentTextView}
              multiline={true}
              onChangeText={username => this.setState({textInput: username})}
              value={this.state.textInput}
            />
            <TouchableOpacity
              disabled={this.state.postBtnClicked}
              onPress={() => {
                this._onPostPress(this.state.textInput);
                this.setState({
                  postBtnClicked: true,
                });
                setTimeout(() => {
                  this.setState({
                    postBtnClicked: false,
                  });
                }, 1000);
              }}>
              <Text style={styles.submitView}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#F5F5F5',
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  headingText: {
    color: 'black',
    fontSize: Constants.FONT_SIZE.SM,
    fontWeight: 'bold',
  },
  commentMainView: {
    flexDirection: 'row',
    marginTop: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentTextView: {
    backgroundColor: 'white',
    flex: 0.999,
    padding: 10,
    borderRadius: 10,
    height: deviceHeight / 8,
  },
  submitView: {
    fontSize: Constants.FONT_SIZE.SM,
    backgroundColor: '#DDDBDB',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
    marginLeft: 10,
  },
});

const mapStateToProps = (state, props) => {
  const {
    bookingDetailState: {isPostReviewLoading},
  } = state;

  return {
    isPostReviewLoading,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      invokePostReviews,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostReviews);

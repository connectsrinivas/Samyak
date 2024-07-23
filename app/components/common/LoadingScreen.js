/* eslint-disable react-native/no-inline-styles */
/*************************************************
 * SukraasLIS
 * LoadingScreen.js
 * Created by Abdul Rahman on 21/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';

// import PropTypes from 'prop-types';
import Constants from '../../util/Constants';
import Spinner from 'react-native-spinkit';
import Utility from '../../util/Utility';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

class LoadingScreen extends Component {
 //  static propTypes = {
  //   isFrom: PropTypes.string,
  //   isLoading: PropTypes.bool,
  //   message: PropTypes.string.isRequired,
  //   onReloadPress: PropTypes.func,
  //   isRefreshing: PropTypes.bool,
  // };

  static defaultProps = {
    isLoading: true,
    isRefreshing: false,
    message: '',
  };

  constructor(props) {
    super(props);
    // To avoid dessign issue when default font size increase or decrease
    if (Text.defaultProps == null) {
      Text.defaultProps = {};
    }
    Text.defaultProps.allowFontScaling = false;
    //end
    this.state = {
      height: 100,
    };
  }

  /**
   * Renders the Loading spinner or no data message with reload option
   */
  _renderContent() {
    if (this.props.isLoading) {
      return (
        <View
          style={{
            paddingTop: this.state.height * (2 / 5),
            alignItems: 'center',
          }}>
          <Spinner
            isVisible={this.props.isLoading}
            size={40}
            type={'Wave'}
            color={Constants.COLOR.THEME_COLOR}
          />
          <Text
            style={{
              textAlign: 'center',
              marginTop: deviceHeight / 40,
              fontSize: Constants.FONT_SIZE.L,
              // fontFamily: 'Dosis-SemiBold',
              color: Constants.COLOR.THEME_COLOR,
            }}>
            Loading...
          </Text>
        </View>
      );
    } else {
      return (
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={this.props.isRefreshing}
              onRefresh={() => this.props.onReloadPress(true)}
            />
          }>
          {this._renderSpinnerOrMessage()}
        </ScrollView>
      );
    }
  }

  /**
   * Renders the given message or empty screen based on pull to refresh status
   */
  _renderSpinnerOrMessage() {
    if (this.props.isRefreshing) {
      return null;
    } else {
      return (
        <View
          style={{
            paddingTop: this.state.height * (2 / 5),
            alignItems: 'center',
          }}>
          <Text
            key={'0001'}
            style={{
              textAlign: 'center',
              fontSize: Constants.FONT_SIZE.M,
              // fontFamily: 'Dosis-SemiBold',
            }}>
            {this.props.message}
          </Text>
          <TouchableOpacity
            style={{
              marginTop: deviceHeight / 40,
            }}
            key={'0002'}
            onPress={() => this.props.onReloadPress(false)}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: deviceHeight / 40,
                // fontFamily: 'Dosis-SemiBold',
                color: Constants.COLOR.THEME_COLOR,
              }}>
              Tap to Reload
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  measureView(event) {
    this.setState({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    });
  }

  /**
   * Renders the Loading spinner or no data message with reload option
   */
  render() {
    return (
      <View
        style={{flex: 1, backgroundColor: 'transparent'}}
        onLayout={event => this.measureView(event)}>
        {this._renderContent()}
      </View>
    );
  }
}

export default LoadingScreen;

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

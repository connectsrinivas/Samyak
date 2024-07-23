/*************************************************
 * SukraasLIS
 * @exports
 * @class PaymentFailure.js
 * @extends Component
 * Created by Shiva Sankar on 25/09/2020
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
  BackHandler,
} from 'react-native';
import Constants from '../../util/Constants';
import {Actions} from 'react-native-router-flux';

class PaymentFailure extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.viewContainer}>
          <Text style={styles.title}> Transaction Failure </Text>
          <Image
            style={styles.image}
            source={require('../../images/warning.png')}
            resizeMode="contain"
          />
          <Text style={styles.info}>
            Your Payment was not completed. Amount will be refunded if it is
            debited. You can retry or cancel this order{' '}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              Actions.homeTabBar();
            }}
            style={styles.buttonView}>
            <Text style={styles.buttonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (this.props.isPayNow) {
                Actions.jump('bookingsTab');
              } else {
                Actions.jump('labTestPaymentDetails');
              }
            }}
            style={styles.buttonView}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  handleBackButtonClick() {
    console.log('Back Button Clickegddd');
    this.props.navigation.goBack(null);
    return true;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewContainer: {
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: Constants.FONT_SIZE.XL,
    color: Constants.COLOR.BLACK_COLOR,
    textAlign: 'center',
    fontWeight: '400',
    marginVertical: 15,
  },
  image: {
    width: 80,
    height: 80,
    marginVertical: 15,
  },
  info: {
    fontSize: Constants.FONT_SIZE.M,
    color: Constants.COLOR.BLACK_COLOR,
    textAlign: 'center',
    marginVertical: 15,
    fontWeight: '400',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 35,
    marginHorizontal: 20,
  },
  buttonView: {
    backgroundColor: '#676767',
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 8,
  },
  buttonText: {
    textAlign: 'center',
    paddingVertical: 12,
    fontSize: Constants.COLOR.L,
    color: Constants.COLOR.WHITE_COLOR,
  },
});

export default PaymentFailure;

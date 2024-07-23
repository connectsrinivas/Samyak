/*************************************************
 * SukraasLIS
 * @exports
 * @class LabTestSummary.js
 * @extends Component
 * Created by Shiva Sankar on 29/06/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, {Component} from 'react';
import {Text, View, StyleSheet, Dimensions, Image} from 'react-native';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';

const deviceWidth = Dimensions.get('window').width;

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

export default class ButtonHome extends Component {
  render() {
    return (
      <View style={styles.homeView}>
        <Image
          style={styles.homeImage}
          source={require('../../images/homeWhite.png')}
          resizeMode="contain"
        />
        <Text style={styles.homeText}>Home</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  homeView: {
    flexDirection: 'row',
    backgroundColor: '#313131',
    borderRadius: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  homeImage: {
    width: deviceHeight / 35,
    height: deviceHeight / 35,
    marginLeft: 8,
    marginRight: 4,
    alignSelf: 'center',
  },
  homeText: {
    fontSize: Constants.FONT_SIZE.M,
    color: Constants.COLOR.WHITE_COLOR,
    paddingHorizontal: 8,
    alignSelf: 'center',
  },
});

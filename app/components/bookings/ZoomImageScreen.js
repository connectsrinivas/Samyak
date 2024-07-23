/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
/*************************************************
 * SukraasLIS
 * @exports
 * @class ZoomImageScreen.js
 * @extends Component
 * Created by Sankar on 18/12/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/
'use strict';
import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import Utility from '../../util/Utility';
import ButtonBack from '../common/ButtonBack';
import {Actions} from 'react-native-router-flux';
// import HTML from 'react-native-render-html';
import RenderHtml from 'react-native-render-html';
import Constants from '../../util/Constants';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class ZoomImageScreen extends Component {
  render() {
    return (
      <ScrollView>
        <View style={{backgroundColor: 'white', flex: 1}}>
          <View style={{flex: 1}}>
            <ImageZoom
              cropWidth={deviceWidth}
              cropHeight={400}
              imageWidth={deviceWidth}
              imageHeight={400}>
              <Image
                style={{
                  width: deviceWidth,
                  height: 400,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}
                source={{uri: this.props.image}}
              />
            </ImageZoom>
          </View>
          <View
            style={{
              flex: 0.4,
              margin: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: 'black',
              }}>
              Name : {this.props.CollectorName}
            </Text>
            <TouchableOpacity
              onPress={() => {
                this.dialCall();
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: 'black',
                }}>
                {this.props.PhoneNumber}
              </Text>
            </TouchableOpacity>
            <RenderHtml source={{html:this.props.CollectorInfo}} />
            <TouchableOpacity
              style={{alignSelf: 'flex-start', marginTop: 10}}
              onPress={() => {
                Actions.pop();
              }}>
              <ButtonBack />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  dialCall() {
    let phoneNumber = '';
    let number = this.props.PhoneNumber;
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  }
}

export default ZoomImageScreen;

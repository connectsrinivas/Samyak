/*************************************************
 * SukraasLIS
 * @exports
 * @class SOSScreen.js
 * @extends Component
 * Created by Sankar on 25/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import LoadingScreen from '../common/LoadingScreen';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';

import {Actions} from 'react-native-router-flux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

export default class TipsListRow extends Component {
  render() {
    return this._renderBodyView();
  }

  _screenLoading = () => {
    return <LoadingScreen />;
  };

  _renderBodyView = () => {
    return (
      <View style={styles.mainContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={styles.headerLeftView}>
            <Text style={styles.startText}>{this.props.title} </Text>
            <Text
              style={{
                marginTop: -5,
                paddingVertical: 5,
                marginLeft: 5,
                fontSize: Constants.FONT_SIZE.S,
              }}>
              {this.props.date}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              Actions.pop();
            }}>
            <Image
              style={styles.headerRightImage}
              resizeMode="contain"
              source={require('../../images/black_cross.png')}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.innerContainer}>
          <KeyboardAwareScrollView>
            <Text style={styles.centerText}>{this.props.content}</Text>

            {/* <TouchableOpacity style={styles.yesButton}>
             <Text style={styles.buttonText}> Yes</Text>
           </TouchableOpacity>
 
           <TouchableOpacity style={styles.noButton}>
             <Text style={styles.buttonText}> No </Text>
           </TouchableOpacity> */}
          </KeyboardAwareScrollView>
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#eef3fd',
    padding: 10,
  },

  innerContainer: {
    backgroundColor: '#e1ebf9',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 5,
    padding: 10,
    marginHorizontal: 15,
    borderRadius: 5,
    marginVertical: 20,
  },

  startText: {
    color: 'black',
    fontSize: Constants.FONT_SIZE.XXL,
    marginLeft: 5,
  },

  centerText: {
    color: 'black',
    fontSize: Constants.FONT_SIZE.M,
    paddingTop: 30,
    marginHorizontal: 10,
  },

  yesButton: {
    backgroundColor: '#58afff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    width: deviceWidth / 1.3,
    marginTop: 50,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 1.0,
    elevation: 6,
    shadowRadius: 15,
  },

  noButton: {
    backgroundColor: '#fc464f',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    width: deviceWidth / 1.3,
    marginTop: 20,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 1.0,
    elevation: 6,
    shadowRadius: 15,
  },

  buttonText: {
    fontSize: Constants.FONT_SIZE.L,
    paddingVertical: 10,
    color: '#FFFFFF',
  },

  headerRightImage: {
    flex: 1,
    width: deviceHeight / 40,
    height: deviceHeight / 40,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginRight: 5,
    marginLeft: 5,
  },
  headerLeftView: {
    flex: 1,
  },
});

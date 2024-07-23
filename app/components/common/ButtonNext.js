import React, {Component} from 'react';
import {Text, View, StyleSheet, Dimensions, Image} from 'react-native';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';

const deviceWidth = Dimensions.get('window').width;

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

export default class ButtonNext extends Component {
  render() {
    return (
      <View style={styles.nextMainView}>
        <Text style={styles.nextText}>Next</Text>
        <Image
          style={styles.nextImage}
          resizeMode="contain"
          source={require('../../images/chevron-right.png')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  nextMainView: {
    marginVertical: 0,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    backgroundColor: '#676767',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  nextText: {
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'right',
    alignItems: 'center',
    alignSelf: 'center',
    color: 'white',
    fontSize: Constants.FONT_SIZE.M,
    paddingRight: 10,
    paddingLeft: 10,
  },
  nextImage: {
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    alignSelf: 'center',
    width: deviceHeight / 35,
    height: deviceHeight / 35,
  },
});

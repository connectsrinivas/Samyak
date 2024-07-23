import React, {Component} from 'react';
import {Text, View, StyleSheet, Dimensions, Image} from 'react-native';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';

const deviceWidth = Dimensions.get('window').width;

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

export default class ButtonBack extends Component {
  render() {
    return (
      <View style={styles.nextMainView}>
        <Text style={styles.nextText}>Back</Text>
        <Image
          style={styles.nextImage}
          resizeMode="contain"
          source={require('../../images/chevron-left.png')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  nextMainView: {
    marginVertical: 0,
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
    backgroundColor: '#676767',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  nextText: {
    justifyContent: 'center',
    alignContent: 'center',
    paddingRight: 10,
    paddingLeft: 10,
    textAlign: 'right',
    alignItems: 'center',
    color: 'white',
    fontSize: Constants.FONT_SIZE.M,
  },
  nextImage: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: deviceHeight / 35,
    height: deviceHeight / 35,
  },
});

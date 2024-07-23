/*************************************************
 * SukraasLIS
 * @exports
 * @class ScanBarcodeView.js
 * @extends Component
 * Created by Sankar on 12/05/2020
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
  FlatList,
  Platform,
  Alert,
} from 'react-native';

import Utility from '../../util/Utility';
import Constants from '../../util/Constants';
import {Actions} from 'react-native-router-flux';
import DeviceInfo from 'react-native-device-info';
import Permissions from 'react-native-permissions';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

const DATA = [
  {
    title: 'ACTH adrenocorticotropic hormone',
  },
  {
    title: 'progesterone',
  },
];

export default class ScanBarcodeView extends Component {
  render() {
    return (
      <View style={styles.barcodeMainView}>
        <Text style={styles.barcodeMainTitle}>Scan Barcode</Text>
        <View style={styles.barcodeTextScanView}>
          <View style={styles.barcodeTextSubmitView}>
            <Text style={styles.barcodeText}>{this.props.QrCodeValue}</Text>
            <Image
              style={styles.barcodeTextVerifyImage}
              resizeMode="contain"
              source={require('../../images/tick.png')}
            />
          </View>
          <TouchableOpacity
            style={styles.barcodeScanView}
            onPress={() => {
              this._openScanner();
            }}>
            <Image
              style={styles.barcodeScanImage}
              resizeMode="contain"
              source={require('../../images/scan.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.barcodeListItemView}>
          <FlatList
            data={DATA}
            renderItem={({item}) => <Item title={item.title} />}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    );
  }

  _openScanner = () => {
    if (Platform.OS === 'ios') {
      Actions.QRScanner();
    } else {
      const systemVersion = DeviceInfo.getSystemVersion();
      if (parseFloat(systemVersion) >= 6) {
        Permissions.check('android.permission.CAMERA').then(response => {
          if (response === 'granted') {
            Actions.QRScanner();
          } else {
            Permissions.request('android.permission.CAMERA').then(
              permission => {
                if (permission === 'granted') {
                  Actions.QRScanner();
                } else {
                  Alert.alert('Please Allow access to scan QR Code');
                }
              },
            );
          }
        });
      } else {
        Actions.QRScanner();
      }
    }
  };
}

function Item({title}) {
  return (
    <View style={styles.barcodeListItemContainer}>
      <Text style={styles.barcodeListItemText}>{title}</Text>
      <Image
        style={styles.barcodeListItemImage}
        resizeMode="contain"
        source={require('../../images/tick.png')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  barcodeMainView: {
    backgroundColor: '#F2F2F2',
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  barcodeMainTitle: {
    fontSize: Constants.FONT_SIZE.SM,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  barcodeTextScanView: {flexDirection: 'row'},
  barcodeTextSubmitView: {
    flex: 5,
    flexDirection: 'row',
    backgroundColor: '#DDDBDB',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
  },
  barcodeScanView: {flex: 1, alignContent: 'center'},
  barcodeScanImage: {
    flex: 1,
    marginStart: 10,
    alignSelf: 'center',
    width: deviceHeight / 25,
    height: deviceHeight / 25,
  },
  barcodeText: {
    flex: 10,
    alignSelf: 'center',
    fontSize: Constants.FONT_SIZE.M,
  },
  barcodeTextVerifyImage: {
    flex: 1,
    alignSelf: 'center',
    width: deviceHeight / 35,
    height: deviceHeight / 35,
  },
  barcodeListItemView: {padding: 10},
  barcodeListItemContainer: {flexDirection: 'row', padding: 3},
  barcodeListItemText: {
    fontSize: Constants.FONT_SIZE.SM,
    color: '#878789',
  },
  barcodeListItemImage: {
    alignSelf: 'center',
    marginLeft: 10,
    width: deviceHeight / 65,
    height: deviceHeight / 65,
  },
});

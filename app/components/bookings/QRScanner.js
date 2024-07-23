import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
// import {RNCamera} from 'react-native-camera';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import {Actions} from 'react-native-router-flux';

export default class QRScanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowLoading: false,
      loadingText: 'LOADING',
      cameraPermission: false,
      data: 'null',
    };
    this.onBarCodeRead = this.onBarCodeRead.bind(this);
  }

  barcodeRecognized = ({barcodes}) => {
    barcodes.map(this.onBarCodeRead);
  };

  /*
   * On QR code reads
   */

  onBarCodeRead(e) {
    if (e.data) {
      this.setState({isShowLoading: true});
      this.setState({data: e.data});
      this.replaceScreen(e.data);
    } else {
      console.log('Error in qrcode :' + JSON.stringify(e));
    }
  }

  /*
   * Navigate and remove the privious screen
   */
  replaceScreen = qrData => {
    Actions.pop({refresh: {QR_Code_Value: qrData}, timeout: 1});
  };

  render() {
    if (this.state.isShowLoading) {
      return (
        <View style={styles.loadingView}>
          <ActivityIndicator color="red" size={'small'} />
          <Text style={{fontSize: deviceHeight / 45, margin: deviceWidth / 24}}>
            {this.state.loadingText}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          {/* <RNCamera
            style={styles.preview}
            onGoogleVisionBarcodesDetected={this.barcodeRecognized}
            ref={cam => (this.camera = cam)}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}>
            <View style={styles.rectangle}>
              <View style={styles.rectangleColor} />
              <View style={styles.topLeft} />
              <View style={styles.topRight} />
              <View style={styles.bottomLeft} />
              <View style={styles.bottomRight} />
            </View>
          </RNCamera> */}
          <View style={styles.close}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => {
                this.setState({isShowLoading: true});
                Actions.pop();
              }}>
              <Image
                resizeMode="contain"
                style={styles.buttonIcon}
                source={require('../../images/Back.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    alignItems: 'center',
  },
  buttonIcon: {
    height: deviceWidth * 0.1,
    width: deviceWidth * 0.16,
  },
  backBtn: {
    marginTop: 20,
  },
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rectangle: {
    position: 'absolute',
    borderLeftColor: 'rgba(0, 0, 0, .6)',
    borderRightColor: 'rgba(0, 0, 0, .6)',
    borderTopColor: 'rgba(0, 0, 0, .6)',
    borderBottomColor: 'rgba(0, 0, 0, .6)',
    borderLeftWidth: deviceWidth / 1,
    borderRightWidth: deviceWidth / 1,
    borderTopWidth: deviceHeight / 3,
    borderBottomWidth: deviceHeight / 1,
  },
  rectangleColor: {
    height: deviceWidth / 1.4,
    width: deviceWidth / 1.1,
    backgroundColor: 'transparent',
  },
  topLeft: {
    width: 50,
    height: 50,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    position: 'absolute',
    left: -1,
    top: -1,
    borderLeftColor: 'green',
    borderTopColor: 'green',
  },
  topRight: {
    width: 50,
    height: 50,
    borderTopWidth: 2,
    borderRightWidth: 2,
    position: 'absolute',
    right: -1,
    top: -1,
    borderRightColor: 'green',
    borderTopColor: 'green',
  },
  bottomLeft: {
    width: 50,
    height: 50,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    position: 'absolute',
    left: -1,
    bottom: -1,
    borderLeftColor: 'green',
    borderBottomColor: 'green',
  },
  bottomRight: {
    width: 50,
    height: 50,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    position: 'absolute',
    right: -1,
    bottom: -1,
    borderRightColor: 'green',
    borderBottomColor: 'green',
  },
  close: {
    position: 'absolute',
    width: deviceWidth,
  },
});

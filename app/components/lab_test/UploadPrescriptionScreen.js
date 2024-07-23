/*************************************************
 * SukraasLIS
 * @exports
 * @class AddUsersScreen.js
 * @extends Component
 * Created by Monisha on 29/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import { Actions } from 'react-native-router-flux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { checkMultiple, PERMISSIONS } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
import Permissions from 'react-native-permissions';
import LabTestScreen from '../lab_test/LabTestScreen';
import LoadingScreen from '../common/LoadingScreen';
import DocumentPicker from 'react-native-document-picker';
import { AsyncStorage } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import store from '../../store';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
var RNFS = require('react-native-fs');

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images',
    mediaType: 'photo',
  },
};


class UploadPrescriptionScreen extends Component {
  //  static propTypes = {};
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      dob: '',
      gender: '',
      relation: '',
      selectedGender: '',
      filePath: '',
      fileData: {},
      fileUri: '',
      fileType: '',
      isUploading: false,
      fileName: '',
    };
  }

  _closeClick = () => {
    const { fileUri, fileType, fileData, fileName } = this.state;
    Actions.pop({
      refresh: {
        fileUri: fileUri,
        fileData: [{ uri: fileUri, type: fileType, name: fileName }],
      },
      timeout: 1,
    });
  };


  _chooseDocumented = async function () {
    this.setState({ isUploading: true });
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      console.log('res Documents', res);
      if (
        res.type === 'image/jpeg' ||
        res.type === 'image/jpg' ||
        res.type === 'image/png' ||
        res.type === 'application/tif' ||
        res.type === 'application/gif' ||
        res.type === 'application/svg' ||
        res.type === 'application/pdf'
      ) {
        if (store.getState().configState.uploadSize !== '') {
          if (store.getState().configState.uploadSize > res.size) {
            if (Platform.OS === 'ios') {
              const decodedPath = decodeURIComponent(res.uri);

              Actions.pop({
                refresh: {
                  fileUri: decodedPath,
                  fileType: res.type,
                  fileData: [{ uri: decodedPath, type: res.type, name: res.name }],
                },
                timeout: 1,
              });
            } else {
              this._covertBase64(res.uri, res.type, res.name);
            }
          } else {
            this.setState({ isUploading: false });
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              'File size should be less than ' + this._convertByteToMB(),
            );
          }
        } else {
          if (Platform.OS === 'ios') {
            const decodedPath = decodeURIComponent(res.uri);

            Actions.pop({
              refresh: {
                fileUri: decodedPath,
                fileData: [{ uri: decodedPath, type: res.type, name: res.name }],
              },
              timeout: 1,
            });
          } else {
            this._covertBase64(res.uri, res.type, res.name);
          }
        }
      } else {
        this.setState({ isUploading: false });
        Utility.showAlert(
          Constants.ALERT.TITLE.ERROR,
          Constants.VALIDATION_MSG.UPLOAD_FORMAT,
        );
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        this.setState({ isUploading: false });
      } else {
        throw err;
      }
    }
  };


  // _convertByteToMB = () => {
  //   var bytes = store.getState().configState.uploadSize;
  //   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  //   if (bytes === 0) {
  //     return '0 Byte';
  //   }
  //   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  //   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  // };
  _convertByteToMB = () => {
    var bytes = store.getState().configState.uploadSize;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === '') {
      return 'Invalid size';
    }
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };





  _covertBase64 = (uri, type, name) => {
    var str_array = type.split('/');
    RNFetchBlob.fs.readFile(uri, 'base64')
      .then(data => {
        this.setState(
          {
            fileData: data,
            fileUri: uri,
            fileType: type,
            fileName: name,
          },
          () => {
            const { fileUri, fileType, fileData, fileName } = this.state;
            Actions.pop({
              refresh: {
                fileUri: fileUri,
                fileType: fileType,
                fileData: {
                  base64: fileData,
                  type: fileType,
                  fileUri: fileUri,
                  fileName: fileName,
                },
              },
              timeout: 1,
            });
          }
        );
      })
      .catch(error => {
        console.error('Error reading file:', error);
      });
  };

  _openGallery = () => {
    const options = {
      mediaType: 'photo',
      maxHeight: 200,
      maxWidth: 200,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        console.log('Selected image:', response.assets[0]);
        const { uri, type, fileName } = response.assets[0];
        this.setState(
          {
            fileUri: uri,
            fileType: type,
            fileName,
          },
          () => {
            const { fileUri, fileType, fileName } = this.state;
            Actions.pop({
              refresh: {
                fileUri,
                fileType,
                fileData: {
                  base64: response.assets[0].base64,
                  type: fileType,
                  fileUri,
                  fileName,
                },
              },
              timeout: 1,
            });
          },
        );
      }
    }, error => {
      console.log('ImagePicker Error: ', error);
    });
  };



  _clickPicture = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 200,
      maxHeight: 200,
      quality: 0.5,
      saveToPhotos: true,
    };

    launchCamera(options, response => {
      if (!response.didCancel) {
        console.log('Selected image:', response.assets[0]);
        // Call _launchCameraPic() here
        this._launchCameraPic();
      } else if (response.errorCode === 'cameraPermission') {
        Alert.alert('Camera permission is disabled. Please enable it in settings');
      } else if (response.errorCode === 'cameraUnavailable') {
        Alert.alert('No camera available');
      }
    });
  };




  _localPath = (image, response) => {
    console.log('Cache directory path is ', image);
    const fileName = image.split('/').pop();
    console.log('Filename is ', fileName);
    const newPath = `${RNFS.TemporaryDirectoryPath}/${new Date().getTime()}.jpg`; // You don't really need the `'file://` prefix
    console.log(newPath);

    // COPY the file
    RNFS.copyFile(image, newPath)
      .then(() => {
        console.log('IMG COPIED!');
        console.log(newPath);
        const decodedPath = decodeURIComponent(newPath);
        console.log('decodedPath', decodedPath);
        RNFS.exists(decodedPath)
          .then(() => {
            console.log('IMG THERE!');
          })
          .catch(error => {
            console.log(error.message);
          });

        Actions.pop({
          refresh: {
            fileUri: newPath,
            fileData: {
              base64: response.assets[0].base64,
              type: response.assets[0].type,
              fileUri: decodedPath,
              fileName: fileName,
            },
          },
          timeout: 1,
        });
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  _launchCameraPic = () => {
    this.setState({ isUploading: true });

    const options = {
      mediaType: 'photo',
      maxWidth: 200,
      maxHeight: 200,
      quality: 0.5,
      saveToPhotos: true,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({ isUploading: false });
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        this.setState({ isUploading: false });
        if (response.errorCode === 'cameraPermission') {
          Alert.alert('Camera permission is disabled. Please enable it in settings');
        } else if (response.errorCode === 'cameraUnavailable') {
          Alert.alert('No camera available');
        }
      } else {
        console.log('Image URI: ', response.assets[0].uri);
        console.log('Image type: ', response.assets[0].type);
        console.log('Image name: ', response.assets[0].fileName);
        console.log('Image size: ', response.assets[0].fileSize);

        const { uri, type, fileName } = response.assets[0];
        if (store.getState().configState.uploadSize !== '') {
          if (store.getState().configState.uploadSize > response.assets[0].fileSize) {
            this.setState(
              {
                fileUri: uri,
                fileType: type,
                fileName,
              },
              () => {
                const { fileUri, fileType, fileName } = this.state;
                Actions.pop({
                  refresh: {
                    fileUri,
                    fileType,
                    fileData: {
                      base64: response.assets[0].base64,
                      type: fileType,
                      fileUri,
                      fileName,
                    },
                  },
                  timeout: 1,
                });
              },
            );
          } else {
            this.setState({ isUploading: false });
            Utility.showAlert(
              Constants.ALERT.TITLE.ERROR,
              'File size should be less than ' + this._convertByteToMB(),
            );
          }
        } else {
          this.setState(
            {
              fileUri: uri,
              fileType: type,
              fileName,
            },
            () => {
              const { fileUri, fileType, fileName } = this.state;
              Actions.pop({
                refresh: {
                  fileUri,
                  fileType,
                  fileData: {
                    base64: response.assets[0].base64,
                    type: fileType,
                    fileUri,
                    fileName,
                  },
                },
                timeout: 1,
              });
            },
          );
        }
      }
    });
  };



  _renderContentView() {
    return (
      <View
        style={{
          borderRadius: 0.5,
          flex: 1,
          height: Platform.OS == 'ios' ? deviceHeight + 20 : deviceHeight - 150,
          borderStyle: 'dashed',
          borderWidth: 1,
          top: 10,
          marginBottom: 30,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Constants.COLOR.UPLOAD_FILES_BG,
        }}>
        <Image source={require('../../images/cloud_upload.png')} />
        <Text
          style={{
            fontSize: Constants.FONT_SIZE.XXL,
            fontWeight: '500',
            paddingVertical: 20,
          }}>
          BROWSE FILES HERE
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: Constants.FONT_SIZE.M,
            paddingHorizontal: Platform.OS == 'ios' ? 60 : 40,
          }}>
          Take a picture or Browse files here of browse your device
        </Text>
        <TouchableOpacity
          onPress={() => {
            this._openGallery();
          }}
          style={{
            backgroundColor: Constants.COLOR.CUSTOMER_CALL_BG_COLOR,
            marginTop: 30,
            paddingVertical: 10,
            width: deviceHeight * 0.25,
            borderRadius: 20,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: Constants.FONT_SIZE.S,
              color: Constants.COLOR.WHITE_COLOR,
            }}>
            BROWSE FILES
          </Text>
        </TouchableOpacity>
        <Text style={{ paddingVertical: 10 }}>or</Text>
        <TouchableOpacity
          onPress={() => {
            this._clickPicture();
          }}
          style={{
            backgroundColor: Constants.COLOR.CUSTOMER_CALL_BG_COLOR,
            paddingVertical: 10,
            width: deviceHeight * 0.25,
            borderRadius: 20,
          }}>
          <Text
            style={{
              fontSize: Constants.FONT_SIZE.S,
              color: Constants.COLOR.WHITE_COLOR,
              textAlign: 'center',
              left: Platform.OS == 'ios' ? 0 : 0,
              paddingHorizontal: 10,
            }}>
            CLICK A PICTURE
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  _renderUploadPrescriptionView = () => {
    return (
      <KeyboardAwareScrollView
        style={[styles.mainContainer, { paddingHorizontal: 25 }]}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginTop: 25,
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: Constants.FONT_SIZE.XL,
              paddingVertical: 16,
              color: Constants.COLOR.BUTTON_BG,
              fontWeight: '600',
            }}>
            Upload Prescription
          </Text>
          <TouchableOpacity
            onPress={() => {
              this._closeClick();
            }}>
            <Image
              style={[styles.closeImageStyle]}
              source={require('../../images/black_cross.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        {this._renderContentView()}
      </KeyboardAwareScrollView>
    );
  };

  render() {
    if (this.state.isUploading) {
      return <LoadingScreen />;
    } else {
      return this._renderUploadPrescriptionView();
    }
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Constants.COLOR.LAB_SEARCH_SCREEN_BG,
  },
  closeImageStyle: {
    alignSelf: 'flex-end',
    marginVertical: 16,
    width: deviceHeight / 35,
    height: deviceHeight / 35,
  },
  loginText: {
    color: 'white',
    fontSize: Constants.FONT_SIZE.L,
  },
  textinput: {
    flex: 1,
    color: Constants.COLOR.THEME_COLOR_2,
    padding: 5,
    fontSize: Constants.FONT_SIZE.L,
  },
});

export default UploadPrescriptionScreen;








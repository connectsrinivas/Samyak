// /* eslint-disable no-undef */
// /* eslint-disable react-native/no-inline-styles */
// /*************************************************
//  * SukraasLIS
//  * @exports
//  * @class PdfReport.js
//  * @extends Component
//  * Created by Kishore on 13/07/2020
//  * Copyright © 2020 SukraasLIS. All rights reserved.
//  *************************************************/

// 'use strict';
// import React, {Component} from 'react';
// import {
//   Text,
//   View,
//   Dimensions,
//   Platform,
//   StyleSheet,
//   Image,
//   PermissionsAndroid,
//   Alert,
// } from 'react-native';
// import Utility from '../../util/Utility';
// import Constants from '../../util/Constants';
// const deviceHeight = Utility.isiPhoneX()
//   ? Constants.SCREEN_SIZE.PLUS_SIZE
//   : Dimensions.get('window').height;
// const deviceWidth = Dimensions.get('window').width;

// import WebView from 'react-native-webview';
// import Pdf from 'react-native-pdf';
// import {TouchableOpacity} from 'react-native';
// import {Actions} from 'react-native-router-flux';
// import ButtonBack from '../common/ButtonBack';
// import RNFetchBlob from 'rn-fetch-blob';
// import Share from 'react-native-share';

// export default class pdfReport extends Component {
//   constructor(props) {
//     super(props);
//     this.WebView = null;
//   }
//   render() {
//     console.log('Nameeee ', this.props.Pt_Name);
//     if (Platform.OS === 'ios') {
//       return (
//         <View style={styles.mainContainer}>
//           <View
//             style={{
//               flexDirection: 'row',
//               alignItems: 'flex-end',
//               justifyContent: 'flex-end',
//             }}>
//             <TouchableOpacity
//               onPress={() => {
//                 console.log('OnPress Download Icon');
//                 this._onDownloadClick();
//               }}>
//               <Image
//                 style={[styles.closeImageStyle]}
//                 source={require('../../images/download.png')}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={() => {
//                 console.log('OnPress Share Icon');
//                 this._onShareClick();
//               }}>
//               <Image
//                 style={[styles.closeImageStyle]}
//                 source={require('../../images/share.png')}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//           </View>
//           <WebView
//             ref={ref => (this.WebView = ref)}
//             source={{
//               uri: this.props.pdfURL,
//             }}
//             onError={error => {
//               console.log(error);
//             }}
//             style={styles.subContainer}
//             scalesPageToFit
//           />
//           <View style={styles.buttonBackView}>
//             <TouchableOpacity
//               onPress={() => {
//                 Actions.pop();
//               }}>
//               <ButtonBack />
//             </TouchableOpacity>
//           </View>
//         </View>
//       );
//     } else {
//       return (
//         <View style={styles.mainContainer}>
//           <View
//             style={{
//               flexDirection: 'row',
//               alignItems: 'flex-end',
//               justifyContent: 'flex-end',
//             }}>
//             <TouchableOpacity
//               onPress={() => {
//                 console.log('OnPress Download Icon');
//                 this._onDownloadClick();
//               }}>
//               <Image
//                 style={[styles.closeImageStyle]}
//                 source={require('../../images/download.png')}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={() => {
//                 console.log('OnPress Share Icon');
//                 this._onShareClick();
//               }}>
//               <Image
//                 style={[styles.closeImageStyle]}
//                 source={require('../../images/share.png')}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//           </View>
//           <Pdf
//             source={{
//               uri: this.props.pdfURL,
//             }}
//             onLoadComplete={(numberOfPages, filePath) => {
//               console.log(`number of pages: ${numberOfPages}`);
//             }}
//             onPageChanged={(page, numberOfPages) => {
//               console.log(`current page: ${page}`);
//             }}
//             onError={error => {
//               console.log(error);
//             }}
//             onPressLink={uri => {
//               console.log(`Link presse: ${uri}`);
//             }}
//             style={styles.subContainer}
//           />
//           <View style={styles.buttonBackView}>
//             <TouchableOpacity
//               onPress={() => {
//                 Actions.pop();
//               }}>
//               <ButtonBack />
//             </TouchableOpacity>
//           </View>
//         </View>
//       );
//     }
//   }
//   _onShareClick = async () => {
//     let fileUrl = this.props.pdfURL;
//     let filePath = null;
//     let file_url_length = fileUrl.length;
//     const configOptions = {fileCache: true};
//     RNFetchBlob.config(configOptions)
//       .fetch('GET', fileUrl)
//       .then(resp => {
//         filePath = resp.path();
//         return resp.readFile('base64');
//       })
//       .then(async base64Data => {
//         base64Data = 'data:application/pdf;base64,' + base64Data;
//         await Share.open({
//           url: base64Data,
//           message: this.props.Pt_Name,
//           title: 'ShareVia',
//         });
//         await RNFS.unlink(filePath);
//       });
//   };
//   _onDownloadClick = () => {
//     Alert.alert(
//       Constants.ALERT.TITLE.INFO,
//       Constants.ALERT.MESSAGE.DOWNLOAD_MESSAGE,
//       [
//         {
//           text: Constants.ALERT.BTN.YES,
//           onPress: () => {
//             if (Platform.OS === 'ios') {
//               this._downloadFiles();
//             } else {
//               try {
//                 PermissionsAndroid.request(
//                   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//                   {
//                     title: 'storage title',
//                     message: 'storage_permission',
//                   },
//                 ).then(granted => {
//                   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//                     //Once user grant the permission start downloading
//                     console.log('Storage Permission Granted.');
//                     this._downloadFiles();
//                   } else {
//                     //If permission denied then show alert 'Storage Permission
//                     // Not Granted'
//                     Alert.alert('storage_permission');
//                   }
//                 });
//               } catch (err) {
//                 //To handle permission related issue
//                 console.log('error', err);
//               }
//             }
//           },
//         },
//         {text: Constants.ALERT.BTN.NO, onPress: () => {}},
//       ],
//       {cancelable: false},
//     );
//   };

//   _downloadFiles = async () => {
//     const {config, fs} = RNFetchBlob;
//     let PictureDir = fs.dirs.PictureDir;
//     let date = new Date();
//     let options = {
//       fileCache: true,
//       addAndroidDownloads: {
//         //Related to the Android only
//         useDownloadManager: true,
//         notification: true,
//         path: PictureDir + '/' + this.props.Pt_Name,
//         description: 'Invoice Report Download',
//       },
//     };
//     config(options)
//       .fetch('GET', this.props.pdfURL)
//       .then(res => {
//         //Showing alert after successful downloading
//         console.log('res -> ', JSON.stringify(res));
//         alert('File Downloaded Successfully.');
//       });
//   };
// }

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//   },
//   subContainer: {
//     flex: 1,
//   },
//   buttonBackView: {alignSelf: 'flex-start', marginLeft: 10, marginBottom: 10},
//   closeImageStyle: {
//     alignSelf: 'flex-end',
//     margin: 16,
//     width: deviceHeight / 35,
//     height: deviceHeight / 35,
//   },
// });


import React, { Component } from 'react';
import {
  Text,
  View,
  Dimensions,
  Platform,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import Utility from '../../util/Utility';
import Constants from '../../util/Constants';
import { TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import ButtonBack from '../common/ButtonBack';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default class pdfReport extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('Nameeee ', this.props.Pt_Name);
    return (
      <View style={styles.mainContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            onPress={() => {
              console.log('OnPress Download Icon');
              this._onDownloadClick();
            }}>
            <Image
              style={[styles.closeImageStyle]}
              source={require('../../images/download.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              console.log('OnPress Share Icon');
              this._onShareClick();
            }}>
            <Image
              style={[styles.closeImageStyle]}
              source={require('../../images/share.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <Pdf
          source={{
            uri: this.props.pdfURL,
          }}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`current page: ${page}`);
          }}
          onError={error => {
            console.log(error);
          }}
          onPressLink={uri => {
            console.log(`Link presse: ${uri}`);
          }}
          style={styles.subContainer}
        />
        <View style={styles.buttonBackView}>
          <TouchableOpacity
            onPress={() => {
              Actions.pop();
            }}>
            <ButtonBack />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _onShareClick = async () => {
    let fileUrl = this.props.pdfURL;
    let filePath = null;
    let file_url_length = fileUrl.length;
    const configOptions = { fileCache: true };
    try {
      const response = await RNFetchBlob.config(configOptions).fetch('GET', fileUrl);
      filePath = response.path();
      const base64Data = await response.readFile('base64');
      const base64String = `data:application/pdf;base64,${base64Data}`;
      await Share.open({ url: base64String });
      await RNFetchBlob.fs.unlink(filePath);
    } catch (error) {
      console.error(error);
    }
  };

  _onDownloadClick = () => {
    Alert.alert(
      Constants.ALERT.TITLE.INFO,
      Constants.ALERT.MESSAGE.DOWNLOAD_MESSAGE,
      [
        {
          text: Constants.ALERT.BTN.YES,
          onPress: () => {
            if (Platform.OS === 'ios') {
              this._downloadFiles();
            } else {
              try {
                PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                  {
                    title: 'storage title',
                    message: 'storage_permission',
                  },
                ).then(granted => {
                  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    //Once user grant the permission start downloading
                    console.log('Storage Permission Granted.');
                    this._downloadFiles();
                  } else {
                    //If permission denied then show alert 'Storage Permission
                    // Not Granted'
                    Alert.alert('storage_permission');
                  }
                });
              } catch (err) {
                //To handle permission related issue
                console.log('error', err);
              }
            }
          },
        },
        { text: Constants.ALERT.BTN.NO, onPress: () => { } },
      ],
      { cancelable: false },
    );
  };

  _downloadFiles = async () => {
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let date = new Date();
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        //Related to the Android only
        useDownloadManager: true,
        notification: true,
        path: PictureDir + '/' + this.props.Pt_Name,
        description: 'Invoice Report Download',
      },
    };
    config(options)
      .fetch('GET', this.props.pdfURL)
      .then(res => {
        //Showing alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        alert('File Downloaded Successfully.');
      });
  };


}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  subContainer: {
    flex: 1,
  },
  buttonBackView: { alignSelf: 'flex-start', marginLeft: 10, marginBottom: 10 },
  closeImageStyle: {
    alignSelf: 'flex-end',
    margin: 16,
    width: deviceHeight / 35,
    height: deviceHeight / 35,
  },
});


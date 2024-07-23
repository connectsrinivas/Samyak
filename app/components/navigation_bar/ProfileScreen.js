/*************************************************
 * SukraasLIS
 * @exports
 * @class ProfileScreen.js
 * @extends Component
 * Created by Sankar on 25/05/2020
 * Copyright Ä€Ā© 2020 SukraasLIS. All rights reserved.
 *************************************************/
'use strict';
import React, { Component } from 'react';

import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Keyboard,
  View,
  Modal,
  ImageBackground,
  Platform,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import LoadingScreen from '../common/LoadingScreen';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import { Actions } from 'react-native-router-flux';
import {
  getProfileDetails,
  updateProfileDetails,
} from '../../actions/ProfileAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-datepicker';
// import * as ImagePicker from 'react-native-image-picker';
import DeviceInfo from 'react-native-device-info';
import Permissions from 'react-native-permissions';
import ButtonBack from '../common/ButtonBack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

let ProfileName = '';
const options = {
  title: 'Select Avatar',
  includeBase64: true,
  storageOptions: {
    skipBackup: true,
    path: 'images',
    mediaType: 'photo',
  },
};
class ProfileScreen extends Component {
  //  static propTypes = {
  //   isProfileLoading: PropTypes.bool,
  //   getProfileDetails: PropTypes.func,
  //   updateProfileDetails: PropTypes.func,
  //   profileDetails: PropTypes.string,
  //   isEditable: PropTypes.bool,
  //   visible: PropTypes.bool,
  // };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phoneNumber: '',
      referralCode: '',
      password: '',
      dob: '',
      gender: '',
      userImageUrl: '',
      isEditable: false,
      filePath: '',
      fileData: '',
      fileUri: '',
      fileType: '',
      isRemoveProfilePic: 'false',
      fileName: '',
      imageLoading: false,
    };
  }

  async componentWillMount() {
    //Mobile Number
    const value1 = await AsyncStorage.getItem(
      Constants.ASYNC.ASYNC_PHONE_NUMBER,
    );
    if (value1) {
      this.setState({ phoneNumber: value1 });
    }
    //Password
    const value2 = await AsyncStorage.getItem(Constants.ASYNC.ASYNC_PASSWORD);
    if (value2) {
      this.setState({ password: value2 });
      this.props.getProfileDetails(
        this.state.phoneNumber,
        this.state.password,
        callback => {
          if (callback === true) {
          }
        },
      );
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.profileDetails !== this.props.profileDetails) {
      this.setState({
        name: this.props.profileDetails.Name,
        dob: moment(this.props.profileDetails.User_DOB, 'YYYY/MM/DD').format(
          'DD/MM/YYYY',
        ),
        email: this.props.profileDetails.User_Email_Id,
        phoneNumber: this.props.profileDetails.User_Mobile_No,
        gender: this.props.profileDetails.User_Gender,
        userImageUrl: this.props.profileDetails.User_Image_URL,
      });
      ProfileName = this.props.profileDetails.Name;
      AsyncStorage.setItem(
        Constants.ASYNC.ASYNC_USER_IMAGE_URL,
        this.props.profileDetails.User_Image_URL,
      );
    }
  }
  _navigateVerificationScreen = () => {
    Actions.verificationScreen({
      isResetPassword: true,
    });
  };

  _navigateDashboardScreen = () => {
    Actions.homeTabBar();
  };

  render() {
    return this._renderScreens();
  }

  _renderScreens = () => {
    if (this.props.isProfileLoading) {
      return this._screenLoading();
    } else {
      return this._renderBodyView();
    }
  };

  _screenLoading = () => {
    return <LoadingScreen />;
  };

  handlePassword = text => {
    Alert.alert(
      'Password Change',
      'Do You Want To Change Password',
      [
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            this._navigateVerificationScreen;
          },
        },
      ],
      { cancelable: false },
    );
  };

  _closeAlert = () => {
    Alert.alert(
      'Info',
      'Do You Want To Discard Changes?',
      [
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            Actions.pop();
          },
        },
      ],
      { cancelable: false },
    );
  };
  _chooseImageAlert = () => {
    Alert.alert(
      'Upload Profile Picture',
      'Upload your profile picture Using?',
      [
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: 'Gallery',
          onPress: () => {
            this._openGallery();
          },
        },
        {
          text: 'Camera',
          onPress: () => {
            this._clickPicture();
          },
        },
      ],
      { cancelable: false },
    );
  };

  // _clickPicture = () => {
  //   if (Platform.OS === 'ios') {
  //     {
  //       this._launchCamera();
  //     }
  //   } else {
  //     const systemVersion = DeviceInfo.getSystemVersion();
  //     if (parseFloat(systemVersion) >= 6) {
  //       Permissions.check('android.permission.CAMERA').then(response => {
  //         console.log(response);
  //         if (response === 'granted') {
  //           {
  //             this._launchCamera();
  //           }
  //         } else {
  //           Permissions.request('android.permission.CAMERA').then(
  //             permission => {
  //               if (permission === 'granted') {
  //                 {
  //                   this._launchCamera();
  //                 }
  //               } else {
  //                 Alert.alert('Please Allow access to Take Picture');
  //               }
  //             },
  //           );
  //         }
  //       });
  //     } else {
  //       // Actions.QRScanner();
  //     }
  //   }
  // };

  // _launchCamera = () => {
  //   ImagePicker.launchCamera(options, response => {
  //     console.log('Launch Camera');
  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.error) {
  //       console.log('ImagePicker Error: ', response.error);
  //     } else if (response.customButton) {
  //       console.log('User tapped custom button: ', response.customButton);
  //       Alert.alert(response.customButton);
  //     } else {
  //       if (this.props.profileUploadSize !== '') {
  //         if (this.props.profileUploadSize >= response.assets[0].fileSize) {
  //           this.setState(
  //             {
  //               filePath: response.assets[0],
  //               fileData: response.assets[0].base64,
  //               fileUri: response.assets[0].uri,
  //               userImageUrl: response.assets[0].uri,
  //               fileType: response.assets[0].type,
  //               fileName: response.assets[0].fileName,
  //               isRemoveProfilePic: 'false',
  //             },
  //             () => {
  //               console.log('Profile updated');
  //             },
  //           );
  //         } else {
  //           Utility.showAlert(
  //             Constants.ALERT.TITLE.ERROR,
  //             'File size should be less than ' + this._convertByteToMB(),
  //           );
  //         }
  //       } else {
  //         this.setState(
  //           {
  //             filePath: response.assets[0],
  //             fileData: response.assets[0].base64,
  //             fileUri: response.assets[0].uri,
  //             userImageUrl: response.assets[0].uri,
  //             fileType: response.assets[0].type,
  //             fileName: response.assets[0].fileName,
  //             isRemoveProfilePic: 'false',
  //           },
  //           () => {
  //             console.log('Profile updated');
  //           },
  //         );
  //       }
  //     }
  //   });
  // };

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
        this._launchCameraPic(response.assets[0]);
      } else if (response.errorCode === 'cameraPermission') {
        Alert.alert('Camera permission is disabled. Please enable it in settings');
      } else if (response.errorCode === 'cameraUnavailable') {
        Alert.alert('No camera available');
      }
    });
  };

  _launchCameraPic = (selectedImage) => {
    if (this.props.profileUploadSize !== '') {
      if (this.props.profileUploadSize >= selectedImage.fileSize) {
        this.setState(
          {
            filePath: selectedImage,
            fileData: selectedImage.base64,
            fileUri: selectedImage.uri,
            userImageUrl: selectedImage.uri,
            fileType: selectedImage.type,
            fileName: selectedImage.fileName,
            isRemoveProfilePic: 'false',
          },
          () => {
            console.log('Profile updated');
          },
        );
      } else {
        Utility.showAlert(
          Constants.ALERT.TITLE.ERROR,
          'File size should be less than ' + this._convertByteToMB(),
        );
      }
    } else {
      this.setState(
        {
          filePath: selectedImage,
          fileData: selectedImage.base64,
          fileUri: selectedImage.uri,
          userImageUrl: selectedImage.uri,
          fileType: selectedImage.type,
          fileName: selectedImage.fileName,
          isRemoveProfilePic: 'false',
        },
        () => {
          console.log('Profile updated');
        },
      );
    }
  };

  // _openGallery = () => {
  //   if (Platform.OS === 'ios') {
  //     {
  //       this._chooseGallery();
  //     }
  //   } else {
  //     const systemVersion = DeviceInfo.getSystemVersion();
  //     if (parseFloat(systemVersion) >= 6) {
  //       Permissions.check('android.permission.CAMERA').then(response => {
  //         console.log(response);
  //         if (response === 'granted') {
  //           {
  //             this._chooseGallery();
  //           }
  //         } else {
  //           Permissions.request('android.permission.CAMERA').then(
  //             permission => {
  //               if (permission === 'granted') {
  //                 {
  //                   this._chooseGallery();
  //                 }
  //               } else {
  //                 Alert.alert('Please Allow access to open Gallery');
  //               }
  //             },
  //           );
  //         }
  //       });
  //     } else {
  //       // Actions.QRScanner();
  //     }
  //   }
  // };

  // _chooseGallery = () => {
  //   ImagePicker.launchImageLibrary(options, response => {
  //     if (response.errorCode) {
  //       if (response.errorCode === 'permission') {
  //       }
  //     } else {
  //       if (response.didCancel) {
  //       } else if (response.error) {
  //       } else if (response.errorMessage) {
  //       } else {
  //         if (this.props.profileUploadSize !== '') {
  //           if (this.props.profileUploadSize >= response.assets[0].fileSize) {
  //             this.setState(
  //               {
  //                 filePath: response.assets[0],
  //                 fileData: response.assets[0].base64,
  //                 fileUri: response.assets[0].uri,
  //                 userImageUrl: response.assets[0].uri,
  //                 fileType: response.assets[0].type,
  //                 fileName: response.assets[0].fileName,
  //                 isRemoveProfilePic: 'false',
  //               },
  //               () => {
  //                 console.log('Profile updated', response);
  //               },
  //             );
  //           } else {
  //             Utility.showAlert(
  //               Constants.ALERT.TITLE.ERROR,
  //               'File size should be less than ' + this._convertByteToMB(),
  //             );
  //           }
  //         } else {
  //           this.setState(
  //             {
  //               filePath: response.assets[0],
  //               fileData: response.assets[0].base64,
  //               fileUri: response.assets[0].uri,
  //               userImageUrl: response.assets[0].uri,
  //               fileType: response.assets[0].type,
  //               fileName: response.assets[0].fileName,
  //               isRemoveProfilePic: 'false',
  //             },
  //             () => {
  //               console.log('Profile updated', response);
  //             },
  //           );
  //         }
  //       }
  //     }
  //   });
  // };

  _openGallery = () => {
    const options = {
      mediaType: 'photo',
      maxHeight: 200,
      maxWidth: 200,
    };

    launchImageLibrary(options, response => {
      if (!response.didCancel) {
        console.log('Selected image:', response.assets[0]);
        // Call _chooseGalleryPic() here
        this._chooseGalleryPic(response.assets[0]);
      } else if (response.errorCode === 'permission') {
        Alert.alert('Gallery permission is disabled. Please enable it in settings');
      }
    }, error => {
      console.log('ImagePicker Error: ', error);
    });
  };

  _chooseGalleryPic = (selectedImage) => {
    if (this.props.profileUploadSize !== '') {
      if (this.props.profileUploadSize >= selectedImage.fileSize) {
        this.setState(
          {
            filePath: selectedImage,
            fileData: selectedImage.base64,
            fileUri: selectedImage.uri,
            userImageUrl: selectedImage.uri,
            fileType: selectedImage.type,
            fileName: selectedImage.fileName,
            isRemoveProfilePic: 'false',
          },
          () => {
            console.log('Profile updated');
          }
        );
      } else {
        Utility.showAlert(
          Constants.ALERT.TITLE.ERROR,
          'File size should be less than ' + this._convertByteToMB()
        );
      }
    } else {
      this.setState(
        {
          filePath: selectedImage,
          fileData: selectedImage.base64,
          fileUri: selectedImage.uri,
          userImageUrl: selectedImage.uri,
          fileType: selectedImage.type,
          fileName: selectedImage.fileName,
          isRemoveProfilePic: 'false',
        },
        () => {
          console.log('Profile updated');
        }
      );
    }
  };


  _validateInputs = () => {
    if (this.state.name.trim().length < 1) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_NAME,
      );
    } else if (this.state.dob.trim().length < 1) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_DOB,
      );
    } else if (this.state.phoneNumber.trim().length < 5) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_MOBILE_NO,
      );
    } else if (
      this.state.email.trim().length < 1 ||
      this._validateEmail(this.state.email) === false
    ) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.INVALID_EMAIL,
      );
    } else {
      this._updateButtonClick();
    }
  };

  _validateEmail = text => {
    if (text.trim().length > 0) {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(text) === false) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  _updateButtonClick = () => {
    let pictureExtension = '';
    if (this.state.fileType !== '') {
      pictureExtension = this.state.fileType.split('/')[1];
    } else {
      pictureExtension = '';
    }
    const Dob_Format = moment(this.state.dob, 'DD/MM/YYYY').format(
      'YYYY/MM/DD',
    );
    let postData = {
      User_Profile_Picture: this.state.fileUri,
      Picture_Extension: pictureExtension,
      UserName: this.state.phoneNumber,
      Gender: this.state.gender,
      Name: this.state.name,
      Email_Id: this.state.email,
      Dob: Dob_Format,
      isRemoveProfilePic: this.state.isRemoveProfilePic,
      profileImageName: this.state.fileName,
    };

    let body = new FormData();
    body.append('UserName', postData.UserName);
    body.append('Gender', postData.Gender);
    body.append('Name', postData.Name);
    if (this.state.isRemoveProfilePic === 'true') {
      body.append('User_Profile_Picture', '');
    } else {
      if (
        postData.User_Profile_Picture !== undefined &&
        postData.User_Profile_Picture.length > 0
      ) {
        body.append('User_Profile_Picture', {
          uri: postData.User_Profile_Picture,
          name: 'User_Profile_Picture',
          filename: postData.profileImageName,
          type: 'image/' + postData.Picture_Extension,
        });
      } else {
        body.append('User_Profile_Picture', '');
      }
    }
    body.append('Picture_Extension', postData.Picture_Extension);
    body.append('Mobile_No', postData.UserName);
    body.append('Email_Id', postData.Email_Id);
    body.append('Dob', postData.Dob);
    body.append('IsRemove_Profile_Picture', postData.isRemoveProfilePic);

    console.log('Bodyhhhh ,', body);
    this.props.updateProfileDetails(body, isSuccess => {
      if (isSuccess) {
        this.setState({
          isEditable: false,
        });
        AsyncStorage.setItem(
          Constants.ASYNC.ASYNC_USER_IMAGE_URL,
          this.state.userImageUrl,
        );
      }
    });
  };

  _convertByteToMB = () => {
    var bytes = this.props.profileUploadSize;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) {
      return '0 Byte';
    }
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };

  _showProfileView = () => {
    if (this.state.userImageUrl !== '') {
      return (
        <View style={{ flexDirection: 'row' }}>
          <Image
            onLoadStart={() => {
              this.setState({ imageLoading: true });
            }}
            style={styles.headerRightImage}
            source={{ uri: this.state.userImageUrl }}
            onLoadEnd={() => {
              this.setState({ imageLoading: false });
            }}
          />
          <ActivityIndicator
            style={styles.activityIndicator}
            animating={this.state.imageLoading}
          />
          {this.state.isEditable ? (
            <TouchableOpacity onPress={() => this._onPressRemoveProfile()}>
              <Image
                style={{ width: 20, height: 20 }}
                source={require('../../images/black_cross.png')}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      );
    } else {
      return (
        <Image
          style={styles.headerRightImage}
          source={require('../../images/profileImg.png')}
        />
      );
    }
  };

  _onPressRemoveProfile = () => {
    this.setState({
      isRemoveProfilePic: 'true',
      userImageUrl: '',
      fileName: '',
      fileType: '',
      fileUri: '',
    });
  };
  _renderBottomButtons = () => {
    return (
      <View style={styles.buttonView}>
        <TouchableOpacity
          onPress={() => {
            this.state.isEditable ? this._closeAlert() : Actions.pop();
          }}>
          <ButtonBack />
        </TouchableOpacity>
      </View>
    );
  };
  _renderBodyView = () => {
    const { name, dob, email, phoneNumber, isEditable } = this.state;
   
    return (
      <View style={styles.mainContainer}>
        <View style={styles.profileHeader}>
          <Text style={styles.profileText}>My Profile</Text>
          <TouchableOpacity
            style={styles.headerCloseImageView}
            onPress={() => {
              isEditable ? this._closeAlert() : Actions.pop();
            }}>
            <Image
              style={styles.headerCloseImage}
              resizeMode="contain"
              source={require('../../images/black_cross.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <KeyboardAwareScrollView style={styles.ScrollContainer}>
          <TouchableOpacity style={styles.editTextView}>
            <Text
              style={styles.editText}
              onPress={() => {
                this.setState({
                  isEditable: !isEditable,
                  name: this.props.profileDetails.Name,
                  email: this.props.profileDetails.User_Email_Id,
                  userImageUrl: this.props.profileDetails.User_Image_URL,
                  dob: moment(
                    this.props.profileDetails.User_DOB,
                    'YYYY/MM/DD',
                  ).format('DD/MM/YYYY'),
                });
                this.FirstName.focus();
              }}>
              {this.state.isEditable === true ? (
                <Text>Cancel</Text>
              ) : (
                <Text>Edit Profile</Text>
              )}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              this.state.isEditable ? this._chooseImageAlert() : {}
            }
            style={styles.innerContainer}>
            <Text style={styles.headerText}>{ProfileName}</Text>
            {this._showProfileView()}
          </TouchableOpacity>

          <View style={styles.secondInnerContainer}>
            <View style={styles.innerbody}>
              <Text style={styles.bodyheaderText}>Full Name</Text>
              <TextInput
                ref={input => (this.FirstName = input)}
                style={[
                  styles.bodyText,
                  { borderBottomWidth: isEditable === true ? 0.5 : 0 },
                ]}
                value={name}
                editable={isEditable}
                autoCapitalize={'none'}
                underlineColorAndroid="transparent"
                returnKeyType={'next'}
                onSubmitEditing={() => this.email.focus()}
                onChangeText={name => this.setState({ name })}
              />
            </View>

            <View style={styles.innerbody}>
              <Text style={styles.bodyheaderText}>Password</Text>
              <TextInput
                value={'*******'}
                style={[styles.bodyText]}
                editable={false}
                onChange={this.handlePassword}
              />
            </View>

            <View style={styles.innerbody}>
              <Text style={styles.bodyheaderText}>Email</Text>
              <TextInput
                ref={input => (this.email = input)}
                style={[
                  styles.bodyText,
                  { borderBottomWidth: isEditable === true ? 0.5 : 0 },
                ]}
                value={email}
                editable={isEditable}
                autoCapitalize={'none'}
                underlineColorAndroid="transparent"
                returnKeyType={'done'}
                onChangeText={email => this.setState({ email })}
              />
            </View>

            <View style={styles.innerbody}>
              <Text style={styles.bodyheaderText}>D.O.B</Text>

              <DatePicker
                style={{
                  flex: 1,
                  width: deviceWidth - 60,
                  marginVertical: 8,
                  borderBottomWidth: isEditable === true ? 0.5 : 0,
                  borderBottomColor: '#A9A9A9',
                }}
                date={dob}
                mode={'date'}
                maxDate={new Date()}
                showIcon={false}
                disabled={!isEditable}
                placeholderTextColor={Constants.COLOR.FONT_HINT}
                format={'DD/MM/YYYY'}
                confirmBtnText={'Done'}
                cancelBtnText={'Cancel'}
                onDateChange={date => {
                  this.setState({ dob: date });
                }}
                customStyles={{
                  placeholderText: {
                    fontSize: Constants.FONT_SIZE.M,
                    color: Constants.COLOR.FONT_HINT,
                  },
                  dateText: {
                    fontSize: Constants.FONT_SIZE.M,
                  },
                  dateInput: {
                    paddingVertical: deviceHeight / 133.4,
                    borderWidth: 0,
                    alignItems: 'flex-start',
                  },
                  disabled: {
                    backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
                  },
                }}
              />
           
            </View>

            <View style={styles.innerbody}>
              <Text style={styles.bodyheaderText}>Phone No/Referral code</Text>
              <TextInput
                value={phoneNumber}
                style={styles.bodyText}
                editable={false}
                keyboardType="number-pad"
                returnKeyType={'done'}
                onChangeText={phoneNumber => this.setState({ phoneNumber })}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              this.state.isEditable
                ? this._validateInputs()
                : this._navigateDashboardScreen();
            }}
            style={styles.button}>
            <Text style={styles.buttonText}>
              {' '}
              {this.state.isEditable === true ? (
                <Text>Update</Text>
              ) : (
                <Text>Home</Text>
              )}
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    );
  };
}

const mapStateToProps = (state, props) => {
  //props can be called as ownProps

  const {
    profileState: { isProfileLoading, profileDetails },
    configState: { profileUploadSize, menuList },
  } = state;

  return {
    isProfileLoading,
    profileDetails,
    profileUploadSize,
    menuList,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { getProfileDetails, updateProfileDetails },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileScreen);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
  },
  ScrollContainer: { paddingVertical: 10, paddingHorizontal: 20 },
  innerContainer: {
    flexDirection: 'row',
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondInnerContainer: {
    flexDirection: 'column',
    marginHorizontal: 10,
    paddingTop: 20,
  },
  innerbody: {
    marginVertical: 8,
  },
  headerText: {
    flex: 3,
    color: '#757677',
    fontSize: Constants.FONT_SIZE.XXXL,
    marginHorizontal: 5,
  },
  bodyheaderText: {
    fontSize: Constants.FONT_SIZE.M,
    color: '#fb5861',
    marginRight: 50,
  },
  bodyText: {
    fontSize: Constants.FONT_SIZE.M,
    color: 'black',
    marginVertical: 8,
    borderBottomColor: '#A9A9A9',
  },
  header: {
    flexDirection: 'row',
    flex: 1,
    paddingTop: 30,
  },
  button: {
    backgroundColor: '#040619',
    alignItems: 'center',
    borderRadius: 25,
    width: deviceWidth / 3.9,
    marginTop: 15,
    alignSelf: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 1.0,
    elevation: 6,
    shadowRadius: 15,
    marginBottom: 35,
  },
  buttonText: {
    fontSize: Constants.FONT_SIZE.S,
    paddingVertical: 10,
    textAlign: 'center',
    color: '#FFFFFF',
  },

  headerRightImage: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    alignContent: 'flex-end',
    borderRadius: deviceHeight / 8 / 2,
    width: deviceHeight / 8,
    height: deviceHeight / 8,
  },

  headerContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    //marginTop: 5,
    //  marginLeft: 5,
    // marginBottom: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    alignItems: 'center',
    height: 60,
  },
  profileText: {
    fontSize: Constants.FONT_SIZE.L,
    color: '#757677',
    fontWeight: 'bold',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#757677',
  },
  headerCloseImageView: {},
  headerCloseImage: {
    width: deviceHeight / 35,
    height: deviceHeight / 35,
    marginTop: 10,
    marginRight: 15,
  },
  editTextView: {
    textAlign: 'right',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    padding: 10,
  },
  editText: {
    color: '#1E75C0',
    textAlign: 'right',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
  calenderContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calenderSubContainer: {
    width: deviceWidth / 1.2,
    height: deviceWidth / 1.3,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    borderColor: Constants.COLOR.WHITE_COLOR,
    elevation: 2,
  },
  buttonView: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 0,
    flexDirection: 'row',
  },
  activityIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
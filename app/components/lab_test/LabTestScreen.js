/*************************************************
 * SukraasLIS
 * @exports
 * @class LabTestScreen.js
 * @extends Component
 * Created by Abdul Rahman on 12/05/2020
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
} from 'react-native';
import {checkNetworkConnection} from '../../actions/NetworkAction';
import Loading from '../common/Loading';
import LoadingScreen from '../common/LoadingScreen';
import Constants from '../../util/Constants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import Utility from '../../util/Utility';
import {Actions} from 'react-native-router-flux';
import LabTestTabs from './LabTestTabs';
import ButtonNext from '../common/ButtonNext';
import LabTestHeader from './LabTestHeader';
// import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import OfferScreen from '../../components/dashboard/OfferScreen';
import {getOfferDetails} from '../../actions/DashboardAction';
import {
  UploadPrescriptionAction,
  DeletePrescriptionAction,
  saveBase64Format,
  saveUriFormat,
  deleteUploadImage,
} from '../../actions/UploadPrescriptionAction';
// import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheet from 'react-native-raw-bottom-sheet'; 
import SearchListCell from './listCells/SearchListCell';
import Events from 'react-native-simple-events';
import RenderHtml from 'react-native-render-html';
import _ from 'lodash';
import store from '../../store';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

class LabTestScreen extends Component {
 //  static propTypes = {
  //   cartCount: PropTypes.number,
  //   cartArray: PropTypes.array,
  //   totalCartAmount: PropTypes.number,
  //   uploadBase64Image: PropTypes.string,
  //   uploadFileUri: PropTypes.array,

  //   UploadPrescriptionAction: PropTypes.func,
  //   DeletePrescriptionAction: PropTypes.func,
  //   saveBase64Format: PropTypes.func,
  //   saveUriFormat: PropTypes.func,
  //   deleteUploadImage: PropTypes.func,
  //   checkNetworkConnection: PropTypes.func,

  //   isUploadPrescriptionSuccess: PropTypes.bool,
  //   isUploadingPrescriptionLoading: PropTypes.bool,
  //   isNetworkConnectivityAvailable: PropTypes.bool,

  //   currency: PropTypes.string,
  //   firmName: PropTypes.string,
  //   firmNo: PropTypes.string,
  // };

  constructor() {
    super();
    this.state = {
      id: '',
      fileUri: [],
      imgData: [],
      btnNextDisabled: false,
      searchBtnClicked: false,
      uploadbtnClicked: false,
    };
  }
  componentDidMount() {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      this.willFocusSubscription = this.props.navigation.addListener(
        'willFocus',
        () => {
          this.props.getOfferDetails();
        },
      );
    } else {
      this.internetAlert(Constants.VALIDATION_MSG.NO_INTERNET);
    }
  }
  render() {
    return this._renderScreens();
  }

  componentWillReceiveProps(nextProps) {
    // Any time props.fileUri changes, update state.

    console.log('nextProps', nextProps);

    console.log('this.props.fileUri', this.props.fileUri);
    console.log('this.props.fileData', this.props.fileData);

    console.log('nextProps.fileUri', nextProps.fileUri);
    console.log('nextProps.fileData', nextProps.fileData);

    console.log('this.props.uploadBase64Image', this.props.uploadBase64Image);
    console.log('this.props.uploadFileUri', this.props.uploadFileUri);

    if (nextProps.fileUri) {
      if (this.props.fileUri !== nextProps.fileUri) {
        if (nextProps.fileUri !== '') {
          if (
            nextProps.fileType == 'image/jpeg' ||
            nextProps.fileType == 'image/png' ||
            nextProps.fileType == 'image/jpg'
          ) {
            this.setState(
              {
                fileUri: [...this.state.fileUri, nextProps.fileUri],
                imgData: [...this.state.imgData, nextProps.fileData],
              },
              () => {
                this.props.saveUriFormat(this.state.fileUri);
                this.props.saveBase64Format(this.state.imgData);
              },
            );
          } else {
            this.setState(
              {
                fileUri: [...this.state.fileUri, nextProps.fileUri],
                imgData: [...this.state.imgData, nextProps.fileData],
              },
              () => {
                this.props.saveUriFormat(this.state.fileUri);
                this.props.saveBase64Format(this.state.imgData);
              },
            );
          }
        }
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Trigger this event inorder to change the state in offer screen
    // so that button label will change everytime when you add or remove package from cart
    Events.trigger('removeFromCart', {});
    return this.props !== nextProps || this.state !== nextState;
  }

  _renderScreens = () => {
    if (false) {
      return this._screenLoading();
    } else {
      return this._renderBodyView();
    }
  };

  _screenLoading = () => {
    return <Loading />;
  };

  _renderCartItem = ({item, index}) => (
    <SearchListCell
      id={item.id}
      key={index}
      item={item}
      currency={this.props.currency}
    />
  );
  _renderSheetContent() {
    return (
      <KeyboardAwareScrollView>
        {this.props.cartArray.length > 0 ? (
          <View style={{marginBottom: 20, marginHorizontal: 5}}>
            <FlatList
              data={this.props.cartArray}
              renderItem={this._renderCartItem}
              keyExtractor={this._keyExtractor}
            />

            <View style={styles.totalText}>
              <RenderHtml
                baseFontStyle={styles.totalText}
                source={{html:
                  'Total Cart Value ' +
                  this.props.currency +
                  ' ' +
                  this.props.totalCartAmount
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                this.RBSheet.close();
                this._nextClick();
              }}>
              <View style={styles.buttonBackground}>
                <Text style={styles.buttonTitle}> PROCEED </Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.notes}>
              Note : * - Indicates Non Discounted Test
            </Text>
          </View>
        ) : (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              alignSelf: 'center',
              alignContent: 'center',
            }}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: Constants.FONT_SIZE.L,
                color: Constants.COLOR.BLACK_COLOR,
              }}>
              Cart is Empty
            </Text>
          </View>
        )}
      </KeyboardAwareScrollView>
    );
  }

  _renderBodyView = () => {
    return (
      <View style={styles.mainView}>
        {<LabTestHeader selectValue={1} />}
        <KeyboardAwareScrollView style={styles.mainContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Choose Test</Text>
            <View style={styles.titleCartValueContainer}>
              <Text style={styles.titleCartValueLabel}>Cart value</Text>
              <RenderHtml
                baseFontStyle={styles.titleCartValueAmount}
                source={{html:this.props.currency + ' ' + this.props.totalCartAmount}}
              />
            </View>
          </View>

          {this._searchCartView()}
          <View>
            <FlatList
              style={{alignSelf: 'flex-end', marginTop: 10}}
              data={this.props.uploadBase64Image}
              extraData={this.props.uploadBase64Image}
              keyExtractor={(item, index) => item}
              renderItem={this.imageList}
              horizontal={true}
              ItemSeparatorComponent={this.itemSeparatorComponent}
            />
          </View>
          {this._uploadButton()}
          {this._renderPackage()}
          {this._renderButton()}
        </KeyboardAwareScrollView>
        <BottomSheet 
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={deviceHeight * (3 / 5)}
          duration={250}
          animationType={'fade'}
          // closeOnDragDown={true}
          customStyles={{
            container: {
              // justifyContent: 'center',
              // alignItems: 'center',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: '#EBF0F1',
            },
          }}>
          {this._renderSheetContent()}
        </BottomSheet >
      </View>
    );
  };
  itemSeparatorComponent = () => {
    return (
      <View
        style={{
          height: '100%',
          width: 5,
        }}
      />
    );
  };

  deleteItemByIndex = (index, item) => {
    if (this.props.uploadBase64Image.length > 1) {
      const filteredData = this.props.uploadBase64Image.filter(
        fitem => fitem.fileUri !== item.fileUri,
      );
      console.log('deleteItemByIndex filteredData', filteredData);

      this.setState(
        {
          fileUri: filteredData,
          imgData: filteredData,
        },
        () => {
          this.props.saveUriFormat(this.state.fileUri);
          this.props.saveBase64Format(this.state.imgData);
        },
      );
    } else {
      this.setState(
        {
          fileUri: [],
          imgData: [],
        },
        () => {
          this.props.deleteUploadImage();
        },
      );
    }
  };

  _showImageIcon = item => {
    if (
      item.type === 'image/jpeg' ||
      item.type === 'image/png' ||
      item.type === 'image/jpg' ||
      item.type === 'jpeg' ||
      item.type === 'png' ||
      item.type === 'jpg'
    ) {
      return (
        <Image
          style={{
            width: 50,
            height: 50,
            alignContent: 'flex-end',
            alignSelf: 'flex-end',
            marginRight: 10,
          }}
          source={{uri: item.fileUri}}
          resizeMode="contain"
        />
      );
    } else {
      return (
        <Image
          style={{
            width: 50,
            height: 50,
            alignContent: 'flex-end',
            alignSelf: 'flex-end',
            marginRight: 10,
          }}
          source={require('../../images/pdficon.png')}
          resizeMode="contain"
        />
      );
    }
  };
  imageList = ({item, index}) => {
    Utility.myLog('******************Item ******************' + item);

    return (
      <View>
        {this._showImageIcon(item)}

        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 5,
            top: 0,
            bottom: 0,
          }}
          onPress={() => {
            this.deleteItemByIndex(index, item);
          }}>
          <Image
            style={{
              width: 15,
              height: 15,
              overflow: 'visible',
            }}
            source={require('../../images/closeImageSmall.png')}
          />
        </TouchableOpacity>
      </View>
    );
  };

  _searchCartView = () => {
    const {cartCount, cartArray} = this.props;
    return (
      <TouchableOpacity
        disabled={this.state.searchBtnClicked}
        onPress={() => {
          this._navigateLabSearch();
          this.setState({
            searchBtnClicked: true,
          });
          setTimeout(() => {
            this.setState({
              searchBtnClicked: false,
            });
          }, 1000);
        }}>
        <View style={styles.searchCartView}>
          <Image
            style={styles.searchImage}
            resizeMode="contain"
            source={require('../../images/search.png')}
          />
          <Text style={styles.searchLabel}>Select Test</Text>
          <TouchableOpacity
            onPress={() => {
              cartArray.length > 0
                ? this.RBSheet.open()
                : alert('Cart is empty');
            }}
            style={styles.searchCartRightView}>
            <Image
              style={styles.cartImage}
              resizeMode="contain"
              source={require('../../images/addCart.png')}
            />
            {cartArray.length > 0 ? (
              <View style={styles.cartCountView}>
                <Text
                  style={
                    cartArray.length >= 10
                      ? [styles.cartCount]
                      : styles.cartCount
                  }>
                  {cartArray.length}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };
  _uploadButton = () => {
    if (this.props.isUploadingPrescriptionLoading) {
      return <LoadingScreen />;
    } else {
      if (this.props.uploadFileUri.length > 1) {
        return <View />;
      } else {
        return (
          <TouchableOpacity
            disabled={this.state.uploadbtnClicked}
            style={styles.uploadButtonView}
            onPress={() => {
              this.setState({
                uploadbtnClicked: true,
              });
              Actions.uploadPrescriptionScreen();
              setTimeout(() => {
                this.setState({
                  uploadbtnClicked: false,
                });
              }, 1000);
            }}>
            <Image
              style={styles.uploadImage}
              resizeMode="contain"
              source={require('../../images/up_arrow.png')}
            />
            <Text style={styles.uploadLabel}>Upload Prescription</Text>
          </TouchableOpacity>
        );
      }
    }
  };

  _tabView = () => {
    return (
      <View style={styles.tabView}>
        <LabTestTabs />
      </View>
    );
  };

  _renderPackage = () => {
    return (
      <View style={styles.packageView}>
        <OfferScreen isFromLabs={true} />
      </View>
    );
  };

  _renderButton = () => {
    return (
      <TouchableOpacity
        disabled={this.state.btnNextDisabled}
        onPress={() => {
          this.setState({
            btnNextDisabled: true,
          });
          this._nextClick();
          setTimeout(() => {
            this.setState({
              btnNextDisabled: false,
            });
          }, 1000);
        }}
        style={styles.nextButtonView}>
        <ButtonNext />
      </TouchableOpacity>
    );
  };

  _nextClick = () => {
    if (this.props.isNetworkConnectivityAvailable) {
      if (this.props.cartArray.length > 0) {
        Actions.LabTestSummary({isFromLabs: true});
      } else if (this.state.fileUri.length > 0) {
        Actions.LabTestSummary({isFromLabs: true});
      } else {
        Utility.showAlert(
          Constants.ALERT.TITLE.ERROR,
          Constants.VALIDATION_MSG.NO_TEST_SELECTED,
        );
      }
    } else {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_INTERNET,
      );
    }
  };

  _navigateLabSearch = () => {
    Actions.LabTestSearch();
  };
}
const styles = StyleSheet.create({
  mainView: {flexDirection: 'column', flex: 1},
  mainContainer: {backgroundColor: '#FBFBFB', padding: 10},
  titleContainer: {flexDirection: 'row', marginTop: 10, marginBottom: 10},
  titleText: {flex: 1, fontSize: Constants.FONT_SIZE.L, alignSelf: 'center'},
  titleCartValueContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  titleCartValueLabel: {
    color: '#B1BE95',
    marginRight: 10,
    fontSize: Constants.FONT_SIZE.XS,
    alignSelf: 'center',
  },
  titleCartValueAmount: {
    color: '#3B61A6',
    marginLeft: 10,
    alignSelf: 'center',
    fontSize: Constants.FONT_SIZE.M,
  },
  searchCartView: {
    marginTop: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#EAEAEA',
    paddingLeft: 20,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
  },
  searchImage: {
    alignSelf: 'center',
    width: deviceHeight / 35,
    height: deviceHeight / 35,
  },
  searchLabel: {
    fontSize: Constants.FONT_SIZE.SM,
    alignSelf: 'center',
    marginLeft: 20,
  },
  searchCartRightView: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    alignSelf: 'center',
    marginEnd: 10,
  },
  cartImage: {
    alignSelf: 'center',
    marginLeft: 20,
    marginRight: 25,
    width: deviceHeight / 35,
    height: deviceHeight / 35,
  },
  cartCountView: {
    position: 'absolute',
    bottom: 4,
    right: 1,
    marginLeft: 2,
    width: 26,
    height: 26,
    borderRadius: 26 / 2,
    backgroundColor: '#F6F3F3',
    borderColor: '#F6F3F3',
    overflow: 'hidden',
    borderWidth: 3,
    textAlign: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartCount: {
    fontSize: Constants.FONT_SIZE.S,
    textAlign: 'center',
  },
  uploadButtonView: {
    marginTop: 20,
    padding: 15,
    borderColor: '#E8ECF2',
    borderRadius: 25,
    backgroundColor: '#E8ECF2',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    width: '60%',
  },
  uploadImage: {
    width: deviceHeight / 35,
    height: deviceHeight / 35,
    alignSelf: 'center',
  },
  uploadLabel: {
    color: '#2C579F',
    marginLeft: 10,
    alignSelf: 'center',
    fontSize: Constants.FONT_SIZE.SM,
  },
  tabBar: {
    backgroundColor: 'white',
  },
  tabView: {
    marginTop: 20,
  },
  packageView: {
    margin: -20,
    marginTop: 10,
    backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
  },
  nextButtonView: {
    flex: 1,
    alignSelf: 'flex-end',
    marginVertical: 20,
  },
  totalText: {
    fontSize: Constants.FONT_SIZE.L,
    color: Constants.COLOR.BLACK_COLOR,
    alignSelf: 'center',
    marginTop: 16,
  },
  buttonBackground: {
    borderRadius: 20,
    width: deviceWidth / 1.2,
    backgroundColor: Constants.COLOR.LAB_SEARCH_BUTTON_BG,
    marginTop: 16,
    alignSelf: 'center',
  },
  buttonTitle: {
    fontSize: Constants.FONT_SIZE.M,
    color: Constants.COLOR.WHITE_COLOR,
    padding: 12,
    alignSelf: 'center',
  },
  notes: {
    color: 'red',
    textAlign: 'center',
    alignSelf: 'flex-start',
    fontSize: Constants.FONT_SIZE.S,
    marginTop: 10,
    marginLeft: 30,
  },
});

const mapStateToProps = (state, props) => {
  const {
    UploadPrescriptionState: {
      isUploadingPrescriptionLoading,
      isUploadPrescriptionSuccess,
      uploadBase64Image,
      uploadFileUri,
    },
    labTestState: {cartArray, totalCartAmount},
    configState: {currency, firmName, firmNo},
    deviceState: {isNetworkConnectivityAvailable},
  } = state;

  return {
    isNetworkConnectivityAvailable,
    isUploadingPrescriptionLoading,
    isUploadPrescriptionSuccess,
    cartArray,
    totalCartAmount,
    uploadBase64Image,
    uploadFileUri,
    currency,
    firmName,
    firmNo,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      UploadPrescriptionAction,
      DeletePrescriptionAction,
      saveBase64Format,
      saveUriFormat,
      deleteUploadImage,
      getOfferDetails,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LabTestScreen);

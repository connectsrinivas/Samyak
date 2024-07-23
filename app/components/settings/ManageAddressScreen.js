/*************************************************
 * SukraasLIS
 * @exports
 * @class ManageUsersScreen.js
 * @extends Component
 * Created by Monisha on 21/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import ButtonBack from '../common/ButtonBack';
import {Actions} from 'react-native-router-flux';
import LoadingScreen from '../common/LoadingScreen';
import {
  invokeManageAddress,
  invokeDeleteAddress,
} from '../../actions/ManageAddressActions';
// import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import store from '../../store';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class ManageAddressScreen extends Component {
 //  static propTypes = {
  //   isAddressLoading: PropTypes.bool,
  //   manageAddressList: PropTypes.string,
  //   invokeUpdateAddress: PropTypes.func,
  //   invokeDeleteAddress: PropTypes.func,
  //   isNoData: PropTypes.bool,
  // };

  constructor(props) {
    super(props);
    this.state = {
      isNoData: false,
      phoneNumber: '',
      btnBackDisabled: false,
      btnAddAddressDisabled: false,
      btnDeleteAddressDisabled: false,
    };
  }
  internetAlert(Message) {
    Alert.alert(
      Constants.ALERT.TITLE.FAILED,
      Message,
      [
        {
          text: Constants.ALERT.BTN.OK,
          onPress: () => {
            Actions.pop();
          },
        },
      ],
      {cancelable: false},
    );
  }

  componentDidMount() {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      this.willFocusSubscription = this.props.navigation.addListener(
        'willFocus',
        () => {
          this._getAsyncAndAPICall();
        },
      );
    } else {
      this.internetAlert(Constants.VALIDATION_MSG.NO_INTERNET);
    }
  }

  componentWillUnmount() {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      this.willFocusSubscription.remove();
    }
  }

  _getAsyncAndAPICall = async() => {
    await AsyncStorage.getItem(Constants.ASYNC.ASYNC_PHONE_NUMBER)
      .then(value => {
        this.setState({phoneNumber: value});
        let dictManageInfo = {
          Username: this.state.phoneNumber,
        };
        this.props.invokeManageAddress(dictManageInfo, callback => {
          if (
            callback.Message[0].User_Address === null ||
            callback.Message[0].User_Address.length === 0
          ) {
            this.setState({isNoData: true});
          } else {
            this.setState({isNoData: false});
          }
        });
      })
      .done();
  };

  deleteUserRow(Address_Type_Code) {
    Alert.alert(
      Constants.ALERT.TITLE.INFO,
      Constants.ALERT.MESSAGE.DELETE_MESSAGE,
      [
        {
          text: Constants.ALERT.BTN.YES,
          onPress: () => {
            this.props.invokeDeleteAddress(
              this.state.phoneNumber,
              Address_Type_Code,
              isNoData => {
                this.setState({isNoData: isNoData});
              },
            );
          },
        },
        {text: Constants.ALERT.BTN.NO, onPress: () => {}},
      ],
      {cancelable: false},
    );
  }

  _keyExtractor = data => {
    return data.id;
  };
  _renderUserItem = ({item}) => {
    return (
      <View
        style={{
          marginBottom: deviceHeight / 37.86,
          paddingHorizontal: deviceWidth / 32,
        }}>
        <View
          style={
            ([styles.tableViewContainer],
            {
              backgroundColor: Constants.COLOR.LAB_CART_VIEW,
              paddingVertical: 5,
              flexDirection: 'row',
            })
          }>
          <View style={{width: deviceWidth / 1.29375}}>
            <Text
              style={{
                paddingHorizontal: 5,
                paddingVertical: 7,
                // fontSize: Constants.FONT_SIZE.M,
                color: Constants.COLOR.BOOK_ADDRESS_TEXT_COLOR,
              }}>
              {item.Address_Type_Desc}
            </Text>

            <Text
              style={{
                paddingHorizontal: 5,
                color: Constants.COLOR.BOOK_ADDRESS_TEXT_COLOR,
              }}>
              {item.Full_Address}
            </Text>

            {this._renderLandmark(item)}
          </View>

          <TouchableOpacity
            style={{marginHorizontal: 7, paddingVertical: 5}}
            disabled={this.state.btnAddAddressDisabled}
            onPress={() => {
              this.setState({
                btnAddAddressDisabled: true,
              });
              Actions.addAddressScreen({
                rowData: item,
                isEditButtonTouched: true,
              });
              setTimeout(() => {
                this.setState({
                  btnAddAddressDisabled: false,
                });
              }, 1000);
            }}>
            <Image
              resizeMode="contain"
              source={require('../../images/pen.png')}
              style={{height: 18, width: 18}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginHorizontal: 7, paddingVertical: 5}}
            disabled={this.state.btnDeleteAddressDisabled}
            onPress={() => {
              this.setState({
                btnDeleteAddressDisabled: true,
              });
              this.deleteUserRow(item.Address_Type_Code);
              setTimeout(() => {
                this.setState({
                  btnDeleteAddressDisabled: false,
                });
              }, 1000);
            }}>
            <Image
              resizeMode="contain"
              source={require('../../images/trash.png')}
              style={{height: 18, width: 18}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  _renderLandmark = item => {
    if (
      item.Landmark !== null &&
      item.Landmark !== undefined &&
      item.Landmark !== '' &&
      item.Landmark.trim().length > 0
    ) {
      return (
        <Text
          style={{
            paddingHorizontal: 5,
            color: Constants.COLOR.BOOK_ADDRESS_TEXT_COLOR,
          }}>
          Landmark: {item.Landmark}
        </Text>
      );
    } else {
      return (
        <Text
          style={{
            paddingHorizontal: 5,
            color: Constants.COLOR.BOOK_ADDRESS_TEXT_COLOR,
          }}
        />
      );
    }
  };
  _renderPage() {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
          },
        ]}>
        {this.state.isNoData === true ? (
          <View style={styles.innerContainer}>
            <Text style={styles.centerText}>No Record Found</Text>
            <TouchableOpacity
              style={styles.button}
              disabled={this.state.btnAddAddressDisabled}
              onPress={() => {
                this.setState({
                  btnAddAddressDisabled: true,
                });
                Actions.addAddressScreen();
                setTimeout(() => {
                  this.setState({
                    btnAddAddressDisabled: false,
                  });
                }, 1000);
              }}>
              <Text style={styles.buttonText}> Add Address </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TouchableOpacity
              disabled={this.state.btnAddAddressDisabled}
              onPress={() => {
                this.setState({
                  btnAddAddressDisabled: true,
                });
                Actions.addAddressScreen();
                setTimeout(() => {
                  this.setState({
                    btnAddAddressDisabled: false,
                  });
                }, 1000);
              }}>
              <Text
                style={{
                  textAlign: 'right',
                  paddingHorizontal: 30,
                  paddingVertical: 15,
                  fontSize: Constants.FONT_SIZE.L,
                  color: Constants.COLOR.BUTTON_BG,
                }}>
                Add
              </Text>
            </TouchableOpacity>
            <FlatList
              style={{marginBottom: (deviceHeight * 1) / 6}}
              data={this.props.manageAddressList}
              renderItem={this._renderUserItem}
              keyExtractor={this._keyExtractor}
            />
          </View>
        )}

        <TouchableOpacity
          style={{position: 'absolute', left: 10, bottom: 10}}
          disabled={this.state.btnBackDisabled}
          onPress={() => {
            this.setState({
              btnBackDisabled: true,
            });
            Actions.pop();
          }}>
          <ButtonBack />
        </TouchableOpacity>
      </View>
    );
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  render() {
    return this._renderScreens();
  }
  _renderScreens = () => {
    if (this.props.isAddressLoading) {
      return this._screenLoading();
    } else {
      return this._renderPage();
    }
  };
  _screenLoading = () => {
    return <LoadingScreen />;
  };
}
const mapStateToProps = (state, props) => {
  const {
    manageAddressState: {isAddressLoading, manageAddressList},
  } = state;

  return {
    isAddressLoading,
    manageAddressList,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      invokeManageAddress,
      invokeDeleteAddress,
    },
    dispatch,
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManageAddressScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tableViewContainer: {
    flex: 1,
    padding: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    color: 'black',
    fontSize: Constants.FONT_SIZE.M,
    paddingTop: 50,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  button: {
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
  buttonText: {
    fontSize: Constants.FONT_SIZE.L,
    paddingVertical: 10,
    color: '#FFFFFF',
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 5,
    padding: 10,
    marginHorizontal: 15,
    borderRadius: 5,
    marginVertical: 40,
  },
});

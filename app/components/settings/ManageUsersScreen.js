/* eslint-disable react-native/no-inline-styles */
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
// import PropTypes from 'prop-types';
import LoadingScreen from '../common/LoadingScreen';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  getUserListDetails,
  invokeDeletePatient,
} from '../../actions/UserListActions';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import store from '../../store';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class ManageUsersScreen extends Component {
 //  static propTypes = {
  //   getUserListDetails: PropTypes.func,
  //   isUserListLoading: PropTypes.bool,
  //   userListDetails: PropTypes.string,
  //   isNoData: PropTypes.bool,
  //   patientLimit: PropTypes.number,
  // };

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      isNoData: false,
      btnBackDisabled: false,
      adduserBtnDisabled: false,
      deleteuserBtnDisabled: false,
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

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  _getAsyncAndAPICall =async () => {
    await AsyncStorage.getItem(Constants.ASYNC.ASYNC_PHONE_NUMBER)
      .then(value => {
        this.setState({phoneNumber: value});
        this.props.getUserListDetails(this.state.phoneNumber, isSuccess => {
          this.setState({isNoData: !isSuccess});
        });
      })
      .done();
  };

  

  render() {
    return this._renderScreens();
  }

  _renderScreens = () => {
    if (this.props.isUserListLoading) {
      return this._screenLoading();
    } else {
      return this._renderPage();
    }
  };
  _screenLoading = () => {
    return <LoadingScreen />;
  };

  deleteUserRow(PtCode) {
    Alert.alert(
      Constants.ALERT.TITLE.INFO,
      Constants.ALERT.MESSAGE.DELETE_MESSAGE,
      [
        {
          text: Constants.ALERT.BTN.YES,
          onPress: () => {
            this.props.invokeDeletePatient(
              this.state.phoneNumber,
              PtCode,
              isSuccess => {
                if (isSuccess === true) {
                  this._getAsyncAndAPICall();
                }
              },
            );
          },
        },
        {text: Constants.ALERT.BTN.NO, onPress: () => {}},
      ],
      {cancelable: false},
    );
  }

  _checkPatientLimit() {
    const {patientLimit, userListDetails} = this.props;

    console.log('patientLimit', patientLimit, userListDetails);

    this.setState({
      adduserBtnDisabled: true,
    });

    if (userListDetails !== null) {
      if (userListDetails.length < patientLimit) {
        Actions.addUsersScreen({isFromAdd: true, rowData: {}});
        setTimeout(() => {
          this.setState({
            adduserBtnDisabled: false,
          });
        }, 1000);
      } else {
        Alert.alert(
          Constants.ALERT.TITLE.INFO,
          'Maximum patient limit is reached',
          [
            {
              text: Constants.ALERT.BTN.OK,
              onPress: () => {
                setTimeout(() => {
                  this.setState({
                    adduserBtnDisabled: false,
                  });
                }, 1000);
              },
            },
          ],
          {cancelable: false},
        );
      }
    } else {
      if (patientLimit < 1) {
        Alert.alert(
          Constants.ALERT.TITLE.FAILED,
          'Maximum patient limit is reached',
          [
            {
              text: Constants.ALERT.BTN.OK,
              onPress: () => {
                setTimeout(() => {
                  this.setState({
                    adduserBtnDisabled: false,
                  });
                }, 1000);
              },
            },
          ],
          {cancelable: false},
        );
      } else {
        Actions.addUsersScreen({isFromAdd: true, rowData: {}});
        setTimeout(() => {
          this.setState({
            adduserBtnDisabled: false,
          });
        }, 1000);
      }
    }
  }

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
              paddingVertical: 15,
              flexDirection: 'row',
            })
          }>
          <Text
            style={{
              paddingHorizontal: 5,
              width: deviceWidth / 2.58,
              // fontSize: Constants.FONT_SIZE.M,
              alignSelf: 'center',
              color: Constants.COLOR.BOOK_ADDRESS_TEXT_COLOR,
            }}>{`${item.Pt_Title_Desc} ${item.Pt_Name}${','}  ${
            item.Pt_First_Age
          }`}</Text>
          <View
            style={{
              borderRightWidth: 0.5,
              borderRightColor: Constants.COLOR.BOOK_ADDRESS_TEXT_COLOR,
            }}
          />
          <Text
            style={{
              paddingHorizontal: 5,
              width: deviceWidth / 5.52,
              textAlign: 'center',
              alignSelf: 'center',
              color: Constants.COLOR.BOOK_ADDRESS_TEXT_COLOR,
              // fontSize: Constants.FONT_SIZE.M,
            }}>
            {item.Pt_Gender}
          </Text>
          <View
            style={{
              borderRightWidth: 0.5,
              borderRightColor: Constants.COLOR.BOOK_ADDRESS_TEXT_COLOR,
            }}
          />
          <Text
            style={{
              paddingHorizontal: 5,
              textAlign: 'center',
              alignSelf: 'center',
              color: Constants.COLOR.BOOK_ADDRESS_TEXT_COLOR,
              // fontSize: Constants.FONT_SIZE.M,
              width: deviceWidth / 5.175,
            }}>
            {item.RelationShip_Name}
          </Text>
          <TouchableOpacity
            disabled={this.state.adduserBtnDisabled}
            style={{alignSelf: 'center', marginHorizontal: 7}}
            onPress={() => {
              this.setState({
                adduserBtnDisabled: true,
              });
              Actions.addUsersScreen({isFromAdd: false, rowData: item});
              setTimeout(() => {
                this.setState({
                  adduserBtnDisabled: false,
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
            style={{alignSelf: 'center', marginHorizontal: 7}}
            disabled={this.state.deleteuserBtnDisabled}
            onPress={() => {
              this.setState({
                deleteuserBtnDisabled: true,
              });
              this.deleteUserRow(item.Pt_Code);
              setTimeout(() => {
                this.setState({
                  deleteuserBtnDisabled: false,
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

  _renderPage() {
    return (
      <View
        style={[
          styles.container,
          {
            // position: 'relative',
            backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
          },
        ]}>
        {this.state.isNoData === true ? (
          <View style={styles.innerContainer}>
            <Text style={styles.centerText}>No Record Found</Text>
            <TouchableOpacity
              disabled={this.state.adduserBtnDisabled}
              style={styles.button}
              onPress={() => {
                this._checkPatientLimit();
              }}>
              <Text style={styles.buttonText}> Add Members </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TouchableOpacity
              disabled={this.state.adduserBtnDisabled}
              onPress={() => {
                this._checkPatientLimit();
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
              data={this.props.userListDetails}
              renderItem={this._renderUserItem}
              keyExtractor={this._keyExtractor}
            />
          </View>
        )}

        <TouchableOpacity
          style={{position: 'absolute', left: 10, bottom: 5}}
          onPress={() => {
            Actions.pop();
          }}>
          <ButtonBack />
        </TouchableOpacity>
      </View>
    );
  }
  _keyExtractor = data => {
    return data.id;
  };
}

const mapStateToProps = (state, props) => {
  //props can be called as ownProps

  const {
    userListState: {isUserListLoading, userListDetails},
    configState: {patientLimit},
  } = state;

  return {
    isUserListLoading,
    userListDetails,
    patientLimit,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {getUserListDetails, invokeDeletePatient},
    dispatch,
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManageUsersScreen);

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

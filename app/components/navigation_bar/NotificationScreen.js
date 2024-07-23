/*************************************************
 * SukraasLIS
 * @exports
 * @class NotificationScreen.js
 * @extends Component
 * Created by Sankar on 25/05/2020
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
  SectionList,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import LoadingScreen from '../common/LoadingScreen';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import {Actions} from 'react-native-router-flux';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  getNotificationList,
  getViewNotificationUpdate,
  clearAllNotification,
  changeMarkAllAsRead,
} from '../../actions/NotificationActions';
import {tipsState} from '../../reducers/TipsReducers';



const deviceWidth = Dimensions.get('window').width;

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

let currentScene = 'NotificationScreen';
class NotificationScreen extends Component {
 //  static propTypes = {
  //   isNetworkConnectivityAvailable: PropTypes.bool,
  //   isNotificationListLoading: PropTypes.bool,
  //   notificationListData: PropTypes.array,
  //   notificationUpdateData: PropTypes.object,

  //   count: PropTypes.string,
  //   mobileNo: PropTypes.string,
  //   collectorCode: PropTypes.string,

  //   getViewNotificationUpdate: PropTypes.func,
  //   getNotificationList: PropTypes.func,
  //   clearAllNotification: PropTypes.func,
  //   changeMarkAllAsRead: PropTypes.func,
  // };
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      selectedModalItem: {},
      modalBtnDisabled: false,
    };
  }

  async componentDidMount() {
    this._callNotificationList();
  }

  render() {
    return this._renderScreens();
  }
  _renderScreens = () => {
    if (this.props.isNotificationListLoading) {
      return <LoadingScreen />;
    } else {
      return this._renderMainScreen();
    }
  };
  _renderMainScreen = () => {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.profileHeader}>
          <Text style={styles.profileText}> Notifications </Text>
          <TouchableOpacity
            style={styles.headerCloseImageView}
            onPress={() => {
              if (Actions.currentScene === currentScene) {
                Actions.pop();
              }
            }}>
            <Image
              style={styles.headerCloseImage}
              resizeMode="contain"
              source={require('../../images/black_cross.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <View style={styles.contentMainView}>
          {this._renderScreenContents()}
        </View>
      </View>
    );
  };

  _onPressClearAll = () => {
    Alert.alert(
      Constants.ALERT.TITLE.INFO,
      Constants.ALERT.MESSAGE.CLEAR_ALL,
      [
        {
          text: Constants.ALERT.BTN.YES,
          onPress: () => {
            let postData = {
              UserName: this.props.mobileNo,
              Notify_Status: 'C',
            };
            this.props.clearAllNotification(postData);
          },
        },
        {text: Constants.ALERT.BTN.NO, onPress: () => {}},
      ],
      {cancelable: false},
    );
  };
  _onPressMarkAll = () => {
    Alert.alert(
      Constants.ALERT.TITLE.INFO,
      Constants.ALERT.MESSAGE.MARK_ALL,
      [
        {
          text: Constants.ALERT.BTN.YES,
          onPress: () => {
            let postData = {
              UserName: this.props.mobileNo,
              Notify_Status: 'A',
            };
            this.props.clearAllNotification(postData);
          },
        },
        {text: Constants.ALERT.BTN.NO, onPress: () => {}},
      ],
      {cancelable: false},
    );
  };
  _renderScreenContents = () => {
    if (
      this.props.notificationListData !== null &&
      this.props.notificationListData !== undefined &&
      this.props.notificationListData.length > 0
    ) {
      return this._renderData();
    } else {
      return this._renderNoData();
    }
  };
  _renderNoData = () => {
    return (
      <View style={styles.noDataMain}>
        <Text style={styles.noDataText}>No Data found!</Text>
      </View>
    );
  };
  _renderData = () => {
    return (
      <View style={{flex: 1}}>
        <View style={styles.buttonView}>
          <TouchableOpacity onPress={() => this._onPressClearAll()}>
            <Text style={styles.buttonText}>Clear all </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._onPressMarkAll()}>
            <Text style={styles.buttonText}>Mark all as Read </Text>
          </TouchableOpacity>
        </View>
        <KeyboardAwareScrollView style={styles.ScrollContainer}>
          <SectionList
            style={{marginBottom: 10}}
            sections={this.props.notificationListData}
            renderItem={({item}) => this._renderSectionItem({item})}
            keyExtractor={(item, index) => index}
            renderSectionHeader={({section, index}) =>
              this._sectionHeader({section, index})
            }
          />
          {this.state.showModal === true ? this._renderModalPopUp() : null}
        </KeyboardAwareScrollView>
      </View>
    );
  };
  _renderModalPopUp = () => {
    return (
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={this.state.showModal}
        onRequestClose={() => {}}>
        {this._renderPopUpMsg()}
      </Modal>
    );
  };
  _renderPopUpMsg = () => {
    return (
      <SafeAreaView style={styles.mainModalView}>
        <View style={styles.modalHeaderView}>
          <Text style={styles.modalHeaderText}>
            {this.state.selectedModalItem.Time_Diff_Desc}...
          </Text>
          <TouchableOpacity
            style={{alignSelf: 'center'}}
            disabled={this.state.modalBtnDisabled}
            onPress={() => {
              this.setState({
                showModal: false,
                modalBtnDisabled: true,
              });
              {
                this._callNotificationList();
              }
              setTimeout(() => {
                this.setState({
                  modalBtnDisabled: false,
                });
              }, 1000);
            }}>
            <Image
              style={styles.modalCloseImage}
              resizeMode="contain"
              source={require('../../images/black_cross.png')}
            />
          </TouchableOpacity>
        </View>
        <KeyboardAwareScrollView>
          <Text style={styles.modalContentView}>
            {this.state.selectedModalItem.Notify_Message}
          </Text>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  };
  _callNotificationList = () => {
    if (this.props.isNetworkConnectivityAvailable === true) {
      this.props.getNotificationList(this.props.mobileNo, true, isSuccess => {
        if (isSuccess === true) {
        }
      });
    } else {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_INTERNET,
      );
    }
  };
  _sectionHeader = ({section}) => {
    return (
      <View>
        <Text style={[styles.sectionHeaderText]}>{section.title}</Text>
      </View>
    );
  };
  _renderSectionItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({
            selectedModalItem: item,
          });
          let postData = {
            UserName: this.props.mobileNo,
            Notify_Id: item.Notification_Id,
            Notify_Status: 'R',
          };
          this.props.getViewNotificationUpdate(postData, isSuccess => {
            this.setState({
              showModal: true,
            });
          });
        }}
        //#DCDCDC
        style={[
          styles.sectionItemHeader,
          {backgroundColor: item.IsRead === '0' ? '#E0E0E0' : null},
        ]}>
        <View style={{flex: 1}}>
          <Text style={[styles.notifyText]} numberOfLines={1}>
            {item.Notify_Message}
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontSize: Constants.FONT_SIZE.SM,
                textAlign: 'left',
                padding: 10,
                color: '#000000',
              }}
              numberOfLines={1}>
              {item.Time_Diff_Desc}
            </Text>
            <Text
              style={{
                fontSize: Constants.FONT_SIZE.S,
                textAlign: 'right',
                padding: 10,
                alignSelf: 'flex-end',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                alignContent: 'flex-end',
                color: '#0645AD',
              }}
              numberOfLines={1}>
              View More
            </Text>
          </View>
        </View>
        <View>
          <Text
            style={[
              styles.newOldMsgText,
              {
                backgroundColor: item.IsNew === '1' ? '#ffa500' : '#120F0C',
                borderColor: item.IsNew === '1' ? '#ffa500' : '#120F0C',
              },
            ]}>
            {item.IsNew === '1' ? 'New' : 'Older'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
}
const mapStateToProps = (state, props) => {
  const {
    notificationState: {
      isNotificationListLoading,
      notificationListData,
      count,
      notificationUpdateData,
    },
    deviceState: {isNetworkConnectivityAvailable},
    configState: {mobileNo},
  } = state;

  return {
    count,
    mobileNo,
    isNotificationListLoading,
    notificationListData,
    isNetworkConnectivityAvailable,
    notificationUpdateData,
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getViewNotificationUpdate,
      getNotificationList,
      clearAllNotification,
      changeMarkAllAsRead,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationScreen);


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#eef3fd',
  },
  ScrollContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    flex: 1,
  },

  headerText: {
    flex: 3,
    color: '#757677',
    fontSize: Constants.FONT_SIZE.XXXL,
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
    width: 20,
    height: 20,
    marginRight: 15,
  },

  contentMainView: {flex: 1, flexDirection: 'row'},
  noDataMain: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
  },
  noDataText: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
  },
  newOldMsgText: {
    marginTop: 10,
    padding: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ffa500',
    overflow: 'hidden',
    fontSize: Constants.FONT_SIZE.S,
    color: '#FFFFFF',
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  sectionItemHeader: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 2,
  },
  notifyText: {
    flex: 1,
    marginTop: 5,
    paddingHorizontal: 10,
    padding: 10,
    paddingBottom: 5,
    fontSize: Constants.FONT_SIZE.M,
    color: '#000000',
    fontWeight: Platform.OS === 'ios' ? null : '900',
  },
  sectionHeaderText: {
    paddingVertical: 10,
    fontSize: Constants.FONT_SIZE.L,
    color: 'black',
    fontWeight: Platform.OS === 'ios' ? null : '900',
  },
  mainModalView: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: Platform.OS === 'ios' ? deviceHeight / 3 : deviceHeight / 4,
    maxHeight: 300,
    minHeight: 200,
    borderColor: 'lightgray',
    borderWidth: 1,
  },
  modalHeaderView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
  },
  modalHeaderText: {
    textAlign: 'left',
    fontSize: Constants.FONT_SIZE.SM,
    color: '#313431',
  },
  modalCloseImage: {
    width: 20,
    height: 20,
    alignSelf: 'center',
  },
  modalContentView: {
    padding: 10,
    marginTop: 10,
    fontSize: Constants.FONT_SIZE.M,
    fontWeight: '600',
    color: '#313431',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonText: {
    fontSize: Constants.FONT_SIZE.M,
    color: Constants.COLOR.BUTTON_BG,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
});

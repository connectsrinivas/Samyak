/*************************************************
 * SukraasLIS
 * @exports
 * @class PatientInfo.js
 * @extends Component
 * Created by Shiva Sankar on 01/07/2020
 * Copyright Ā© 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Constants from '../../util/Constants';
import { Dropdown } from 'react-native-material-dropdown-v2';
import Utility from '../../util/Utility';
import ButtonNext from '../common/ButtonNext';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  invokeGetBranchDetail,
  invokeUserVsDefaultBranch,
} from '../../actions/ManageBranchAction';
import {
  setFirmName,
  setFirmNo,
  setBranchLatitude,
  setBranchLongitude,
} from '../../actions/ConfigAction';
import LoadingScreen from '../common/LoadingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Actions } from 'react-native-router-flux';
import ButtonBack from '../common/ButtonBack';
import store from '../../store';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class ManageBranchScreen extends Component {
  static propTypes = {
    invokeGetBranchDetail: PropTypes.func,
    isBranchLoading: PropTypes.bool,
    branchList: PropTypes.array,
    defaultBranch: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      branchName: '',
      firm_no: '',
      userName: '',
      selectedItem: [],
      btnBackDisabled: false,
      emptyBranch: [
        {
          Branch_Name: 'Select Branch',
          City_Name: '',
          Country_Name: '',
          Firm_Name: '',
          Firm_No: '',
          Latitude: '',
          Longitude: '',
          Pin_Code: '',
          Place_Name: '',
          State_Name: '',
          Street: '',
        },
      ],
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
            if (this.props.isFromSettings) {
              Actions.pop();
            }
          },
        },
      ],
      { cancelable: false },
    );
  }

  async componentDidMount() {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      this.props.invokeGetBranchDetail();
      await AsyncStorage.getItem(Constants.ASYNC.ASYNC_PHONE_NUMBER)
        .then(value => {
          this.setState({ userName: value });
        })
        .done();
    } else {
      this.internetAlert(Constants.VALIDATION_MSG.NO_INTERNET);
    }
  }
  render() {
    return this._renderScreens();
  }
  _renderScreens = () => {
    if (this.props.isBranchLoading) {
      return this._screenLoading();
    } else {
      return this._renderBranch();
    }
  };
  _screenLoading = () => {
    return <LoadingScreen />;
  };

  onNextPress = () => {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      const { firm_no } = this.state;
      const { isFromSettings } = this.props;
      if (isFromSettings) {
        Actions.pop();
      } else {
        if (firm_no.trim() === '') {
          Utility.showAlert(
            Constants.ALERT.TITLE.ERROR,
            Constants.VALIDATION_MSG.NO_BRANCH,
          );
        } else {
          Actions.homeTabBar();
        }
      }
    } else {
      this.internetAlert(Constants.VALIDATION_MSG.NO_INTERNET);
    }
  };

  _callDefaultBranch = () => {
    const { userName, firm_no, branchName } = this.state;
    const { isFromSettings } = this.props;
    if (firm_no.trim() === '') {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_BRANCH,
      );
    } else {
      this.props.invokeUserVsDefaultBranch(
        userName,
        firm_no,
        isFromSettings,
        branchName,
        (isSuccess, response) => {
          if (isSuccess === true) {
            if (response.Default_Firm_No != null) {
              this.props.setFirmName(response.Branch_Name);
              this.props.setFirmNo(response.Default_Firm_No);
              AsyncStorage.setItem(
                Constants.ASYNC.ASYNC_DEFAULT_BRANCH_NAME,
                response.Branch_Name,
              );
              AsyncStorage.setItem(
                Constants.ASYNC.ASYNC_DEFAULT_FIRM_NO,
                response.Default_Firm_No,
              );
              this.props.setBranchLatitude(parseFloat(response.Branch_Latitude))
              this.props.setBranchLongitude(parseFloat(response.Branch_Longitude))
              AsyncStorage.setItem(
                Constants.ASYNC.ASYNC_BRANCH_LATITUDE,
                response.Branch_Latitude,
              );
              AsyncStorage.setItem(
                Constants.ASYNC.ASYNC_BRANCH_LONGITUDE,
                response.Branch_Longitude,
              );
            }
          }
        },
      );
    }
  };

  _branchSelected = (Branch_Name, index, data) => {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      this.setState(
        {
          branchName: Branch_Name,
          firm_no: data[index].Firm_No,
          selectedItem: data[index],
        },
        () => {
          this._callDefaultBranch();
        },
      );
    } else {
      this.internetAlert(Constants.VALIDATION_MSG.NO_INTERNET);
    }
  };

  _showNextButton = () => {
    if (this.props.isFromSettings) {
      return <View />;
    } else {
      return (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.onNextPress();
          }}>
          <ButtonNext />
        </TouchableOpacity>
      );
    }
  };
  _showBackButton = () => {
    if (this.props.isFromSettings) {
      return (
        <TouchableOpacity
          style={{ position: 'absolute', bottom: 30, left: 12 }}
          disabled={this.state.btnBackDisabled}
          onPress={() => {
            this.setState({
              btnBackDisabled: true,
            });
            Actions.pop();
            setTimeout(() => {
              this.setState({
                btnBackDisabled: false,
              });
            }, 1000);
          }}>
          <ButtonBack />
        </TouchableOpacity>
      );
    } else {
      return <View />;
    }
  };

  _renderBranch = () => {
    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Text style={styles.headerText}>Select Branch</Text>
          {/* <Dropdown
            containerStyle={{
              backgroundColor: Constants.COLOR.WHITE_COLOR,
              borderColor: Constants.COLOR.LAB_SUMMARY_TEXT,
              borderWidth: 1,
            }}
            value={this.state.branchName}
            inputContainerStyle={{
              paddingVertical: 15,
              backgroundColor: Constants.COLOR.WHITE_COLOR,
              borderRadius: 25,
              paddingHorizontal: 15,
              marginTop: 10,
            }}
            placeholder="Select Branch"
            placeholderTextColor={Constants.COLOR.BLACK_COLOR}
            data={
              this.props.isNetworkConnectivityAvailable
                ? this.props.branchList
                : this.state.emptyBranch
            }
            itemCount={6}
            fontSize={Constants.FONT_SIZE.L}
            valueExtractor={({Branch_Name}) => Branch_Name}
            pickerStyle={{
              borderRadius: 10,
              width: deviceWidth - 40,
              left: 20,
            }}
            selectedItemColor={
              this.state.city === ''
                ? Constants.COLOR.FONT_HINT
                : Constants.COLOR.THEME_COLOR
            }
            onChangeText={(Branch_Name, index, data) => {
              this.props.isNetworkConnectivityAvailable
                ? this._branchSelected(Branch_Name, index, data)
                : null;
            }}
          /> */}
          <Dropdown
            containerStyle={{
              borderColor: Constants.COLOR.LAB_SUMMARY_TEXT,
              backgroundColor: Constants.COLOR.WHITE_COLOR,
              borderWidth: 1,
              height:57
            }}
            value={this.state.branchName}
            placeholder="Select Branch"
            placeholderTextColor={Constants.COLOR.BLACK_COLOR}
            data={
              this.props.isNetworkConnectivityAvailable
                ? this.props.branchList
                : this.state.emptyBranch
            }
            itemCount={6}
            fontSize={Constants.FONT_SIZE.L}
            valueExtractor={({ Branch_Name }) => Branch_Name}
            pickerStyle={{
              borderRadius: 10,
              width: deviceWidth - 40,
              left: 20,
            }}
            selectedItemColor={
              this.state.city === ''
                ? Constants.COLOR.FONT_HINT
                : Constants.COLOR.THEME_COLOR
            }
            onChangeText={(Branch_Name, index, data) => {
              this.props.isNetworkConnectivityAvailable
                ? this._branchSelected(Branch_Name, index, data)
                : null;
            }}
            dropdownPosition={-5}
          />
      
          {this._showNextButton()}
        </View>
        {this._showBackButton()}
      </View>
    );
  };
}
const mapStateToProps = (state, ownProps) => {
  const {
    branchState: { branchList, isBranchLoading, defaultBranch },
    deviceState: { isNetworkConnectivityAvailable },
  } = state;
  return {
    branchList,
    isBranchLoading,
    defaultBranch,
    isNetworkConnectivityAvailable,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      invokeGetBranchDetail,
      invokeUserVsDefaultBranch,
      setFirmName,
      setFirmNo,
      setBranchLatitude,
      setBranchLongitude,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManageBranchScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F6FD',
  },
  subContainer: {
    marginHorizontal: 16,
    marginVertical: 16,
  },
  headerText: {
    fontSize: Constants.FONT_SIZE.L,
    paddingVertical: 16,
    color: '#747577',
  },
  button: {
    marginVertical: 16,
  },
});










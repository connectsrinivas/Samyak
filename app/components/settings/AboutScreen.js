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
  Linking,
  ScrollView,
  Platform,
} from 'react-native';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import ButtonBack from '../common/ButtonBack';
import {Actions} from 'react-native-router-flux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {callAboutInfo} from '../../actions/AboutScreenAction';
// import HTML from 'react-native-render-html';
import RenderHtml from 'react-native-render-html';
// import PropTypes from 'prop-types';
import LoadingScreen from '../common/LoadingScreen';
const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class AboutScreen extends Component {
 //  static propTypes = {
  //   isAboutScreenLoading: PropTypes.bool,
  //   arrAboutInfo: PropTypes.object,
  //   callAboutInfo: PropTypes.func,
  // };
  constructor() {
    super();
    this.state = {
      id: '',
      fileUri: [],
      imgData: [],
      btnBackDisabled: false,
    };
  }
  _renderContentView() {
    return (
      <View style={{marginHorizontal: 10}}>
        <RenderHtml source={{html:this.props.arrAboutInfo.Client_Description}} />
        <Text style={[styles.textView, {marginTop: 5}]}>
          {this.props.arrAboutInfo.Client_Location}
        </Text>
        <Text style={styles.textView}>
          {this.props.arrAboutInfo.Client_Email_Id}
        </Text>
        <TouchableOpacity onPress={() => this.__callWebUrl()}>
          <Text style={[styles.textViewLink]}>
            {this.props.arrAboutInfo.Client_Web_Address}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  __callWebUrl = () => {
    var url = this.props.arrAboutInfo.Client_Web_Address.includes('http')
      ? this.props.arrAboutInfo.Client_Web_Address
      : 'http://' + this.props.arrAboutInfo.Client_Web_Address;
    Linking.openURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Utility.showAlert(Constants.VALIDATION_MSG.NO_DATA_FOUND);
      }
    });
  };

  _renderButton = () => {
    return (
      <TouchableOpacity
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
  };

  _renderScreens = () => {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          {this._renderMainLogo()}
          <Text
            style={{fontSize: Constants.FONT_SIZE.XXXL, textAlign: 'center'}}>
            {this.props.arrAboutInfo.Client_Name}
          </Text>
          {this._renderContentView()}
        </KeyboardAwareScrollView>
        <View style={styles.backButtonView}>{this._renderButton()}</View>
      </View>
    );
  };

  _renderMainLogo = () => {
    if (this.props.arrAboutInfo.Client_Logo !== '') {
      console.log('');
      return (
        <Image
          source={{uri: this.props.arrAboutInfo.Client_Logo}}
          resizeMode={'contain'}
          style={styles.imageLogo}
        />
      );
    } else {
      return <View />;
    }
  };
  componentDidMount() {
    this.props.callAboutInfo();
  }
  render() {
    if (this.props.isAboutScreenLoading) {
      return <LoadingScreen />;
    } else {
      if (this.props.arrAboutInfo.hasOwnProperty('Client_Description')) {
        return this._renderScreens();
      } else {
        return (
          <View style={{flex: 1}}>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{padding: 20}}>No Data found!</Text>
            </View>
            <View style={[styles.backButtonView, {justifyContent: 'flex-end'}]}>
              <TouchableOpacity
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
            </View>
          </View>
        );
      }
    }
  }
}
const mapStateToProps = (state, props) => {
  const {
    aboutScreenState: {isAboutScreenLoading, arrAboutInfo},
  } = state;

  return {
    isAboutScreenLoading,
    arrAboutInfo,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      callAboutInfo,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AboutScreen);
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
  backButtonView: {
    alignSelf: 'flex-start',
    marginVertical: 20,
    marginLeft: 10,
  },
  textView: {
    paddingTop: 5,
    fontSize: Constants.FONT_SIZE.SM,
  },
  textViewLink: {
    flex: 1,
    width: '100%',
    textAlign: 'center',
    backgroundColor: '#FFA500',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 20,
    fontSize: Constants.FONT_SIZE.L,
    padding: 20,
    color: 'white',
  },
  imageLogo: {
    alignSelf: 'center',
    width: deviceHeight * (5 / 15),
    height: deviceHeight * (3 / 20),
  },
});

import React, {Component} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

// import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import Utility from '../../util/Utility';
import Constants from '../../util/Constants';
import {getNotificationCount} from '../../actions/NotificationActions';

import store from '../../store';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

const deviceWidth = Dimensions.get('window').width;

class NavigationBar extends Component {
 //  static propTypes = {
  //   firmName: PropTypes.string,
  //   firmNo: PropTypes.string,
  //   currency: PropTypes.string,
  //   userImageURL: PropTypes.string,
  //   mobileNo: PropTypes.string,

  //   isNotificationListLoading: PropTypes.bool,
  //   count: PropTypes.string,
  //   getNotificationCount: PropTypes.func,
  // };
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  async getNotificationCountAPI() {
    this.props.getNotificationCount(this.props.mobileNo);
  }

  render() {
    return (
      <View style={{backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN}}>
        {this.props.isShowNavBar === true ? (
          <View style={styles.container}>
            <View style={styles.leftView}>
              <Text style={styles.headingText}>{this.props.title}</Text>
            </View>
            {this.props.isHideImages === true ? null : (
              <View style={styles.rightView}>
                {this.props.showSOSAlert ? (
                  <TouchableOpacity
                    onPress={() => {
                      this._navigateSOSScreen();
                    }}>
                    <Image
                      style={[
                        styles.headerRightImage,
                        {
                          width: deviceHeight / 25,
                          height: deviceHeight / 25,
                          marginBottom: 8,
                        },
                      ]}
                      source={require('../../images/alarm.png')}
                    />
                  </TouchableOpacity>
                ) : null}

                {this.props.showInAppNotification ? (
                  <TouchableOpacity
                    onPress={() => {
                      this._navigateNotificationScreen();
                    }}>
                    <View>
                      <Image
                        style={[
                          styles.headerRightImage,
                          {width: deviceHeight / 30, height: deviceHeight / 30},
                        ]}
                        source={require('../../images/bellwhite.png')}
                      />
                    </View>
                    {this._renderNotificationCount()}
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                  onPress={() => {
                    this._navigateProfileScreen();
                  }}>
                  {this._showProfileIcon()}
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : null}
        {this.props.isShowLocation === true ? (
          <View style={styles.locationNameView}>
            <Image
              style={{
                width: deviceHeight / 35,
                height: deviceHeight / 35,
                marginHorizontal: 5,
              }}
              source={require('../../images/placeholder.png')}
            />
            <Text style={{alignSelf: 'center'}}>{this.props.firmName}</Text>
          </View>
        ) : null}
      </View>
    );
  }
  _showProfileIcon = () => {
    if (this.props.userImageURL !== '') {
      return (
        <Image
          style={[
            styles.headerRightImage,
            {
              width: deviceHeight / 30,
              height: deviceHeight / 30,
              borderRadius: deviceHeight / 30,
              marginEnd: 5,
            },
          ]}
          source={{uri: this.props.userImageURL}}
        />
      );
    } else {
      return (
        <Image
          style={[
            styles.headerRightImage,
            {
              width: deviceHeight / 35,
              height: deviceHeight / 35,
              marginEnd: 5,
            },
          ]}
          source={require('../../images/user_white.png')}
        />
      );
    }
  };
  _navigateSOSScreen = () => {
    Actions.SOSScreen();
  };
  _navigateNotificationScreen = () => {
    Actions.NotificationScreen();
  };
  _navigateProfileScreen = () => {
    Actions.ProfileScreen();
  };
  _renderNotificationCount = () => {
    if (
      this.props.count !== undefined &&
      this.props.count !== null &&
      this.props.count !== 0 &&
      this.props.count !== ''
    ) {
      return (
        <View
          style={{
            backgroundColor: Constants.COLOR.THEME_COLOR,
            width: 20,
            height: 20,
            borderWidth: 1,
            borderColor: 'white',
            borderRadius: 15,
            position: 'absolute',
            left: 9,
            bottom: 9,
            marginLeft: 25,
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <Text
            style={{
              fontSize: Constants.FONT_SIZE.XXS,
              alignItems: 'center',
              textAlign: 'center',
              alignContent: 'center',
              justifyContent: 'center',
              textAlignVertical: 'center',
              color: 'white',
            }}>
            {this.props.count < 10 ? this.props.count : this.props.count}
          </Text>
        </View>
      );
    } else {
      return <View />;
    }
  };
}

const mapStateToProps = (state, props) => {
  //props can be called as ownProps
  const {
    configState: {
      currency,
      firmName,
      firmNo,
      mobileNo,
      showSOSAlert,
      showInAppNotification,
    },
    profileState: {userImageURL},
    notificationState: {isNotificationListLoading, count},
  } = state;

  return {
    currency,
    firmName,
    firmNo,
    mobileNo,
    userImageURL,
    isNotificationListLoading,
    count,
    showSOSAlert,
    showInAppNotification,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({getNotificationCount}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationBar);

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: 'center',
    width: '100%',
    height: Platform.OS === 'ios' ? 64 : 54,
    flexDirection: 'row',
    backgroundColor: Constants.COLOR.THEME_COLOR,
    borderBottomWidth: 2,
    borderBottomColor: '#ECA12C',
  },

  leftView: {
    flex: 3,
  },
  rightView: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headingText: {
    color: '#FFFFFF',
    fontSize: Constants.FONT_SIZE.XL,
  },
  headerRightImage: {
    marginLeft: 25,
    width: deviceHeight / 25,
    height: deviceHeight / 25,
  },
  locationNameView: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
});

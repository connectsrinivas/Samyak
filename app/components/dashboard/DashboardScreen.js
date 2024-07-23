'use strict';
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getNotificationCount } from '../../actions/NotificationActions';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import CardView from 'react-native-cardview';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

class DashboardScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getNotificationCountAPI();

    // Fetch notification count every 30 seconds
    this.timer = setInterval(() => {
      this.getNotificationCountAPI();
    }, 1000 * 30);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  async getNotificationCountAPI() {
    // Call the action to get notification count
    this.props.getNotificationCount(this.props.mobileNo);
  }

  render() {
    return (
      <View style={styles.container}>
        {/* Toolbar */}
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={this.toggle}>
            <View style={styles.backImage} />
          </TouchableOpacity>
          <Text style={styles.toolbarTitleText} numberOfLines={1}>
            Dashboard
          </Text>
          <View style={styles.toolbarRightImage}>
            <Image
              style={styles.avatar}
              resizeMode="contain"
              source={require('../../images/SignoutSideMenu.png')}
            />
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          <CardView
            cardElevation={4}
            cardMaxElevation={4}
            cornerRadius={10}
            style={styles.card}>
            <View style={styles.userInfoContainer}>
              <Image
                style={styles.avatar}
                resizeMode="contain"
                source={{
                  uri:
                    'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                }}
              />
              <View style={styles.userInfo}>
                <Text style={styles.welcomeText}>Welcome,</Text>
                <Text style={styles.userName}>Jagadish Sellamuthu</Text>
                <Text style={styles.lastLoginText}>
                  Last login 05 Nov 2019 10.20 AM
                </Text>
              </View>
            </View>
          </CardView>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    mobileNo: state.configState.mobileNo,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getNotificationCount,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.COLOR. THEME_COLOR,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: deviceHeight / 100,
  },
  toolbarTitleText: {
    flex: 8,
    fontSize: Constants.FONT_SIZE.XL,
    color: 'white',
    padding: 10,
  },
  backImage: {
    height: deviceHeight / 35,
    width: deviceHeight / 35,
    marginLeft: deviceHeight / 35,
  },
  toolbarRightImage: {
    height: deviceHeight / 20,
    width: deviceHeight / 20,
    marginRight: deviceHeight / 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: deviceHeight / 25,
    height: deviceHeight / 25,
    tintColor: Constants.COLOR.THEME_COLOR_2,
  },
  contentContainer: {
    flex: 1,
    marginTop: 80,
    backgroundColor: 'white',
    padding: deviceHeight * (1 / 35),
    alignItems: 'center',
  },
  card: {
    width: '90%',
    padding: 20,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: 20,
  },
  welcomeText: {
    fontSize: Constants.FONT_SIZE.MS,
    color: Constants.COLOR.FONT_COLOR,
  },
  userName: {
    fontSize: Constants.FONT_SIZE.M,
    marginTop: 5,
    marginLeft: 5,
    color: Constants.COLOR.FONT_COLOR,
  },
  lastLoginText: {
    fontSize: Constants.FONT_SIZE.S,
    marginTop: 2,
    marginLeft: 5,
    color: Constants.COLOR.FONT_HINT,
  },
});


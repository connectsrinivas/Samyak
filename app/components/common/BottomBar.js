import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
} from 'react-native';
// import PropTypes from 'prop-types';
import {Actions} from 'react-native-router-flux';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

class BottomBar extends Component {
 //  static propTypes = {
  //   mobileNo: PropTypes.string,
  // };
  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: 0,
    };
  }

  componentDidMount() {
    if (this.props.menuList !== undefined && this.props.menuList.length > 1) {
      let initialIndex = 0;
      for (let index = 0; index < this.props.menuList.length; index++) {
        if (this.props.menuList[index].Default === true) {
          initialIndex = index;
        }
      }
      this.setState({activeTabIndex: initialIndex});
      this.navigationTab(this.props.menuList[initialIndex].Main_Menu_Code);
    }
  }
  navigationTab = Menu_Id => {
    if (Menu_Id === 'BK') {
      Actions.bookingsTab();
    } else if (Menu_Id === 'LT') {
      Actions.labTestTab();
    } else if (Menu_Id === 'DB') {
      Actions.homeScreenTab();
    } else if (Menu_Id === 'TT') {
      Actions.trendsTab();
    } else if (Menu_Id === 'ST') {
      Actions.SettingsTab();
    }
  };

  componentWillUnmount() {}

  render() {
    // const {state} = this.props.navigation;
    // let activeTabIndex = state.index;
    // console.log('Active Tab Index ', activeTabIndex);
    console.log('Bottom bar calll');
    if (this.props.menuList !== undefined && this.props.menuList.length > 1) {
      return (
        <View style={styles.mainContainer}>
          {this.props.menuList[0].Show_Icon ? (
            <TouchableOpacity
              style={styles.bodyContainer}
              onPress={() => {
                this.setState({activeTabIndex: 0});
                this.navigationTab(this.props.menuList[0].Main_Menu_Code);
              }}>
              <View style={[styles.imageBackground]}>
                {this._displayIconOne(this.state.activeTabIndex)}
              </View>

              <Text numberOfLines={1} style={styles.label}>
                {this.props.menuList[0].Menu_Desc}
              </Text>
            </TouchableOpacity>
          ) : null}

          {this.props.menuList[1].Show_Icon ? (
            <TouchableOpacity
              style={styles.bodyContainer}
              onPress={() => {
                this.setState({activeTabIndex: 1});

                this.navigationTab(this.props.menuList[1].Main_Menu_Code);
              }}>
              <View style={[styles.imageBackground]}>
                {this._displayIconTwo(this.state.activeTabIndex)}
              </View>
              <Text numberOfLines={1} style={styles.label}>
                {this.props.menuList[1].Menu_Desc}
              </Text>
            </TouchableOpacity>
          ) : null}

          {this.props.menuList[2].Show_Icon ? (
            <TouchableOpacity
              style={styles.bodyContainer}
              onPress={() => {
                this.setState({activeTabIndex: 2});
                this.navigationTab(this.props.menuList[2].Main_Menu_Code);
              }}>
              <View style={[styles.imageBackground]}>
                {this._displayIconThree(this.state.activeTabIndex)}
              </View>
              <Text numberOfLines={1} style={styles.label}>
                {this.props.menuList[2].Menu_Desc}
              </Text>
            </TouchableOpacity>
          ) : null}

          {this.props.menuList[3].Show_Icon ? (
            <TouchableOpacity
              style={styles.bodyContainer}
              onPress={() => {
                this.setState({activeTabIndex: 3});
                this.navigationTab(this.props.menuList[3].Main_Menu_Code);
              }}>
              <View style={[styles.imageBackground]}>
                {this._displayIconFour(this.state.activeTabIndex)}
              </View>
              <Text numberOfLines={1} style={styles.label}>
                {this.props.menuList[3].Menu_Desc}
              </Text>
            </TouchableOpacity>
          ) : null}

          {this.props.menuList[4].Show_Icon ? (
            <TouchableOpacity
              style={styles.bodyContainer}
              onPress={() => {
                this.setState({activeTabIndex: 4});
                this.navigationTab(this.props.menuList[4].Main_Menu_Code);
              }}>
              <View style={[styles.imageBackground]}>
                {this._displayIconFive(this.state.activeTabIndex)}
              </View>
              <Text numberOfLines={1} style={styles.label}>
                {this.props.menuList[4].Menu_Desc}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      );
    } else {
      return <View />;
    }
  }

  _displayIconOne = index => {
    return index === 0 ? (
      <Image
        style={[styles.avatar, {}]}
        resizeMode="contain"
        source={{uri: this.props.menuList[0].Selected_Tab_Icon_Url}}
      />
    ) : (
      <Image
        style={[styles.avatar, {}]}
        resizeMode="contain"
        source={{uri: this.props.menuList[0].Tab_Icon_url}}
      />
    );
  };
  _displayIconTwo = index => {
    return index === 1 ? (
      <Image
        style={[styles.avatar, {}]}
        resizeMode="contain"
        source={{uri: this.props.menuList[1].Selected_Tab_Icon_Url}}
      />
    ) : (
      <Image
        style={[styles.avatar, {}]}
        resizeMode="contain"
        source={{uri: this.props.menuList[1].Tab_Icon_url}}
      />
    );
  };
  _displayIconThree = index => {
    return index === 2 ? (
      <Image
        style={[styles.avatar, {}]}
        resizeMode="contain"
        source={{uri: this.props.menuList[2].Selected_Tab_Icon_Url}}
      />
    ) : (
      <Image
        style={[styles.avatar, {}]}
        resizeMode="contain"
        source={{uri: this.props.menuList[2].Tab_Icon_url}}
      />
    );
  };
  _displayIconFour = index => {
    return index === 3 ? (
      <Image
        style={[styles.avatar, {}]}
        resizeMode="contain"
        source={{uri: this.props.menuList[3].Selected_Tab_Icon_Url}}
      />
    ) : (
      <Image
        style={[styles.avatar, {}]}
        resizeMode="contain"
        source={{uri: this.props.menuList[3].Tab_Icon_url}}
      />
    );
  };
  _displayIconFive = index => {
    return index === 4 ? (
      <Image
        style={[styles.avatar, {}]}
        resizeMode="contain"
        source={{uri: this.props.menuList[4].Selected_Tab_Icon_Url}}
      />
    ) : (
      <Image
        style={[styles.avatar, {}]}
        resizeMode="contain"
        source={{uri: this.props.menuList[4].Tab_Icon_url}}
      />
    );
  };
}

const mapStateToProps = (state, props) => {
  //props can be called as ownProps
  const {
    configState: {mobileNo, menuList},
  } = state;

  return {
    mobileNo,
    menuList,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BottomBar);

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    borderTopColor: '#778899',
    borderTopWidth: 0.3,
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    justifyContent: 'center',
    paddingTop: 2,
  },
  imageBackground: {
    paddingVertical: 4,
    alignSelf: 'center',
  },
  avatar: {
    width: deviceHeight / 25,
    height: deviceHeight / 25,
  },
  label: {
    alignSelf: 'center',
    paddingHorizontal: 4,
    fontSize: 10,
  },
});

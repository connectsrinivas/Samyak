/* eslint-disable no-undef */
const React = require('react');
const {ViewPropTypes} = (ReactNative = require('react-native'));
const PropTypes = require('prop-types');
const createReactClass = require('create-react-class');
const {StyleSheet, Text, View, Animated, Dimensions} = ReactNative;
const Button = require('./Button');

import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
const deviceWidth = Dimensions.get('window').width;

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

const LabCustomTabBar = createReactClass({
  propTypes: {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
    backgroundColor: PropTypes.string,
    activeTextColor: PropTypes.string,
    inactiveTextColor: PropTypes.string,
    textStyle: Text.propTypes.style,
    tabStyle: ViewPropTypes.style,
    renderTab: PropTypes.func,
    underlineStyle: ViewPropTypes.style,
  },

  getDefaultProps() {
    return {
      activeTextColor: 'navy',
      inactiveTextColor: 'black',
    };
  },

  renderTabOption(name, page) {},

  renderTab(name, page, isTabActive, onPressHandler) {
    const {activeTextColor, inactiveTextColor, textStyle} = this.props;
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;
    const fontWeight = isTabActive ? 'bold' : 'normal';

    return (
      <Button
        key={name}
        accessible={true}
        accessibilityLabel={name}
        accessibilityTraits="button"
        onPress={() => onPressHandler(page)}>
        <View style={[styles.tab, this.props.tabStyle]}>
          <Text
            style={[
              {
                color: textColor,
                fontWeight,
              },
              textStyle,
            ]}>
            {' '}
            {name}{' '}
          </Text>{' '}
        </View>{' '}
      </Button>
    );
  },

  render() {
    const containerWidth = this.props.containerWidth;
    const numberOfTabs = this.props.tabs.length + 3;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: '45%',
      height: 2,
      bottom: 10,
      justifyContent: 'center',
      marginLeft: 2,
      backgroundColor: '#FAA929',
    };

    const translateX = this.props.scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 52],
    });
    return (
      <View
        style={[
          styles.tabs,
          {
            backgroundColor: this.props.backgroundColor,
          },
          this.props.style,
        ]}>
        {' '}
        {this.props.tabs.map((name, page) => {
          const isTabActive = this.props.activeTab === page;
          const renderTab = this.props.renderTab || this.renderTab;
          return renderTab(name, page, isTabActive, this.props.goToPage);
        })}{' '}
        <Animated.View
          style={[
            tabUnderlineStyle,
            {
              transform: [
                {
                  translateX,
                },
              ],
            },
            this.props.underlineStyle,
          ]}
        />{' '}
      </View>
    );
  },
});

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  tabs: {
    width: '30%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
});

module.exports = LabCustomTabBar;

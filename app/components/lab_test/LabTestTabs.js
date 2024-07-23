import React, {Component} from 'react';
import {Text, View, StyleSheet, Dimensions} from 'react-native';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
var ScrollableTabView = require('react-native-scrollable-tab-view');
var LabCustomTabBar = require('./LabCustomTabBar');

import LabTestTabExplore from './LabTestTabExplore';
import {color} from 'react-native-reanimated';

export default class LabTestTabs extends Component {
  render() {
    return (
      <View style={styles.mainContainer}>
        <ScrollableTabView
          renderTabBar={() => <LabCustomTabBar someProp={'here'} />}
          tabBarPosition={'top'}
          tabBarActiveTextColor="black"
          tabBarInactiveTextColor="#A6A6A6">
          <LabTestTabExplore tabLabel="Explore" />
          <LabTestTabExplore tabLabel="New" />
        </ScrollableTabView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FBFBFB',
    height: deviceHeight / 2.1,
  },
});

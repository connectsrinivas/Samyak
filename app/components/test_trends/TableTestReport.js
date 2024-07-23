'use strict';
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import { Actions } from 'react-native-router-flux';
import { FlatList } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import PropTypes from 'prop-types';
import ButtonBack from '../common/ButtonBack';
import OrientationLocker, { Orientation } from 'react-native-orientation-locker';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default class TableTestReport extends Component {
  // static PropTypes = {
  //   tableData: PropTypes.object,
  // };

  constructor(props) {
    super(props);
    this.state = {
      backbtnPressed: false,
    };
  }

  componentDidMount() {
    Orientation.lockToLandscape();
  }

  componentWillUnmount() {
    Orientation.lockToPortrait();
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View
          style={{
            flex: 1,
            margin: 10,
          }}>
          <KeyboardAwareScrollView>
            <View style={styles.tableHeaderView}>
              <Text style={styles.tableHeaderText}>Date</Text>
              <Text style={styles.tableHeaderText}>Result</Text>
            </View>
            <FlatList
              style={{
                borderWidth: 1.0,
                borderColor: 'black',
                borderRadius: 10,
                marginTop: 10,
              }}
              data={this.props.tableData}
              renderItem={this._renderList}
            />
          </KeyboardAwareScrollView>
        </View>
        <Text style={{ padding: 20, paddingTop: 0 }}>{this.props.refValue}</Text>
        <View
          style={{
            margin: 10,
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}>
          <TouchableOpacity
            disabled={this.state.backbtnPressed}
            onPress={() => {
              this.setState({
                backbtnPressed: true,
              });
              Actions.pop();
              setTimeout(() => {
                this.setState({
                  backbtnPressed: false,
                });
              }, 1000);
            }}>
            <ButtonBack />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _renderList = ({ item }) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.dateAndTimeView}>
          <Text> {item.Date}</Text>
        </View>
        <View style={styles.dateAndTimeView}>
          <Text> {item.Result}</Text>
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  tableHeaderView: {
    marginTop: 50,
    marginHorizontal: 20,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 20,
    alignSelf: 'center',
    textAlign: 'center',
  },
  dateAndTimeView: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D8D8D8',
    padding: 20,
    alignItems: 'center',
  },
});

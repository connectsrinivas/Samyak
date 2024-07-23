/*************************************************
 * SukraasLIS
 * @exports
 * @class Model.js
 * @extends Component
 * Created by Sankar on 03/06/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class Popup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}>
        <TouchableOpacity
          style={[
            styles.container,
            this.props.showTop
              ? {marginTop: deviceHeight / 6}
              : {justifyContent: 'center'},
          ]}
          onPress={() => {
            this.props.hideModel();
          }}>
          <View>
            <View style={styles.subContainer}>
              <FlatList
                data={this.props.array}
                renderItem={this._renderRow}
                keyExtractor={this._keyExtractor}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  _keyExtractor = data => {
    return data.id;
  };
  _renderRow = ({item}) => {
    if (this.props.dropDownType === 'PATIENT') {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.onPressed(
              item.name,
              item.gender,
              item.relation,
              item.patientTestCode,
              item.patientAge,
            );
          }}>
          <Text style={styles.label}>{item.name}</Text>
        </TouchableOpacity>
      );
    } else if (this.props.dropDownType === 'TEST') {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.onPressed(
              item.testName,
              item.testCode,
              item.testSubCode,
            );
          }}>
          <Text style={styles.label}>{item.testName}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.onPressed(item.label, item.gender, item.relation);
          }}>
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      );
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  subContainer: {
    width: deviceWidth / 1.5,
    height: deviceWidth / 1.5,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    borderColor: Constants.COLOR.WHITE_COLOR,
    elevation: 2,
  },
  label: {
    padding: 15,
    fontSize: Constants.FONT_SIZE.M,
    color: Constants.COLOR.BLACK_COLOR,
  },
});

export default Popup;

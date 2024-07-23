/************************************************* *
 * SukraasLIS *
 * @exports * @class LabTestHeader.js *
 * @extends Component
 * * Created by Shiva Sankar on 12/05/2020 *
 * Copyright © 2020 SukraasLIS. All rights reserved.
 * *************************************************/
'use strict';
import React, {Component} from 'react';
import {Text, View, StyleSheet, ScrollView, FlatList} from 'react-native';
import Constants from '../../util/Constants';

export default class LabTestHeader extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.headerStatus}>
        <View style={styles.containerView}>
          <View style={styles.itemView}>
            <View
              style={[
                this.props.selectValue >= 1
                  ? styles.selectedCircleShapeView
                  : styles.unselectCircleShapeView,
              ]}>
              <Text
                style={[
                  this.props.selectValue >= 1
                    ? styles.selectedTextStyle
                    : styles.unselectedTextStyle,
                ]}>
                1
              </Text>
            </View>
            <View style={styles.dottedStyle} />
          </View>
          <Text style={styles.statusLabelStyle}>Lab Test</Text>
        </View>

        <View style={styles.containerView}>
          <View style={styles.itemView}>
            <View
              style={[
                this.props.selectValue >= 2
                  ? styles.selectedCircleShapeView
                  : styles.unselectCircleShapeView,
              ]}>
              <Text
                style={[
                  this.props.selectValue >= 2
                    ? styles.selectedTextStyle
                    : styles.unselectedTextStyle,
                ]}>
                2
              </Text>
            </View>
            <View style={styles.dottedStyle} />
          </View>
          <Text style={styles.statusLabelStyle}>Book</Text>
        </View>

        <View style={styles.containerView}>
          <View style={styles.itemView}>
            <View
              style={[
                this.props.selectValue >= 3
                  ? styles.selectedCircleShapeView
                  : styles.unselectCircleShapeView,
              ]}>
              <Text
                style={[
                  this.props.selectValue >= 3
                    ? styles.selectedTextStyle
                    : styles.unselectedTextStyle,
                ]}>
                3
              </Text>
            </View>
            <View style={styles.dottedStyle} />
          </View>
          <Text style={styles.statusLabelStyle}>Patient Info </Text>
        </View>

        <View style={{flex: 1, justifyContent: 'center'}}>
          <View
            style={[
              this.props.selectValue >= 4
                ? styles.selectedCircleShapeView
                : styles.unselectCircleShapeView,
            ]}>
            <Text
              style={[
                this.props.selectValue >= 4
                  ? styles.selectedTextStyle
                  : styles.unselectedTextStyle,
              ]}>
              4
            </Text>
          </View>
          <Text style={styles.statusLabelStyle}>Payment</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerStatus: {
    backgroundColor: Constants.COLOR.LAB_HEADER_VIEW,
    flexDirection: 'row',
    paddingVertical: 15,
  },
  selectedCircleShapeView: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: '#666666',
    alignSelf: 'center',
  },
  unselectCircleShapeView: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    borderColor: '#666666',
    borderWidth: 0.5,
    alignSelf: 'center',
  },
  selectedTextStyle: {
    fontSize: 15,
    color: 'white',
    alignSelf: 'center',
    padding: 5,
  },
  unselectedTextStyle: {
    fontSize: 15,
    color: 'black',
    alignSelf: 'center',
    padding: 5,
  },
  dottedStyle: {
    height: 1,
    width: '68%',
    borderRadius: 1,
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'dotted',
    position: 'absolute',
    left: 30,
  },
  statusLabelStyle: {
    alignSelf: 'center',
    fontSize: 12,
    marginVertical: 4,
  },
  itemView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerView: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

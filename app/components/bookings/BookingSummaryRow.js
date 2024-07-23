/*************************************************
 * SukraasLIS
 * @exports
 * @class LabTestSummary.js
 * @extends Component
 * Created by Shiva Sankar on 28/06/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Constants from '../../util/Constants';
import HTML from 'react-native-render-html';

class BookingSummaryRow extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (this.props.rowData !== undefined) {
      return (
        <View style={styles.rowMainView}>
          <View style={styles.rowView}>
            <Text style={[styles.rowText, {flex: 1}]}>
              {this.props.rowData.Service_Name}
            </Text>
            {this._renderAmount()}
          </View>
        </View>
      );
    } else {
      return null;
    }
  }

  _renderAmount = () => {
    return (
      <View style={styles.rowText}>
        <HTML
          baseFontStyle={styles.rowText}
          html={
            this.props.currency +
            ' ' +
            this.props.rowData.Service_Amount.toFixed(2)
          }
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  rowMainView: {
    flex: 1,
  },
  rowView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Constants.COLOR.LAB_PAY_SUMMARY_BG,
  },
  rowText: {
    alignSelf: 'center',
    fontSize: Constants.FONT_SIZE.SM,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: Constants.COLOR.LAB_SUMMARY_TEXT,
  },
  rowTextAlertMessage: {
    marginTop: -15,
    paddingBottom: 12,
    paddingHorizontal: 16,
    fontSize: Constants.FONT_SIZE.SM,
    color: 'red',
  },
  totalView: {
    backgroundColor: Constants.COLOR.LAB_TOTAL_VIEW,
    height: 50,
  },
  subTotalText: {
    color: Constants.COLOR.LAB_SUB_TOTAL_FONT,
    fontSize: Constants.FONT_SIZE.SM,
    alignSelf: 'center',
    marginRight: 20,
  },
  subTotalView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default BookingSummaryRow;

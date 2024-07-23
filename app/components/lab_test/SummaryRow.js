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
// import HTML from 'react-native-render-html';
import RenderHtml from 'react-native-render-html';

class SummaryRow extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let finalValue = '';
    if (this.props.couponDetails !== undefined) {
      let b = parseInt(this.props.couponDetails.Offer_Percentage);

      let numVal1 = this.props.rowData.Amount;

      let numVal2 = b / 100;

      let totalValue = numVal1 - numVal1 * numVal2;

      const value = totalValue.toFixed(2);
      finalValue = value;
    }

    return (
      <View style={styles.rowMainView}>
        <View style={styles.rowView}>
          {this.props.rowData.Suppress_Discount ? (
            <Text style={styles.notes}>{' *'} </Text>
          ) : (
            <Text style={styles.notes}>{'  '} </Text>
          )}
          <Text style={[styles.rowText, {flex: 1}]}>
            {this.props.rowData.Service_Name}
          </Text>
          {this._renderAmount()}
        </View>
        {this._renderNoHouseWarning()}
      </View>
    );
  }
  _renderNoHouseWarning = () => {
    if (
      this.props.isFromSummary !== undefined &&
      this.props.isFromSummary === true
    ) {
      if (
        this.props.rowData.hasOwnProperty('No_House_Visit') &&
        this.props.rowData.No_House_Visit === 'Y'
      ) {
        return (
          <Text style={styles.rowTextAlertMessage}>
            {this.props.rowData.No_House_Visit_Message}
          </Text>
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
  _renderAmount = () => {
    return (
      <View style={styles.rowText}>
        <RenderHtml
          baseFontStyle={styles.rowText}
          source={{html:
            this.props.currency + ' ' + this.props.rowData.Amount.toFixed(2)
          }}
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
    fontSize: Constants.FONT_SIZE.SM,
    paddingVertical: 12,
    paddingEnd: 16,
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
  notes: {
    color: 'red',
    textAlign: 'center',
    alignSelf: 'center',
    paddingBottom: 4,
    fontSize: Constants.FONT_SIZE.S,
  },
});

export default SummaryRow;

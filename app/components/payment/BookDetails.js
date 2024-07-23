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
import moment from 'moment';

class BookDetails extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        {this._renderAddressView()}
        <View style={styles.dateTimeView}>
          <Text style={styles.dateTimeText}> {this.props.bookingType}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.dateTimeText}>
              {moment(this.props.bookingDate, 'YYYY/MM/DD').format(
                'DD/MM/YYYY',
              )}
            </Text>
            <Text style={styles.dateTimeText}> {this.props.bookingTime}</Text>
          </View>
        </View>
      </View>
    );
  }

  _renderAddressView = () => {
    if (this.props.bookingType !== 'HOME') {
      return (
        <View>
          <Text style={[styles.addressText, {fontWeight: 'bold'}]}>
            {this.props.patientDetails.Pt_Title_Desc}{' '}
            {this.props.patientDetails.Pt_Name}
          </Text>
        </View>
      );
    } else {
      const {
        Address_Type_Desc,
        Street,
        Place,
        City,
        State,
        PinCode,
        Landmark,
      } = this.props.bookData;
      const {Pt_Title_Desc, Pt_Name, Pt_Mobile_No} = this.props.patientDetails;
      return (
        <View style={styles.addressView}>
          <Text style={[styles.addressText, {fontWeight: 'bold'}]}>
            {Pt_Title_Desc} {Pt_Name}
          </Text>
          <Text style={styles.addressText}>
            {`${Street}${','} ${Place}${','} ${City}${','} ${State}${','} ${PinCode} `}
          </Text>
          {this._renderLandmark(Landmark)}
          <Text style={styles.addressText}>{Pt_Mobile_No}</Text>
        </View>
      );
    }
  };

  _renderLandmark = Landmark => {
    if (
      Landmark !== null &&
      Landmark !== undefined &&
      Landmark !== '' &&
      Landmark.trim().length > 0
    ) {
      return <Text style={styles.addressText}>Landmark: {Landmark}</Text>;
    } else {
      <Text style={styles.addressText} />;
    }
  };
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Constants.COLOR.LAB_PAY_SUMMARY_BG,
    marginVertical: 8,
  },
  addressView: {
    marginVertical: 4,
    elevation: 0.2,
    justifyContent: 'space-around',
  },
  addressText: {
    fontSize: Constants.FONT_SIZE.SM,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 20,
    color: Constants.COLOR.LAB_SUMMARY_TEXT,
  },
  dateTimeView: {
    flexDirection: 'row',
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: Constants.FONT_SIZE.SM,
    paddingHorizontal: 8,
    paddingVertical: 16,
    color: Constants.COLOR.LAB_SUMMARY_TEXT,
  },
});

export default BookDetails;

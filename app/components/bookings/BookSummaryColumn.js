/* eslint-disable react-native/no-inline-styles */
/*************************************************
 * SukraasLIS
 * @exports
 * @class CashPaymentSuccess.js
 * @extends Component
 * Created by Shiva Sankar on 01/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Constants from '../../util/Constants';
import RenderHtml from 'react-native-render-html';

class BookSummaryColumn extends Component {
  render() {
    if (this.props.rowData !== undefined) {
      return this._renderSubTotal();
    } else {
      return null;
    }
  }

  _renderSubTotal = () => {
    var finalTotal = 0;
    var total = this.props.collectionCharge;
    var discount = 0;
    for (var i = 0; i < this.props.rowData.length; i++) {
      total = total + this.props.rowData[i].Service_Amount;
      discount = discount + this.props.rowData[i].Service_Discount;
    }
    finalTotal = total - discount;

    return (
      <View
        style={{
          paddingVertical: 8,
          paddingHorizontal: 15,
          backgroundColor: Constants.COLOR.LAB_TOTAL_VIEW,
        }}>
        {this._renderSubTotalView(discount, total)}
        {this._renderOfferView(discount)}

        <View style={styles.totalView}>
          <View style={styles.subTotalView}>
            <Text style={styles.subTotalText}>Amount Payable</Text>
            <View style={styles.cartItemText}>
              <RenderHtml
                baseFontStyle={styles.cartItemText}
                source={{html:this.props.currency + ' ' + finalTotal.toFixed(2)}}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  _renderSubTotalView = (discount, total) => {
    console.log('======_renderSubTotalView  ====',_renderSubTotalView );
    if (
      discount !== null &&
      discount !== '' &&
      discount !== 0 &&
      discount !== '0'
    ) {
      return (
        <View style={[styles.totalView]}>
          <View style={styles.subTotalView}>
            <Text style={styles.subTotalText}>SubTotal</Text>
            <View style={styles.cartItemText}>
              <RenderHtml
                baseFontStyle={styles.cartItemText}
                source={{html:this.props.currency + ' ' + total.toFixed(2)}}
              />
            </View>
          </View>
        </View>
      );
    } else {
      return <View />;
    }
  };
  _renderOfferView = discount => {
    if (
      discount !== null &&
      discount !== '' &&
      discount !== 0 &&
      discount !== '0'
    ) {
      return (
        <View style={[styles.totalView]}>
          <View style={styles.subTotalView}>
            <Text style={styles.subTotalText}>Offer</Text>

            <View style={styles.cartItemText}>
              <RenderHtml
                baseFontStyle={styles.cartItemText}
                source={{html:'- ' + this.props.currency + ' ' + discount.toFixed(2)}}
              />
            </View>
          </View>
        </View>
      );
    } else {
      return <View />;
    }
  };
}

const styles = StyleSheet.create({
  totalView: {
    backgroundColor: Constants.COLOR.LAB_TOTAL_VIEW,
    height: 50,
  },
  subTotalText: {
    flex: 1,
    color: Constants.COLOR.LAB_SUB_TOTAL_FONT,
    fontSize: Constants.FONT_SIZE.M,
    alignSelf: 'center',
    textAlign: 'left',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
  },
  subTotalView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cartItemText: {
    alignSelf: 'center',
    fontSize: Constants.FONT_SIZE.M,
    color: Constants.COLOR.LAB_CART_ITEM_FONT,
  },
});

export default BookSummaryColumn;



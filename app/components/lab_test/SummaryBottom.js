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

class SummaryBottom extends Component {
  render() {
    return this._renderSubTotal();
  }

  _renderSubTotal = () => {
    const {cartAmount, data} = this.props;
    let size = Object.keys(data).length;
    if (size > 0) {
      return (
        <View>
          <View style={[styles.totalView]}>
            <View style={styles.subTotalView}>
              <Text style={styles.subTotalText}>SubTotal</Text>
              <View style={styles.cartItemText}>
                <RenderHtml
                  baseFontStyle={styles.cartItemText}
                  source={{html:this.props.currency + ' ' + cartAmount}}
                />
              </View>
            </View>
          </View>
          <View style={[styles.totalView]}>
            <View style={styles.subTotalView}>
              <Text style={styles.subTotalText}>
                {`${data.Coupon_Code}${'('}${data.Offer_Percentage}${'%)'}`}
              </Text>

              <View style={styles.cartItemText}>
                <RenderHtml
                  baseFontStyle={styles.cartItemText}
                  source={{html:'- ' + this.props.currency + ' ' + data.Discount_Amount}}
                />
              </View>
            </View>
          </View>
          <View style={styles.totalView}>
            <View style={styles.subTotalView}>
              <Text style={styles.subTotalText}>Payable Amount </Text>
              <View style={styles.cartItemText}>
                <RenderHtml
                  baseFontStyle={styles.cartItemText}
                  source={{html:this.props.currency + ' ' + data.Payable_Amount}}
                />
              </View>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.totalView}>
          <View style={styles.subTotalView}>
            <Text style={styles.subTotalText}>Sub Total </Text>
            <View style={styles.cartItemText}>
              <RenderHtml
                baseFontStyle={styles.cartItemText}
              source={{html:this.props.currency + ' ' + cartAmount}}
              />
            </View>
          </View>
        </View>
      );
    }
  };
}

const styles = StyleSheet.create({
  totalView: {
    backgroundColor: Constants.COLOR.LAB_TOTAL_VIEW,
    height: 50,
  },
  subTotalText: {
    color: Constants.COLOR.LAB_SUB_TOTAL_FONT,
    fontSize: Constants.FONT_SIZE.M,
    alignSelf: 'center',
    marginRight: 20,
  },
  subTotalView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cartItemText: {
    margin: 15,
    fontSize: Constants.FONT_SIZE.M,
    color: Constants.COLOR.LAB_CART_ITEM_FONT,
  },
});

export default SummaryBottom;

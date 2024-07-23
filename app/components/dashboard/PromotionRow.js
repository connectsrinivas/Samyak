/*************************************************
 * SukraasLIS
 * @exports
 * @class PromotionScreen.js
 * @extends Component
 * Created by Kishore on 18/06/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Clipboard
} from 'react-native';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import LinearGradient from 'react-native-linear-gradient';
import {Actions} from 'react-native-router-flux';
// import Clipboard from '@react-native-community/clipboard';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class PromotionRow extends Component {
 //  static propTypes = {
  //   rowData: PropTypes.object,
  //   isFromPayment: PropTypes.bool,
  // };

  constructor(props) {
    super(props);
  }

  _onPressCopyCode = (Coupon_Code, Offer_Percentage) => {
    if (this.props.isFromPayment) {
      Actions.labTestPaymentDetails({
        couponCode: Coupon_Code,
        Offer_Percentage: Offer_Percentage,
        isCodeCopy: true,
      });
    } else {
      Clipboard.setString(Coupon_Code);
      console.log("Coupon code copied to clipboard:", Coupon_Code);
    }
  };

  render() {
    const {
      Coupon_Code,
      Coupon_Heading,
      Coupon_Desc,
      Validity_ToDate,
      Offer_Percentage,
      Offer_Times,
    } = this.props.rowData;

    return (
      <View>
        {/* <Text>Hi promo</Text> */}
        <View style={styles.bodyView}>
          <LinearGradient
            start={{x: -1, y: -1}}
            end={{x: 1, y: 1}}
            colors={['#4A0C86', '#4A0C86', '#9229A6']}
            style={styles.couponBottomView}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
                paddingBottom: Coupon_Code.length > 9 ? 0 : 10,
              }}>
              <View>
                <Text style={styles.couponCode}>Coupon Code</Text>
                {Coupon_Code.length <= 9 ? (
                  <Text style={styles.couponCodeText}>{Coupon_Code}</Text>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={() => {
                  this._onPressCopyCode(Coupon_Code, Offer_Percentage);
                }}>
                <Text style={styles.copycodebtn}>
                  {this.props.isFromPayment ? 'Redeem Now' : 'Copy Code'}
                </Text>
              </TouchableOpacity>
            </View>

            {Coupon_Code.length > 9 ? (
              <Text
                style={[
                  styles.couponCodeText,
                  {paddingHorizontal: 10, paddingBottom: 10},
                ]}>
                {Coupon_Code}
              </Text>
            ) : null}
            <Text style={styles.promotionDiscountText}>{Coupon_Desc}</Text>
            <Text
              style={
                styles.validDate
              }>{`${'Valid till '}${Validity_ToDate}`}</Text>
          </LinearGradient>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bodyView: {
    flexDirection: 'column',
    marginTop: 10,
    marginHorizontal: 20,
    marginBottom: 5,
  },
  promotionView: {
    flexDirection: 'column',
    backgroundColor: '#9F7EBD',
    borderRadius: 30,
  },
  couponTopView: {
    flexDirection: 'column',
    marginTop: 0,
    marginBottom: 0,
    overflow: 'hidden',
    backgroundColor: '#4A0C86',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  couponBottomView: {
    flexDirection: 'column',
    marginTop: 1,
    marginBottom: 0,
    padding: 5,
    borderRadius: 30,
    backgroundColor: '#8522A1',
  },
  imageView: {
    marginTop: -50,
    alignSelf: 'center',
    width: deviceHeight * (5 / 20),
    height: deviceHeight * (3 / 20),
  },
  couponContentView: {
    marginTop: 0,
    marginBottom: 5,
  },
  WelcomeText: {
    textAlign: 'center',
    fontSize: Constants.FONT_SIZE.XXL,
    fontWeight: 'normal',
    color: '#EED8EA',
  },
  promotionDiscountText: {
    color: '#C1ACD5',
    marginHorizontal: 10,
    fontSize: Constants.FONT_SIZE.SM,
    alignSelf: 'center',
  },
  couponCode: {
    color: '#BC90CD',
    fontSize: Constants.FONT_SIZE.M,
  },
  couponCodeText: {
    color: 'white',
    fontSize: Constants.FONT_SIZE.XXXL,
    fontWeight: 'normal',
  },
  copycodebtn: {
    color: '#824ECF',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'center',
    marginTop: 5,
    fontSize: Constants.FONT_SIZE.M,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'white',
    backgroundColor: 'white',
    overflow: 'hidden',
  },

  validDate: {
    marginTop: 15,
    color: '#BC90CD',
    textAlign: 'right',
    marginBottom: 10,
    marginHorizontal: 10,
  },
  linearGradientTop: {
    backgroundColor: '#4B0C86',
    flexDirection: 'column',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    marginTop: 0,
    marginBottom: 1,
  },
  linearGradientBottom: {
    backgroundColor: '#4B0C86',
    flexDirection: 'column',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginTop: 0,
    marginBottom: -20,
    padding: 20,
  },
  percentageView: {
    width: 50,
    backgroundColor: '#351252',
    padding: 8,
    alignSelf: 'flex-end',
  },
  percentageText: {
    color: Constants.COLOR.HALF_WHITE,
    fontSize: Constants.FONT_SIZE.M,
    textAlign: 'justify',
  },
});

export default PromotionRow;

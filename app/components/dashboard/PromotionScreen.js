/*************************************************
 * SukraasLIS
 * @exports
 * @class PromotionScreen.js
 * @extends Component
 * Created by Kishore on 12/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import PromotionRow from './PromotionRow';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  getPromotionDetails,
  showRedeemNowOrCouponCode,
} from '../../actions/DashboardAction';
import LoadingScreen from '../common/LoadingScreen';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

class PromotionScreen extends Component {
  //  static propTypes = {
  //   getPromotionDetails: PropTypes.func,
  //   arrPromotionDetails: PropTypes.array,
  //   promotionPageLoading: PropTypes.bool,
  //   isShowRedeemNow: PropTypes.bool,

  //   currency: PropTypes.string,
  //   firmName: PropTypes.string,
  //   firmNo: PropTypes.string,
  // };

  constructor(props) {
    super(props);

    if (this.props.isFromPayment) {
      this.props.showRedeemNowOrCouponCode(this.props.isFromPayment);
    } else {
      this.props.showRedeemNowOrCouponCode(false);
    }
    this.state = {
      refreshing: false,
    };
  }

  componentDidMount() {
    //invoke Promo code list WebService
    this.props.getPromotionDetails();
  }


  render() {
    const { arrPromotionDetails, promotionPageLoading } = this.props;

    return (
      <View style={styles.mainContainer}>{this._renderPromotionView()}</View>
    );
  }

  _renderPromotionView = () => {
    if (this.props.promotionPageLoading) {
      return (
        <View style={styles.loadingView}>
          <LoadingScreen
            isLoading={true}
            message={'No Record found'}
            onReloadPress={() => { }}
          />
        </View>
      );
    } else {
      if (this.props.arrPromotionDetails.length > 0) {
        return (
          <KeyboardAwareScrollView
            style={styles.containerView}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                paddingVertical: 20,
                alignSelf: 'flex-end',
                paddingHorizontal: 25,
              }}>
              <Image
                style={{
                  width: deviceHeight / 35,
                  height: deviceHeight / 35,
                  marginHorizontal: 5,
                }}
                source={require('../../images/placeholder.png')}
              />
              <Text style={{}}>{this.props.firmName}</Text>
            </View>
            <Text style={styles.headerText}>
              Promotions are based on the user and based on their usability.
            </Text>
            <FlatList
              extraData={this.props.isShowRedeemNow}
              data={this.props.arrPromotionDetails}
              renderItem={this._renderPromotionRow}
              keyExtractor={this._keyExtractor}
            />
          </KeyboardAwareScrollView>
        );
      } else {
        return (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: 'black',
                textAlign: 'center',
                fontSize: Constants.FONT_SIZE.XXL,
              }}>
              No Promotion Found
            </Text>
          </View>
        );
      }
    }
  };
  // pull to refresh
  _onRefresh = () => {
    this.props.getPromotionDetails();
  };

  _keyExtractor = data => {
    return data.Coupon_Code;
  };

  _renderPromotionRow = ({ item }) => {
    return (
      <PromotionRow rowData={item} isFromPayment={this.props.isShowRedeemNow} />
    );
  };
}
const mapStateToProps = (state, ownProps) => {
  const {
    dashboardState: {
      promotionPageLoading,
      arrPromotionDetails,
      isShowRedeemNow,
    },
    configState: { currency, firmName, firmNo },
  } = state;
  return {
    promotionPageLoading,
    arrPromotionDetails,
    isShowRedeemNow,
    currency,
    firmName,
    firmNo,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(

    { getPromotionDetails, showRedeemNowOrCouponCode },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PromotionScreen);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  containerView: {
    flex: 1,
    backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
  },
  headerText: {
    margin: deviceHeight / 35,
    color: '#838383',
    fontSize: Constants.FONT_SIZE.M,
  },
  loadingView: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});




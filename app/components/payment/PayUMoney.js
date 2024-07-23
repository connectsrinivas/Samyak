/*************************************************
 * SukraasLIS
 * @exports
 * @class PayUMoney.js
 * @extends Component
 * Created by Shiva Sankar on 25/09/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler,
  NativeEventEmitter,
} from 'react-native';
import Constants from '../../util/Constants';
import { Actions } from 'react-native-router-flux';
import { sha512 } from 'js-sha512';
// import PayUBizSdk from 'payu-non-seam-less-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  invokeInitiatePayment,
  Checksum,
} from '../../actions/OnlinePaymentActions';
import LoadingScreen from '../common/LoadingScreen';
import HttpBaseClient from '../../util/HttpBaseClient';

class PayUMoney extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responseObject: {},
    };
  }

  
  componentDidMount() {
    // const eventEmitter = new NativeEventEmitter(PayUBizSdk);
    this.paymentSuccess = eventEmitter.addListener(
      'onPaymentSuccess',
      this.onPaymentSuccess,
    );
    this.paymentFailure = eventEmitter.addListener(
      'onPaymentFailure',
      this.onPaymentFailure,
    );
    this.paymentCancel = eventEmitter.addListener(
      'onPaymentCancel',
      this.onPaymentCancel,
    );
    this.error = eventEmitter.addListener('onError', this.onError);
    this.generateHash = eventEmitter.addListener(
      'generateHash',
      this.generateHash,
    );
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    let postData = {
      payEnvironment: 'P',
      billAmount: this.props.Amount_Payable,
      productInfo: this.props.productinfo,
      firstName: this.props.ptName,
      phoneNo: this.props.phoneNo,
      UserName: this.props.phoneNo,
      successUrl: 'https://www.payumoney.com/mobileapp/payumoney/success.php',
      failedUrl: 'https://www.payumoney.com/mobileapp/payumoney/failure.php',
      email: '',
    };

    this.props.invokeInitiatePayment(postData, (isSuccess, responseData) => {
      if (isSuccess) {
        this.setState({responseObject: responseData}, () => {
          this.launchPayU();
        });
      }
    });
  }
  onPaymentSuccess = e => {
    console.log('payuResponse***********', e.payuResponse);
    let payUResponse = JSON.parse(e.payuResponse);

    if (this.props.isPayNow) {
      let bodyData = this.props.postBodyData;
      bodyData.Pay_Request_Ref_No = payUResponse.txnid;
      bodyData.Pay_Ref_No = payUResponse.id;
      Actions.onlinePaymentSuccess({
        isPayNow: this.props.isPayNow,
        postBodyData: bodyData,
      });
    } else {
      let bodyData = this.props.postBodyData;
      bodyData.append('Pay_Request_Ref_No', payUResponse.txnid);
      bodyData.append('Pay_Ref_No', payUResponse.id);
      console.log('bodyData', bodyData);
      Actions.onlinePaymentSuccess({
        isPayNow: this.props.isPayNow,
        postBodyData: bodyData,
      });
    }
  };
  onPaymentFailure = e => {
    console.log(e.merchantResponse);
    console.log(e.payuResponse);
    Actions.paymentFailure({ isPayNow: this.props.isPayNow });
  };
  onPaymentCancel = e => {
    Actions.paymentFailure({ isPayNow: this.props.isPayNow });
    console.log('onPaymentCancel isTxnInitiated -', JSON.stringify(e));
  };
  onError = e => {
    Actions.paymentFailure({ isPayNow: this.props.isPayNow });
    console.log('Errrrorrrrr **************', e);
  };
  generateHash = async e => {
    console.log('Hash nameee  ******', e.hashName);
    console.log('Hash Srting *******', e.hashString);
    let postData = {
      Username: '9500580795',
      payEnvironment: 'P',
      hashString: e.hashString,
    };
    try {
      console.log("Test try");
      const response = await HttpBaseClient.post(
        'http://103.146.234.52:7021/App_RT_UAT/Api/Patient/CheckSum_PayU',
        postData,
        0,
      );
      if (response.Code === Constants.HTTP_CODE.SUCCESS) {
        var result = { [e.hashName]: response.Message.hashValue };
        console.log(result);
        // PayUBizSdk.hashGenerated(result);
      }
    } catch (error) {
      console.log('errrrror  ', error);
    }
  };

  //Do remember to unregister eventEmitters here
  componentWillUnmount() {
    this.paymentSuccess.remove();
    this.paymentFailure.remove();
    this.paymentCancel.remove();
    this.error.remove();
    this.generateHash.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
  handleBackPress = () => {
    return true;
  };
  createPaymentParams = () => {
    console.log('createPaymentParams', this.state.responseObject);
    var value = this.state.responseObject.amount;
    var payUPaymentParams = {
      key: this.state.responseObject.key,
      transactionId: this.state.responseObject.txnId,
      amount: value.toString(),
      productInfo: this.state.responseObject.productName,
      firstName: this.state.responseObject.firstName,
      email: '',
      phone: this.state.responseObject.phone,
      ios_surl: 'https://payu.herokuapp.com/ios_success',
      ios_furl: 'https://payu.herokuapp.com/ios_failure',
      android_surl: 'https://payu.herokuapp.com/success',
      android_furl: 'https://payu.herokuapp.com/failure',
      environment: this.state.responseObject.isDebug ? '1' : '0',
      userCredential: `${this.state.responseObject.key}:${this.state.responseObject.phone
        }`,
    };
    return {
      payUPaymentParams: payUPaymentParams,
    };
  };
  //Used to send back hash generated to SDK
  sendBackHash = (hashName, hashData) => {
    console.log(' hashData ********', hashData);
    var hashValue = this.calculateHash(hashData);
    var hashValue = this.state.responseObject.hash

    var result = { [hashName]: hashValue };
    console.log(result);
    // PayUBizSdk.hashGenerated(result);
  };

  calculateHash = (data) => {
    console.log(data);
    var hash = new sha512();
    hash.update(data);
    var result = hash.digest('hex');
    console.log(result);
    return result;
  };

  launchPayU = () => {
    console.log("pay u commented")
    // PayUBizSdk.openCheckoutScreen(this.createPaymentParams());
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}> Payment is Processing Please wait....</Text>
        <View style={{ alignSelf: 'center', height: 100 }}>
          <LoadingScreen />
        </View>
      </View>
    );
  }
}
const mapStateToProps = (state, props) => {
  const {
    onlinePaymentState: { isOnlinePaymentLoading, payumoneyDetails },
    configState: { mobileNo },
  } = state;
  console.log(isOnlinePaymentLoading, "loading");
  console.log(payumoneyDetails, "loadingDetails");
  return {
    isOnlinePaymentLoading,
    payumoneyDetails,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ invokeInitiatePayment, Checksum }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PayUMoney);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewContainer: {
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: Constants.FONT_SIZE.XL,
    color: Constants.COLOR.BLACK_COLOR,
    textAlign: 'center',
    fontWeight: '400',
    paddingHorizontal: 20,
    color: '#F9A929',
  },
  image: {
    width: 80,
    height: 80,
    marginVertical: 15,
  },
  info: {
    fontSize: Constants.FONT_SIZE.M,
    color: Constants.COLOR.BLACK_COLOR,
    textAlign: 'center',
    marginVertical: 15,
    fontWeight: '400',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 35,
    marginHorizontal: 20,
  },
  buttonView: {
    backgroundColor: '#676767',
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 8,
  },
  buttonText: {
    textAlign: 'center',
    paddingVertical: 12,
    fontSize: Constants.COLOR.L,
    color: Constants.COLOR.WHITE_COLOR,
  },
});


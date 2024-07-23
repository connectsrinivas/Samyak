/*************************************************
 * SukraasLIS
 * @exports
 * @class PaymentWebView.js
 * @extends Component
 * Created by Shankar on 15/09/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, {Component} from 'react';
import {
  Text,
  View,
  Dimensions,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import {WebView} from 'react-native-webview';
import LoadingScreen from '../common/LoadingScreen';
import {Actions} from 'react-native-router-flux';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

const INJECTED_JAVASCRIPT = `(function() {
     // window.ReactNativeWebView.postMessage('Success');
     window.postMessage = function(data) {
       window.ReactNativeWebView.postMessage(data);
     };
 })();`;

let url = '';
let amount = '';
class PaymentWebView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sent: false,
    };
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.calculateAmount();
  }

  // android back button press
  handleBackPress = () => {
    Alert.alert(
      Constants.ALERT.TITLE.INFO,
      Constants.ALERT.MESSAGE.CANCEL_ONLINE_PAYMENT,
      [
        {
          text: Constants.ALERT.BTN.YES,
          onPress: () => {
            Actions.paymentFailure({isPayNow: this.props.isPayNow});
          },
        },
        {text: Constants.ALERT.BTN.NO, onPress: () => {}},
      ],
      {cancelable: false},
    );
    return true;
  };

  // Convert 12 Digit value Of Amount
  calculateAmount = () => {
    console.log('this.props.url', this.props.url);
    url = this.props.url + 'amount=';
    let paise = 0;
    console.log('URlss  ', url);
    const {orderData} = this.props;
    if (this.props.isPayNow) {
      paise = orderData.Due_Amount * 100;
    } else {
      paise = this.props.Amount_Payable * 100;
    }
    amount = '';
    for (let i = 0; i < 12 - paise.toString().length; i++) {
      amount = amount.concat('0');
    }
    amount = amount.concat(paise);
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  // render Payment Webview Screen
  render() {
    console.log('this.props.postBodyData', this.props.postBodyData);
    return (
      <View style={{flex: 1}}>
        {/* {Platform.OS === 'ios' ? this._renderIosView() : this._renderWebView()} */}
        {this._renderWebView()}
      </View>
    );
  }

  // render IOS swipe Gesture
  _renderIosView = () => {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    return (
      <GestureRecognizer
        onSwipe={direction => this.onSwipe(direction)}
        config={config}
        style={{flex: 1}}>
        {this._renderWebView()}
      </GestureRecognizer>
    );
  };

  // on SWIPING LEFT to RIGHT  -----iOS
  onSwipe = directions => {
    if (directions === 'SWIPE_RIGHT') {
      this.handleBackPress();
    }
  };

  //render WebView
  _renderWebView = () => {
    return (
      <View style={{flex: 1}}>
        <WebView
          style={{overflow: 'scroll'}}
          source={{
            uri: `${url}${amount}${'&InvoiceNo='}${
              this.props.InvoiceNumber
            }${'&type='}${'R'}`,
          }}
          // source={{uri:'file:///android_asset/page.html'}}
          // source={{
          //   html: `<body style="display:flex; justify-content:center;flex-direction:column;align-items:center">
          //    <h2>React native webview</h2>
          //    <h2>React native webview data transfer between webview to native</h2>
          //    <button style="color:green; height:100;width:300;font-size:30px"
          //    onclick="myFunction()">Send data to Native</button>
          //    <p id="demo"></p>
          //    <script>
          //    const data = [
          //    'Javascript',
          //    'React',
          //    'React Native',
          //    'graphql',
          //    'Typescript',
          //    'Webpack',
          //    'Node js',
          //    ];
          //    function myFunction() {
          //    window.ReactNativeWebView.postMessage("this is a test message by SANKAR")
          //    }
          //    var i, len, text;
          //    for (i = 0, len = data.length, text = ""; i < len; i++) {
          //    text += data[i] + "<br>";
          //    }
          //    document.getElementById("demo").innerHTML = text;
          //    </script>
          //    </body>`,
          //    }}
          javaScriptEnabled={true}
          ref={ref => (this.webview = ref)}
          onMessage={this.onMessage}
          onError={error => this.handleError(error)}
          onLoadEnd={() => this.passValues()}
          onNavigationStateChange={event => this.handleNavigation(event)}
          thirdPartyCookiesEnabled={true}
          scrollEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          allowUniversalAccessFromFileURLs={true}
          injectedJavaScript={INJECTED_JAVASCRIPT}
          ignoreSslError={true}
          scalesPageToFit={true}
        />
      </View>
    );
  };

  // Pass Data to RN to Webview
  passValues = () => {
    const {orderData} = this.props;
    let data = {};
    if (this.props.isPayNow) {
      data = {
        InvoiceNumber: this.props.InvoiceNumber,
        UserName: orderData.UserName,
        TotalAmount: orderData.Due_Amount.toString(),
      };
    } else {
      data = {
        InvoiceNumber: this.props.InvoiceNumber,
        UserName: orderData.UserName,
        TotalAmount: orderData.Service_Reg_Data[0].Service_Amount.toString(),
      };
    }
    console.log('RANDOM NUMBER------>', data.InvoiceNumber);
    if (!this.state.sent) {
      this.webview.postMessage(JSON.stringify(data));
      this.setState({sent: true});
    }
  };

  //Handle Any Error Occur
  handleError = error => {
    console.log('Errorr ', error);
  };

  //Handle Navigation Event
  handleNavigation = event => {
    console.log('Navigation Event title', event.title);
    console.log('Navigation Event url', event.url);
    console.log('Navigation Event', event);
    if (event.url.includes('RespCode=')) {
      if (event.url.includes('RespCode=00')) {
        console.log('Navigation Event url', event.url);
        console.log('Navigation Event response su', 'Payment check --');
        var strUrl = event.url;
        var strSplitUrl = strUrl.split('=')[3];
        let getTranRef = strSplitUrl.split('%')[0]; // Transaction Reference Number
        console.log(' Transaction Number', getTranRef);
        if (this.props.isPayNow) {
          let bodyData = this.props.postBodyData;
          bodyData.tranRef = getTranRef;
          bodyData.Pay_Ref_No = getTranRef;
          Actions.onlinePaymentSuccess({
            isPayNow: this.props.isPayNow,
            postBodyData: bodyData,
          });
        } else {
          this.props.postBodyData.append('tranRef', getTranRef);
          this.props.postBodyData.append('Pay_Ref_No', getTranRef);
          Actions.onlinePaymentSuccess({
            isPayNow: this.props.isPayNow,
            postBodyData: this.props.postBodyData,
          });
        }
      } else {
        console.log('Navigation Event response fail', event);
        Actions.paymentFailure({isPayNow: this.props.isPayNow});
        // if (this.props.isPayNow) {
        //   let bodyData = this.props.postBodyData
        //   bodyData.tranRef = 'tytytyty'
        //   bodyData.Pay_Ref_No = 'tytytyty'
        //   Actions.onlinePaymentSuccess({
        //     isPayNow: this.props.isPayNow,
        //     postBodyData: bodyData,
        //   });
        // }
      }
    }
  };

  //Cancel online payment
  _renderCancelOnlinePayment = () => {
    Alert.alert(
      Constants.ALERT.TITLE.INFO,
      Constants.ALERT.MESSAGE.CANCEL_ONLINE_PAYMENT,
      [
        {
          text: Constants.ALERT.BTN.YES,
          onPress: () => {
            Actions.paymentFailure({isPayNow: this.props.isPayNow});
          },
        },
        {
          text: Constants.ALERT.BTN.NO,
          onPress: () => {},
        },
      ],
      {cancelable: false},
    );
  };

  //Receive message from Webview to RN
  onMessage = event => {
    const {data} = event.nativeEvent;
    alert(data);
  };

  // Show Customize Loading
  showLoading = () => {
    return <LoadingScreen />;
  };
}

export default PaymentWebView;


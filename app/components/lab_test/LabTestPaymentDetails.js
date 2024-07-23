/*************************************************
 * SukraasLIS
 * @exports
 * @class LabTestPaymentDetails.js
 * @extends Component
 * Created by Kishore on 27/06/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import Constants from '../../util/Constants';
import ButtonNext from '../common/ButtonNext';
import ButtonBack from '../common/ButtonBack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import LabHeader from '../lab_test/LabTestHeader';
import SummaryRow from '../lab_test/SummaryRow';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  applyPromotionDetails,
  removePromoCode,
  showRedeemNowOrCouponCode,
} from '../../actions/DashboardAction';
import {
  orderBookingAPI,
  setPaymentCartArray,
  setPaymentCartArrayWithPromo,
  invokeSampleCollectionCharge,
  invokeValidateBooking,
} from '../../actions/LabTestPaymentDetailsAction';
import { deleteUploadImage } from '../../actions/UploadPrescriptionAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SummaryBottom from '../lab_test/SummaryBottom';
import LoadingScreen from '../common/LoadingScreen';
import Utility from '../../util/Utility';
import BookDetails from '../payment/BookDetails';
import { cond } from 'react-native-reanimated';

var RNFS = require('react-native-fs');

class LabTestPaymentDetails extends Component {
  //  static propTypes = {
  //   isPaymentDetailLoading: PropTypes.bool,
  //   Service_Reg_Data: PropTypes.array,
  //   orderBookingAPI: PropTypes.func,
  //   setPaymentCartArray: PropTypes.func,
  //   deleteUploadImage: PropTypes.func,
  //   setPaymentCartArrayWithPromo: PropTypes.func,

  //   cartCount: PropTypes.number,
  //   cartArray: PropTypes.array,
  //   cartAmount: PropTypes.number,
  //   bookingDate: PropTypes.string,
  //   bookingTime: PropTypes.string,
  //   bookingType: PropTypes.string,

  //   isCodeCopy: PropTypes.bool,
  //   isPromoCodeApplied: PropTypes.bool,
  //   promotionPageLoading: PropTypes.bool,
  //   isNetworkConnectivityAvailable: PropTypes.bool,
  //   applyPromotionDetails: PropTypes.func,
  //   removePromoCode: PropTypes.func,
  //   arrApplyPromoDetails: PropTypes.object,
  //   uploadBase64Image: PropTypes.string,
  //   showRedeemNowOrCouponCode: PropTypes.func,
  //   sampleCollectionData: PropTypes.object,
  //   invokeSampleCollectionCharge: PropTypes.func,
  //   sampleCollectionArr: PropTypes.array,
  //   invokeValidateBooking: PropTypes.func,

  //   //from patientinfo state
  //   selectedAddress: PropTypes.array,
  //   selectedPatient: PropTypes.array,
  //   selectedLoginMobileNo: PropTypes.string,
  //   selectedLoginFirmNo: PropTypes.string,

  //   currency: PropTypes.string,
  //   firmName: PropTypes.string,
  //   firmNo: PropTypes.string,
  //   paymentUrl: PropTypes.string,
  // };

  constructor(props) {
    super(props);
    this.state = {
      voucherInput: '',
      couponOfferPercentage: '',
      isOnlinePaymentSelected: this.props.cartArray.length > 0 ? true : false,
      cartArray: this.props.cartArray,
      cartCount: this.props.cartCount,
      cartAmount: this.props.cartAmount,
      isPromoCodeApplied: true,
      btnNextDisabled: false,
      btnBackDisabled: false,
      MobileNo: '',
    };

    // Remove Already Apply PromCode
    this.props.removePromoCode();
    this.props.showRedeemNowOrCouponCode(false);
  }
  async componentDidMount() {
    await AsyncStorage.getItem(Constants.ASYNC.ASYNC_PHONE_NUMBER)
      .then(value => {
        this.setState({ MobileNo: value });
      })
      .done();

    if (this.props.isCodeCopy) {
      this.setState({ voucherInput: this.props.couponCode });
      this.setState({ couponOfferPercentage: this.props.Offer_Percentage });
    } else {
      this.setState({ voucherInput: '' });
      this.setState({ couponOfferPercentage: '' });
      this._sampleCollectionApiCall();
    }
  }
  _sampleCollectionApiCall = () => {
    AsyncStorage.getItem(Constants.ASYNC.ASYNC_PHONE_NUMBER)
      .then(value => {
        let postData = {};
        if (this.props.bookingType === 'HOME') {
          postData = {
            UserName: value,
            Bill_Amount: this.props.cartAmount,
            Pt_Code: '',
            BookingType: this.props.bookingType === 'HOME' ? 'H' : 'W',
          };
        } else {
          postData = {
            UserName: value,
            Bill_Amount: this.props.cartAmount,
            Pt_Code: this.props.selectedPatient.Pt_Code,
            BookingType: this.props.bookingType === 'HOME' ? 'H' : 'W',
          };
        }
        this.props.invokeSampleCollectionCharge(
          postData,
          this.props.cartAmount,
          (isSuccess, Offer_Percentage, Offer_Code) => {
            this.setState({
              voucherInput: Offer_Code,
              couponOfferPercentage: Offer_Percentage,
              isPromoCodeApplied: false,
            });
          },
        );
      })
      .done();
  };

  invokeApplyPromoCode(promoCode) {
    const { arrApplyPromoDetails } = this.props;
    let size = Object.keys(arrApplyPromoDetails).length;
    if (size > 0) {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        'Promo Code already applied. Remove the PromoCode',
      );
    } else {
      AsyncStorage.getItem(Constants.ASYNC.ASYNC_PHONE_NUMBER)
        .then(value => {
          this.props.applyPromotionDetails(
            {
              UserName: value,
              Promo_Code: promoCode,
            },
            this.state.cartAmount,
            (isSuccess, Offer_Percentage, Offer_Code) => {
              // this.setState({voucherInput: this.props.couponCode});
              this.setState({
                couponOfferPercentage: Offer_Percentage,
                isPromoCodeApplied: false,
              });
            },
          );
        })
        .done();
    }
  }

  render() {
    if (this.props.promotionPageLoading || this.props.isPaymentDetailLoading) {
      return <LoadingScreen />;
    } else {
      return this._renderPaymentDetailsView();
    }
  }
  _renderPaymentDetailsView = () => {
    return (
      <View style={styles.mainContainer}>
        <LabHeader selectValue={4} />
        <KeyboardAwareScrollView>
          <View style={styles.subContainer}>
            <Text style={styles.headerText}>Booking Details </Text>
            <View style={styles.bookDetailsView}>
              <BookDetails
                bookData={this.props.selectedAddress}
                bookingDate={this.props.bookingDate}
                bookingTime={this.props.bookingTime}
                bookingType={this.props.bookingType}
                patientDetails={this.props.selectedPatient}
                currency={this.props.currency}
              />
            </View>

            {this._renderPaymentSummary()}

            <Text style={styles.subHeaderText}>Voucher Code </Text>
            <View style={styles.voucherView}>
              <TextInput
                style={styles.inputStyle}
                editable={this.state.isPromoCodeApplied}
                placeholder="Enter Voucher Code"
                value={this.state.voucherInput}
                underlineColorAndroid="transparent"
                returnKeyType={'done'}
                onChangeText={voucherInput => this.setState({ voucherInput })}
              />
              {this.state.voucherInput !== '' ? (
                <TouchableOpacity
                  style={{ alignSelf: 'center', marginHorizontal: 10 }}
                  onPress={() => {
                    this.setState({ voucherInput: '' });
                    this.setState({ couponOfferPercentage: '' });
                    this.props.removePromoCode();
                  }}>
                  <Image
                    style={{
                      height: 15,
                      width: 15,
                    }}
                    resizeMode="contain"
                    source={require('../../images/black_cross.png')}
                  />
                </TouchableOpacity>
              ) : null}

              {this.state.voucherInput !== '' ? (
                <TouchableOpacity
                  style={[styles.chooseView, { backgroundColor: '#74A718' }]}
                  onPress={() => {
                    this.invokeApplyPromoCode(this.state.voucherInput);
                  }}>
                  <Text style={styles.chooseText}>Apply</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.chooseView}
                  onPress={() => {
                    Actions.promotionScreen({ isFromPayment: true });
                  }}>
                  <Text style={styles.chooseText}>Choose</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.subHeaderText}>Payment Mode </Text>
            <View style={styles.paymentModeView}>
              {this.state.cartArray.length > 0 ? (
                <TouchableOpacity
                  style={[styles.payBorderView, { marginRight: 8 }]}
                  onPress={() => this._paymentClick(true)}>
                  <View
                    style={[
                      styles.circleShapeView,
                      this.state.isOnlinePaymentSelected
                        ? styles.selectedCircleShapeView
                        : styles.circleShapeView,
                    ]}
                  />
                  <Text style={styles.paymentTextStyle}>Online Payment</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={[styles.payBorderView, { marginLeft: 8 }]}
                onPress={() => this._paymentClick(false)}>
                <View
                  style={[
                    styles.circleShapeView,
                    this.state.isOnlinePaymentSelected
                      ? styles.circleShapeView
                      : styles.selectedCircleShapeView,
                  ]}
                />
                <Text style={styles.paymentTextStyle}>Cash Payment</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonView}>
              <TouchableOpacity
                disabled={this.state.btnBackDisabled}
                onPress={() => {
                  this.setState({
                    btnBackDisabled: true,
                  });
                  Actions.pop();
                  setTimeout(() => {
                    this.setState({
                      btnBackDisabled: false,
                    });
                  }, 1000);
                }}>
                <ButtonBack />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={this.state.btnNextDisabled}
                onPress={() => {
                  this.setState({
                    btnNextDisabled: true,
                  });
                  this._nextClick();
                  setTimeout(() => {
                    this.setState({
                      btnNextDisabled: false,
                    });
                  }, 1000);
                }}>
                <ButtonNext />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  };

  _keyExtractor = data => {
    return data.headerId;
  };

  _renderPaymentSummary = () => {
    if (
      this.props.sampleCollectionArr !== undefined &&
      this.props.sampleCollectionArr.length > 0
    ) {
      return (
        <View>
          <Text style={styles.headerText}>Payment Details </Text>
          <FlatList
            style={{ marginTop: 8 }}
            data={this.props.sampleCollectionArr}
            renderItem={this._renderPaymentSummaryRow}
            keyExtractor={this._keyExtractor}
          />

          <SummaryBottom
            data={this.props.arrApplyPromoDetails}
            cartAmount={this.props.sampleCollectionCartAmount}
            currency={this.props.currency}
          />
        </View>
      );
    } else {
      return null;
    }
  };

  _renderPaymentSummaryRow = ({ item }) => {
    return (
      <SummaryRow
        rowData={item}
        isHeaderBackground={Constants.COLOR.WHITE_COLOR}
        isShowDivider={false}
        currency={this.props.currency}
      />
    );
  };

  _paymentClick = isFromOnlinePayment => {
    this.setState({ isOnlinePaymentSelected: isFromOnlinePayment });
  };

  _nextClick = () => {
    // Actions.payumoney()
    if (this.props.isNetworkConnectivityAvailable) {
      this.props.setPaymentCartArrayWithPromo(
        this.state.cartArray,
        this.state.couponOfferPercentage,
        isSuccess => {
          let Amount_Payable =
            Object.keys(this.props.arrApplyPromoDetails).length > 1
              ? this.props.arrApplyPromoDetails.Payable_Amount
              : this.props.sampleCollectionCartAmount;

          let orderBookingData = {
            // UserName: this.props.selectedLoginMobileNo,
            UserName:"9849390103",
            Firm_No: this.props.selectedLoginFirmNo,
            Booking_Type: this.props.bookingType === 'HOME' ? 'H' : 'W',
            Booking_Date: this.props.bookingDate,
            Booking_Time: moment(this.props.bookingTime.trim(), [
              'h:mm A',
            ]).format('HH:mm'),
            Visit_Date: this.props.bookingDate,
            Visit_Time: moment(this.props.bookingTime.trim(), [
              'h:mm A',
            ]).format('HH:mm'),
            Pt_Code: this.props.selectedPatient.Pt_Code,
            Address_Type: this.props.selectedAddress.Address_Type_Code,
            Pay_Mode: this.state.isOnlinePaymentSelected ? 'O' : 'C',
            Pay_Status: this.state.isOnlinePaymentSelected ? 'C' : '',
            Pay_Ref_No: this.state.isOnlinePaymentSelected ? 'AAA34343' : '',
            Paid_Amount:
              Object.keys(this.props.arrApplyPromoDetails).length > 1
                ? this.props.arrApplyPromoDetails.Payable_Amount
                : this.props.sampleCollectionCartAmount,
            Promo_Code: this.state.voucherInput,
            Sample_Collect_Charge:
              Object.keys(this.props.sampleCollectionData).length > 0
                ? this.props.sampleCollectionData.Collection_Charge
                : 0,
            Service_Reg_Data:
              Object.keys(this.props.Service_Reg_Data).length > 0
                ? this.props.Service_Reg_Data
                : '',
            Prescription_File1:
              Object.keys(this.props.uploadBase64Image).length > 0
                ? this.props.uploadBase64Image[0].fileUri
                : '',
            File_Extension1:
              Object.keys(this.props.uploadBase64Image).length > 0
                ? this.props.uploadBase64Image[0].type
                : '',
            Prescription_FileName1:
              Object.keys(this.props.uploadBase64Image).length > 0
                ? this.props.uploadBase64Image[0].fileName
                : '',
            Prescription_File2:
              Object.keys(this.props.uploadBase64Image).length > 1
                ? this.props.uploadBase64Image[1].fileUri
                : '',
            File_Extension2:
              Object.keys(this.props.uploadBase64Image).length > 1
                ? this.props.uploadBase64Image[1].type
                : '',
            Prescription_FileName2:
              Object.keys(this.props.uploadBase64Image).length > 1
                ? this.props.uploadBase64Image[1].fileName
                : '',
            Amount_Payable:
              Object.keys(this.props.arrApplyPromoDetails).length > 1
                ? this.props.arrApplyPromoDetails.Payable_Amount
                : this.props.sampleCollectionCartAmount,
          };
          let body = new FormData();
          if (orderBookingData.Prescription_File1.length > 0) {
            let split = orderBookingData.Prescription_File1.split('/');
            let name = split.pop();
            let inbox = split.pop();
            let realPath = `${RNFS.TemporaryDirectoryPath}${inbox}/${name}`;
            body.append('Prescription_File1', {
              uri:
                Platform.OS === 'ios'
                  ? realPath
                  : orderBookingData.Prescription_File1,
              name: orderBookingData.Prescription_FileName1,
              filename: orderBookingData.Prescription_FileName1,
              type: orderBookingData.File_Extension1,
            });
          } else {
            body.append('Prescription_File1', '');
          }
          body.append(
            'File_Extension1',
            orderBookingData.File_Extension1.includes('/')
              ? orderBookingData.File_Extension1.split('/')[1]
              : orderBookingData.File_Extension1,
          );

          if (orderBookingData.Prescription_File2.length > 0) {
            let split = orderBookingData.Prescription_File2.split('/');
            let name = split.pop();
            let inbox = split.pop();
            let realPath = `${RNFS.TemporaryDirectoryPath}${inbox}/${name}`;
            body.append('Prescription_File2', {
              uri:
                Platform.OS === 'ios'
                  ? realPath
                  : orderBookingData.Prescription_File2,
              name: orderBookingData.Prescription_FileName2,
              filename: orderBookingData.Prescription_FileName2,
              type: orderBookingData.File_Extension2,
            });
          } else {
            body.append('Prescription_File2', '');
          }
          body.append(
            'File_Extension2',
            orderBookingData.File_Extension2.includes('/')
              ? orderBookingData.File_Extension2.split('/')[1]
              : orderBookingData.File_Extension2,
          );

          body.append('UserName', this.props.selectedLoginMobileNo);
          body.append('Firm_No', this.props.selectedLoginFirmNo);
          body.append(
            'Booking_Type',
            this.props.bookingType === 'HOME' ? 'H' : 'W',
          );
          body.append('Booking_Date', this.props.bookingDate);
          body.append(
            'Booking_Time',
            moment(this.props.bookingTime.trim(), ['h:mm A']).format('HH:mm'),
          );
          body.append('Visit_Date', orderBookingData.Visit_Date);
          body.append('Visit_Time', orderBookingData.Visit_Time);
          body.append('Pt_Code', orderBookingData.Pt_Code);
          body.append('Address_Type', orderBookingData.Address_Type);
          body.append(
            'Pay_Mode',
            this.state.isOnlinePaymentSelected ? 'O' : 'C',
          );
          body.append(
            'Pay_Status',
            this.state.isOnlinePaymentSelected ? 'C' : '',
          );
          // body.append(
          //   'Pay_Ref_No',
          //   this.state.isOnlinePaymentSelected ? 'AAA34343' : '',
          // );
          body.append(
            'Paid_Amount',
            this.state.isOnlinePaymentSelected
              ? Object.keys(this.props.arrApplyPromoDetails).length > 1
                ? this.props.arrApplyPromoDetails.Payable_Amount.toString()
                : this.props.sampleCollectionCartAmount.toString()
              : '0',
          );

          // body.append(
          //   'Paid_Amount',
          //   Object.keys(this.props.Service_Reg_Data).length > 0
          //     ? this.props.Service_Reg_Data[0].Service_Amount.toString()
          //     : '',
          // );

          body.append('Promo_Code', this.state.voucherInput);
          body.append(
            'Sample_Collect_Charge',
            orderBookingData.Sample_Collect_Charge,
          );

          // Sample_Collect_Charge: '0',
          body.append('Pt_Code', orderBookingData.Pt_Code);

          body.append(
            'Service_Reg_Data',
            Object.keys(this.props.Service_Reg_Data).length > 0
              ? JSON.stringify(this.props.Service_Reg_Data)
              : '',
          );
          let invoiceNumber =
            '000000000000' + Math.floor(10000000 + Math.random() * 90000000);
          // body.append(
          //   'Pay_Ref_No',
          //   this.state.isOnlinePaymentSelected ? '0' : '',
          // );
          this.props.invokeValidateBooking(body, isSuccess => {
            if (isSuccess) {
              body.append('IsValidated', 'true');
              if (this.state.isOnlinePaymentSelected) {
                Actions.payumoney({
                  isPayNow: false,
                  ptName: this.props.selectedPatient.Pt_Name,
                  phoneNo: this.state.MobileNo,
                  InvoiceNumber: invoiceNumber,
                  orderData: orderBookingData,
                  postBodyData: body,
                  Amount_Payable: Amount_Payable,
                  productinfo: this.props.sampleCollectionArr[0].Service_Name,
                });
              } else {
                this.props.orderBookingAPI(body, false, isCompleted => {
                  if (isCompleted === true) {
                    this.props.deleteUploadImage();
                    Actions.cashPaymentSuccess();
                  }
                });
              }
            }
          });
        },
      );
    } else {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_INTERNET,
      );
    }
  };
}
const mapStateToProps = (state, props) => {
  //props can be called as ownProps
  const {
    labTestPaymentDetailsState: {
      isPaymentDetailLoading,
      Service_Reg_Data,
      sampleCollectionData,
      sampleCollectionArr,
      sampleCollectionCartAmount,
    },
    deviceState: { isNetworkConnectivityAvailable },
    labTestSummaryState: {
      cartCount,
      cartArray,
      cartAmount,
      bookingDate,
      bookingTime,
      bookingType,
    },
    patientInfoState: {
      selectedAddress,
      selectedPatient,
      selectedLoginMobileNo,
      selectedLoginFirmNo,
    },
    dashboardState: { arrApplyPromoDetails, promotionPageLoading },
    UploadPrescriptionState: { uploadBase64Image },
    configState: { currency, firmName, firmNo, paymentUrl },
  } = state;
  return {
    isPaymentDetailLoading,
    Service_Reg_Data,
    isNetworkConnectivityAvailable,
    cartCount,
    cartArray,
    cartAmount,
    bookingDate,
    bookingTime,
    bookingType,
    selectedAddress,
    selectedPatient,
    selectedLoginMobileNo,
    selectedLoginFirmNo,
    arrApplyPromoDetails,
    promotionPageLoading,
    uploadBase64Image,
    currency,
    firmName,
    firmNo,
    paymentUrl,
    sampleCollectionData,
    sampleCollectionCartAmount,
    sampleCollectionArr,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      applyPromotionDetails,
      removePromoCode,
      orderBookingAPI,
      setPaymentCartArray,
      deleteUploadImage,
      setPaymentCartArrayWithPromo,
      showRedeemNowOrCouponCode,
      invokeSampleCollectionCharge,
      invokeValidateBooking,
    },
    dispatch,
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LabTestPaymentDetails);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Constants.COLOR.LAB_PAYMENT_SCREEN_BG,
  },
  subContainer: {
    marginHorizontal: 12,
    marginVertical: 16,
  },
  headerText: {
    fontSize: Constants.FONT_SIZE.M,
    color: Constants.COLOR.BLACK_COLOR,
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: Constants.FONT_SIZE.M,
    color: Constants.COLOR.LAB_PAY_SUB_HEADER_TEXT,
    paddingVertical: 8,
  },
  voucherView: {
    flexDirection: 'row',
    borderColor: Constants.COLOR.LAB_PAY_BORDER,
    borderRadius: 25,
    borderWidth: 1,
    marginVertical: 4,
    shadowColor: Constants.COLOR.LAB_PAY_BORDER,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    elevation: 1,
  },
  inputStyle: {
    flex: 1,
    borderColor: 'red',
    fontSize: Constants.FONT_SIZE.S,
    paddingLeft: 8,
  },
  chooseView: {
    backgroundColor: Constants.COLOR.LAB_CHOOSE_BG,
    borderTopRightRadius: 21,
    borderBottomRightRadius: 21,
    justifyContent: 'center',
  },
  chooseText: {
    fontSize: Constants.FONT_SIZE.SM,
    color: Constants.COLOR.WHITE_COLOR,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  paymentModeView: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  payBorderView: {
    flex: 1,
    borderColor: Constants.COLOR.LAB_PAY_BORDER,
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: 'row',
  },
  circleShapeView: {
    width: 18,
    height: 18,
    borderRadius: 18 / 2,
    backgroundColor: 'gray',
    alignSelf: 'center',
    marginHorizontal: 8,
    marginVertical: 16,
  },
  selectedCircleShapeView: {
    width: 18,
    height: 18,
    borderRadius: 18 / 2,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    alignSelf: 'center',
    marginHorizontal: 8,
    marginVertical: 16,
    borderColor: Constants.COLOR.LAB_CHOOSE_BG,
    borderWidth: 5,
  },
  paymentTextStyle: {
    fontSize: Constants.FONT_SIZE.SM,
    alignSelf: 'center',
    color: Constants.COLOR.BLACK_COLOR,
    paddingHorizontal: 8,
    flex: 1,
  },
  buttonView: {
    marginTop: 30,
    flexDirection: 'row',
    marginVertical: 8,
    justifyContent: 'space-between',
  },
  rowMainView: {
    flex: 1,
    marginVertical: 8,
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowText: {
    fontSize: Constants.FONT_SIZE.M,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  totalView: {
    backgroundColor: Constants.COLOR.LAB_TOTAL_VIEW,
    height: 50,
  },
  subTotalText: {
    color: Constants.COLOR.LAB_SUB_TOTAL_FONT,
    fontSize: Constants.FONT_SIZE.L,
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
  bookDetailsView: {
    marginVertical: 8,
  },
});

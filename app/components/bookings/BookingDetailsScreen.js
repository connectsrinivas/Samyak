/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-lone-blocks */
/*************************************************
 * SukraasLIS
 * @exports
 * @class BookingDetailsScreen.js
 * @extends Component
 * Created by Sankar on 12/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
  Platform,
  SafeAreaView,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import LoadingScreen from '../common/LoadingScreen';
import Utility from '../../util/Utility';
import Constants from '../../util/Constants';
const deviceWidth = Dimensions.get('window').width;
import RatingsView from './RatingsView';
import RatingServiceView from './RatingServiceView';
import PostReviews from './PostReviews';
import ScanBarcodeView from './ScanBarcodeView';
import ButtonBack from '../common/ButtonBack';
import { Actions } from 'react-native-router-flux';
import BookingSummaryRow from './BookingSummaryRow';
import BookSummaryColumn from './BookSummaryColumn';
import {
  invokeBookingList,
  downloadReport,
  setClearLoading,
  downloadInvoice,
} from '../../actions/BookingDetailAction';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode-svg';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

function isEmpty(arg) {
  for (var item in arg) {
    return false;
  }
  return true;
}


class BookingDetailsScreen extends Component {

  //  static propTypes = {
  //   isBookingDetailLoading: PropTypes.bool,
  //   isDownloadPDFLoading: PropTypes.bool,
  //   isDownloadPDFInvoiceLoading: PropTypes.bool,
  //   loginOnSubmit: PropTypes.func,
  //   bookingDetailData: PropTypes.array,
  //   currency: PropTypes.string,
  //   firmName: PropTypes.string,
  //   paymentUrl: PropTypes.string,
  //   downloadInvoice: PropTypes.func,
  // };

  constructor(props) {
    super(props);
    this.state = {
      //from booking list - Start
      UserName: this.props.UserName,
      Booking_Type: this.props.Booking_Type,
      Firm_No: this.props.Firm_No,
      Booking_Date: this.props.Booking_Date,
      Booking_No: this.props.Booking_No,
      pdfbtnClicked: false,
      QRCode_Data: '',
      //from booking list - End

      isShowBodyView: false,
    };
  }

  componentDidMount() {
    //Setting Title
    this.props.setClearLoading();

    if (this.props.isFromNotification) {
      this.props.navigation.setParams({
        title: 'Booking ID: ' + this.props.Booking_No,
      });

      let postData = {
        UserName: this.props.UserName,
        Booking_Type: this.props.Booking_Type,
        Firm_No: this.props.Firm_No,
        Booking_Date: this.props.Booking_Date,
        Booking_No: this.props.Booking_No,
      };
      this.props.invokeBookingList(postData, isSuccess => { });

      if (this.props.notificationData.Navigate_Sub_Type === 'View_Report') {
        let postData = {
          Firm_No: this.props.Firm_No,
          SID_No: this.props.notificationData.Sid_No,
          SID_Date: this.props.notificationData.Sid_Date,
        };

        this.props.downloadReport(postData, (isSuccess, Lab_Report_Url) => {
          if (isSuccess === true) {
            Actions.PdfReport({
              pdfURL: Lab_Report_Url,
              Pt_Name: this.props.bookingDetailData.Pt_Name + '_LabReport',
            });
          }
        });
      }
    } else {
      if (this.props.Booking_Type === 'L') {
        this.props.navigation.setParams({
          title: 'Sample ID: ' + this.state.Booking_No,
        });
      } else {
        this.props.navigation.setParams({
          title: 'Booking ID: ' + this.state.Booking_No,
        });
      }

      let postData = {
        UserName: this.state.UserName,
        Booking_Type: this.state.Booking_Type,
        Firm_No: this.state.Firm_No,
        Booking_Date: this.state.Booking_Date,
        Booking_No: this.state.Booking_No,
      };
      this.props.invokeBookingList(postData, isSuccess => { });
    }
  }



  invokeBookingListAsync = async (postData) => {
    return new Promise((resolve) => {
      this.props.invokeBookingList(postData, (isSuccess) => {
        resolve(isSuccess);
      });
    });
  }

  downloadReportAsync = async (postData) => {
    return new Promise((resolve) => {
      this.props.downloadReport(postData, (isSuccess, Lab_Report_Url) => {
        resolve({ isSuccess, Lab_Report_Url });
      });
    });
  }


  render() {
    return this._renderScreens();
  }

  _renderScreens = () => {
    if (this.props.isBookingDetailLoading) {
      console.log('======== if isBookingDetailLoading ======', this.props.isBookingDetailLoading);
      return this._screenLoading();
    } else {
      console.log('======== else isBookingDetailLoading ======');
      return this._renderBodyView();
    }
  };

  _screenLoading = () => {
    return <LoadingScreen />;
  };

  _renderBodyView = () => {
    var aa = isEmpty(this.props.bookingDetailData);
    console.log('((((((((((((( aa ((((((((((((', this.props.bookingDetailData);
    if (
      this.props.bookingDetailData !== undefined &&
      !isEmpty(this.props.bookingDetailData)
    ) {
      console.log('77777777777777777777777777777777', this.props.bookingDetailData);
      return (
        <View style={{ flex: 1 }}>
          {this._renderBranchName()}
          <KeyboardAvoidingView style={styles.mainContainer}>
            {this._renderBookingIDView()}
            {this._renderNameAddressView()}
            {this._renderPaymentStatusView()}
            {this._renderBookingStatusDesc()}
            {this._renderContactInfoView()}
            {this._renderPaymentSummaryDetails()}
            {this._renderQRCodeInfoView()}
            {this.props.Booking_Type !== 'L' ? (
              <View>
                {this._renderPhlebotomistRatingsView()}
                {this._renderServiceRatingsView()}
                {this._renderPostReviewsView()}
              </View>
            ) : null}
            {this._renderNavigationView()}
          </KeyboardAvoidingView>
        </View>


      );
    } else {
      return (
        <View style={styles.noDataView}>
          <Text style={styles.noDataTv}>No Data Available</Text>
        </View>
      );
    }
  };

  _renderBranchName = () => {
    if (!this.props.isFromNotification) {
      return (
        <View
          style={{
            backgroundColor: Constants.COLOR.WHITE_COLOR,
            paddingVertical: 15,
            flexDirection: 'row',
            alignSelf: 'flex-end',
            paddingHorizontal: 10,
            justifyContent: 'center',
          }}>
          <Image
            style={{
              width: deviceHeight / 35,
              height: deviceHeight / 35,
              marginHorizontal: 5,
            }}
            source={require('../../images/placeholder.png')}
          />
          <Text style={{ alignSelf: 'center' }}>{this.props.Branch_Name}</Text>
        </View>
      );
    }
  };
  _renderPaymentSummaryRow = ({ item }) => {
    return (
      <BookingSummaryRow
        rowData={item}
        currency={this.props.currency}
        isHeaderBackground={Constants.COLOR.WHITE_COLOR}
        isShowDivider={false}
        paymentUrl={this.props.paymentUrl}
      />
    );
  };

  _renderPaymentSummaryDetails() {
    if (this.props.bookingDetailData.Service_Detail !== null) {
      return (
        <View style={{ marginTop: 20 }}>
          <FlatList
            data={this.props.bookingDetailData.Service_Detail}
            renderItem={this._renderPaymentSummaryRow}
            keyExtractor={this._keyExtractor}
          />
          {this.props.bookingDetailData.Sample_Collection_Charge !==
            undefined &&
            this.props.bookingDetailData.Sample_Collection_Charge !== 0 ? (
            <FlatList
              data={[
                {
                  Service_Name: 'Sample Collection Charges',
                  Service_Amount: this.props.bookingDetailData
                    .Sample_Collection_Charge,
                },
              ]}
              renderItem={this._renderPaymentSummaryRow}
              keyExtractor={this._keyExtractor}
            />
          ) : null}
          <BookSummaryColumn
            rowData={this.props.bookingDetailData.Service_Detail}
            currency={this.props.currency}
            collectionCharge={
              this.props.bookingDetailData.Sample_Collection_Charge
            }
          />
        </View>
      );
    } else {
      return <View />;
    }
  }
  _renderBookingIDView = () => {
    return (
      <View style={styles.bookingIdView}>
        <View style={styles.bookingIdLeftView}>
          <Text style={[styles.bookingIdText, { marginTop: 0 }]}>
            Booking Type: {this.props.bookingDetailData.Booking_Type_Desc}
          </Text>
          {this.props.bookingDetailData.Booking_Type_Desc !== 'Direct Visit' ? (
            <>
              <Text style={[styles.bookingIdText, { marginTop: 5 }]}>
                Booking ID: {this.props.bookingDetailData.Booking_No}
              </Text>
              <View>{this._renderSampleId()}</View>
            </>
          ) : null}

          <Text style={styles.bookingIdTime}>
            {this.props.bookingDetailData.Visit_Date_Desc}
          </Text>
        </View>
        {this._renderPDFViewInvoice()}
        {this._renderPDFView()}
      </View>
    );
  };

  _renderSampleId = () => {
    if (
      this.props.bookingDetailData !== undefined &&
      this.props.bookingDetailData.SID_No !== undefined &&
      this.props.bookingDetailData.SID_No.trim().length > 0
    ) {
      return (
        <Text style={[styles.bookingIdText, { paddingVertical: 5 }]}>
          Sample ID: {this.props.bookingDetailData.SID_No}
        </Text>
      );
    } else {
      return null;
    }
  };

  _renderPDFViewInvoice = () => {
    if (
      this.props.bookingDetailData.Invoice_Status !== undefined &&
      this.props.bookingDetailData.Invoice_Status === true
    ) {
      return this._renderPDFInvoiceView();
    } else {
      return <View />;
    }
  };

  _renderPDFView = () => {
    if (
      this.props.bookingDetailData.Report_Status !== undefined &&
      this.props.bookingDetailData.Report_Status === 'C'
    ) {
      return this._renderPDFImageView();
    } else {
      return <View />;
    }
  };
  _renderPDFInvoiceView = () => {
    if (this.props.isDownloadPDFInvoiceLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <View style={styles.bookingIdRightView}>
          <TouchableOpacity
            disabled={this.state.pdfbtnClicked}
            onPress={() => {
              {
                this._clickViewInvoice();
                this.setState({
                  pdfbtnClicked: true,
                });
              }
              setTimeout(() => {
                this.setState({
                  pdfbtnClicked: false,
                });
              }, 1000);
            }}>
            <Image
              style={styles.bookingIdReportImage}
              resizeMode="contain"
              source={require('../../images/pdficon.png')}
            />
            <Text style={styles.bookingIdReportLink}>{'View \n Invoice'}</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };
  _renderPDFImageView = () => {
    if (this.props.isDownloadPDFLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <View style={styles.bookingIdRightView}>
          <TouchableOpacity
            disabled={this.state.pdfbtnClicked}
            onPress={() => {
              {
                this._clickViewReport();
                this.setState({
                  pdfbtnClicked: true,
                });
              }
              setTimeout(() => {
                this.setState({
                  pdfbtnClicked: false,
                });
              }, 1000);
            }}>
            <Image
              style={styles.bookingIdReportImage}
              resizeMode="contain"
              source={require('../../images/pdficon.png')}
            />
            <Text style={styles.bookingIdReportLink}>{'View \n Report'}</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  _clickViewReport = () => {
    let postData = {
      Firm_No: this.state.Firm_No,
      SID_No: this.props.bookingDetailData.SID_No,
      SID_Date: this.props.bookingDetailData.SID_Date,
    };

    this.props.downloadReport(postData, (isSuccess, Lab_Report_Url) => {
      if (isSuccess === true) {
        Actions.PdfReport({
          pdfURL: Lab_Report_Url,
          Pt_Name: this.props.bookingDetailData.Pt_Name + '_LabReport',
        });
      }
    });
  };
  _clickViewInvoice = () => {
    let postData = {
      Firm_No: this.state.Firm_No,
      Invoice_No: this.props.bookingDetailData.Invoice_No,
      Invoice_Date: this.props.bookingDetailData.Invoice_Date,
      Username: this.state.UserName,
    };

    this.props.downloadInvoice(postData, (isSuccess, InvoiceReport_Url) => {
      if (isSuccess === true) {
        console.log('namename  ', this.props.bookingDetailData.Pt_Name);
        Actions.PdfReport({
          pdfURL: InvoiceReport_Url,
          Pt_Name: this.props.bookingDetailData.Pt_Name + '_Invoice',
        });
      }
    });
  };

  _renderNameAddressView = () => {
    return (
      <View style={styles.nameAddressView}>
        <View style={styles.nameAddressLeftView}>
          <View style={styles.profileImageView}>
            {this._showProfileImage()}
          </View>
        </View>
        <View style={styles.nameAddressRightView}>
          <Text style={styles.nameAddressRightNameText}>
            {this.props.bookingDetailData.Pt_Title_Desc}{' '}
            {this.props.bookingDetailData.Pt_Name},{' '}
            {this.props.bookingDetailData.First_Age}
          </Text>
          <View style={styles.nameAddressRightAgePhoneView}>
            <Image
              style={styles.nameAddressRightAgeImage}
              resizeMode="contain"
              source={require('../../images/gender.png')}
            />
            <Text style={styles.nameAddressRightAgeText}>
              {this.props.bookingDetailData.Gender_Code}
            </Text>
            <Image
              style={styles.nameAddressRightMobileImage}
              resizeMode="contain"
              source={require('../../images/mobile.png')}
            />
            <Text style={styles.nameAddressRightMobileText}>
              {this.props.bookingDetailData.Mobile_No}
            </Text>
          </View>

          {this._renderPatientAddress()}
        </View>
      </View>
    );
  };
  _showProfileImage = () => {
    if (
      this.props.bookingDetailData.Pt_Image !== undefined &&
      this.props.bookingDetailData.Pt_Image !== ''
    ) {
      return (
        <TouchableOpacity
          onPress={() => {
            Actions.ZoomImageScreen({
              image: this.props.bookingDetailData.Pt_Image,
              CollectorName: this.props.bookingDetailData.Collector_Name,
              CollectorInfo: this.props.bookingDetailData.About_Collector,
              PhoneNumber: this.props.bookingDetailData.Collector_Mobile_No,
            });
          }}>
          <Image
            style={styles.profileImageView}
            resizeMode="contain"
            source={this.props.bookingDetailData.Pt_Image}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <Text style={styles.profileImageText}>
          {this.props.bookingDetailData.Pt_Name.substring(0, 2).toUpperCase()}
        </Text>
      );
    }
  };

  _renderPatientAddress = () => {
    if (
      this.props.bookingDetailData.Full_Address !== undefined &&
      this.props.bookingDetailData.Full_Address.length > 0
    ) {
      return (
        <View style={styles.nameAddressRightAddressView}>
          <Image
            style={styles.nameAddressRightAddressImage}
            resizeMode="contain"
            source={require('../../images/location.png')}
          />
          <View>
            <Text
              style={[styles.nameAddressRightAddressText, { marginRight: 5 }]}>
              {this.props.bookingDetailData.Full_Address}
            </Text>
            {this._renderLandmark()}
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  _renderLandmark = () => {
    if (
      this.props.bookingDetailData.Pt_Landmark !== null &&
      this.props.bookingDetailData.Pt_Landmark !== undefined &&
      this.props.bookingDetailData.Pt_Landmark !== '' &&
      this.props.bookingDetailData.Pt_Landmark.trim().length > 0
    ) {
      return (
        <Text style={styles.nameAddressRightAddressText}>
          Landmark: {this.props.bookingDetailData.Pt_Landmark}
        </Text>
      );
    } else {
      <Text style={styles.nameAddressRightAddressText} />;
    }
  };

  _renderContactInfoView() {
    if (
      this.props.bookingDetailData.Collector_Name !== undefined &&
      this.props.bookingDetailData.Collector_Name.length > 0 &&
      this.props.bookingDetailData.Collector_Mobile_No !== undefined &&
      this.props.bookingDetailData.Collector_Mobile_No.length > 0
    ) {
      return (
        <View>
          <TouchableOpacity
            style={styles.contactMainView}
            onPress={() => {
              this.setState({
                isShowBodyView: !this.state.isShowBodyView,
              });
            }}>
            <View style={styles.contactImageView}>
              {this._showCollectorProfile()}
            </View>
            <Text style={styles.contactName} numberOfLines={2}>
              {this.props.bookingDetailData.Collector_Name}
            </Text>
            {this._renderArrowView()}
          </TouchableOpacity>
          {this.state.isShowBodyView ? (
            <TouchableOpacity
              style={styles.contactMobileView}
              onPress={() => {
                this.dialCall();
              }}>
              <View style={styles.contactMobileImageView}>
                <Image
                  source={require('../../images/callBlack.png')}
                  style={styles.contactMobileImage}
                />
              </View>
              <Text style={styles.contactMobileText}>
                {this.props.bookingDetailData.Collector_Mobile_No}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      );
    } else {
      return null;
    }
  }

  dialCall() {
    let phoneNumber = '';
    let number = this.props.bookingDetailData.Collector_Mobile_No;
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  }

  _showCollectorProfile = () => {
    if (this.props.bookingDetailData.Collector_Profile_Picture_Url !== '') {
      return (
        <TouchableOpacity
          onPress={() => {
            Actions.ZoomImageScreen({
              image: this.props.bookingDetailData.Collector_Profile_Picture_Url,
              CollectorName: this.props.bookingDetailData.Collector_Name,
              CollectorInfo: this.props.bookingDetailData.About_Collector,
              PhoneNumber: this.props.bookingDetailData.Collector_Mobile_No,
            });
          }}>
          <Image
            source={{
              uri: this.props.bookingDetailData.Collector_Profile_Picture_Url,
            }}
            style={styles.contactImage}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <Image
          source={require('../../images/userBook.png')}
          style={styles.contactImage}
        />
      );
    }
  };
  _renderArrowView = () => {
    if (this.state.isShowBodyView !== true) {
      return (
        <View style={styles.contactArrowView}>
          <Image
            source={require('../../images/arrowDown.png')}
            style={styles.contactArrow}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.contactArrowView}>
          <Image
            source={require('../../images/arrowUp.png')}
            style={styles.contactArrow}
          />
        </View>
      );
    }
  };
  _renderPaymentStatusView() {
    if (
      this.props.bookingDetailData.Payment_Full_Desc !== '' &&
      this.props.bookingDetailData.Payment_Full_Desc !== undefined
    ) {
      return (
        <View
          style={{
            marginTop: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: Constants.COLOR.WHITE_COLOR,
              fontSize: Constants.FONT_SIZE.SM,
              backgroundColor: Constants.COLOR.PAYMENT_STATUS_ONLINE,
              paddingHorizontal: 5,
              borderRadius: 5,
              paddingVertical: 2,
            }}>
            {this.props.bookingDetailData.Payment_Full_Desc}
          </Text>
        </View>
      );
    }
  }

  _renderBookingStatusDesc = () => {
    if (
      this.props.bookingDetailData.Booking_Status_Desc !== undefined &&
      this.props.bookingDetailData.Booking_Status_Desc !== ''
    ) {
      return (
        <View
          style={{
            marginTop: 5,
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: Constants.FONT_SIZE.SM,
              backgroundColor: Constants.COLOR.CASH_ON_HAND,
              paddingHorizontal: 5,
              borderRadius: 5,
              paddingVertical: 2,
            }}>
            {this.props.bookingDetailData.Booking_Status_Desc}
          </Text>
        </View>
      );
    }
  };

  _renderQRCodeInfoView = () => {
    return (
      <View>
        {this.props.bookingDetailData.QRCode_Data !== undefined &&
          this.props.bookingDetailData.QRCode_Data !== '' ? (
          <View style={styles.qrCodeView}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <QRCode
                value={this.props.bookingDetailData.QRCode_Data}
                size={100}
                color="black"
                backgroundColor="white"
              />
              <View style={{ marginTop: 8 }}>
                <Text style={styles.qrNotedLabel}>
                  Please take a screenshot of this QR code
                </Text>
                <Text style={styles.qrNotedLabel}>
                  This can be used for Walkin Bookings
                </Text>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    );
  };
  _renderPhlebotomistRatingsView = () => {
    let postRatingData = {
      UserName: this.state.UserName,
      Booking_Type: this.state.Booking_Type,
      Firm_No: this.state.Firm_No,
      Booking_Date: this.state.Booking_Date,
      Booking_No: this.state.Booking_No,
      Rating_Type: 'P',
      Rating_No: '',
    };
    if (
      this.props.bookingDetailData.Booking_Type_Code !== undefined &&
      this.props.bookingDetailData.Booking_Type_Code !== 'W'
    ) {
      return (
        <View style={styles.ratingPhlebotomist}>
          <RatingsView
            isProfileImage={
              this.props.bookingDetailData.Collector_Profile_Picture_Url
            }
            isFromRating={true}
            phlebRatingValue={this.props.bookingDetailData.Ratings_Phlebotomist}
            serviceRatingValue={this.props.bookingDetailData.Ratings_Service}
            ratingString={this.props.bookingDetailData.Rating_Detail}
            selectedDataPosition={0}
            postData={postRatingData}
            collectorName={this.props.bookingDetailData.Collector_Name}
            aboutCollector={this.props.bookingDetailData.About_Collector}
            phoneNumber={this.props.bookingDetailData.Collector_Mobile_No}
          />
        </View>
      );
    }
  };

  _renderServiceRatingsView = () => {
    let postRatingData = {
      UserName: this.state.UserName,
      Booking_Type: this.state.Booking_Type,
      Firm_No: this.state.Firm_No,
      Booking_Date: this.state.Booking_Date,
      Booking_No: this.state.Booking_No,
      Rating_Type: 'S',
      Rating_No: '',
    };
    let postRatingCodeData = {
      UserName: this.state.UserName,
      Booking_Type: this.state.Booking_Type,
      Firm_No: this.state.Firm_No,
      Booking_Date: this.state.Booking_Date,
      Booking_No: this.state.Booking_No,
      Rating_Code: '',
    };
    let isAlreadyRatingCodeSelected = false;
    if (this.props.bookingDetailData.Rating_Detail !== undefined && null) {
      for (
        let i = 0;
        i < this.props.bookingDetailData.Rating_Detail.length;
        i++
      ) {
        if (this.props.bookingDetailData.Rating_Detail[i].IsSelected) {
          isAlreadyRatingCodeSelected = true;
        }
      }
      return (
        <View style={styles.ratingService}>
          <RatingServiceView
            isServiceRating={true}
            isFromRating={true}
            isFromRatingCode={true}
            phlebRatingValue={this.props.bookingDetailData.Ratings_Phlebotomist}
            serviceRatingValue={this.props.bookingDetailData.Ratings_Service}
            ratingString={this.props.bookingDetailData.Rating_Detail}
            isAlreadyRatingCodeSelected={isAlreadyRatingCodeSelected}
            postData={postRatingData}
            postRatingCode={postRatingCodeData}
          />
        </View>
      );
    }
  };
  _renderPostReviewsView = () => {
    if (
      this.props.bookingDetailData.Post_Review !== undefined &&
      this.props.bookingDetailData.Post_Review.length > 0
    ) {
      return (
        <View style={{ padding: 10 }}>
          <Text style={{ marginTop: 10, fontSize: Constants.FONT_SIZE.L }}>
            Feedback:
          </Text>
          <Text
            style={{
              marginTop: 5,
              marginBottom: 30,
              fontSize: Constants.FONT_SIZE.SM,
            }}>
            {this.props.bookingDetailData.Post_Review}
          </Text>
        </View>
      );
    } else {
      let postReviewData = {
        UserName: this.state.UserName,
        Booking_Type: this.state.Booking_Type,
        Firm_No: this.state.Firm_No,
        Booking_Date: this.state.Booking_Date,
        Booking_No: this.state.Booking_No,
        Post_Review: '',
      };
      return (
        <View style={styles.postReviewsView}>
          <PostReviews postData={postReviewData} />
        </View>
      );
    }
  };

  _renderNavigationView = () => {
    return (
      <View style={styles.navigationView}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Actions.pop();
          }}>
          <ButtonBack />
        </TouchableOpacity>
      </View>
    );
  };
}

const mapStateToProps = (state, props) => {
  const {
    bookingDetailState: {
      isBookingDetailLoading,
      bookingDetailData,
      isDownloadPDFLoading,
      isDownloadPDFInvoiceLoading,
    },
    configState: { currency, firmName, firmNo, paymentUrl },
  } = state;

  return {
    isBookingDetailLoading,
    isDownloadPDFLoading,
    isDownloadPDFInvoiceLoading,
    bookingDetailData,
    currency,
    paymentUrl,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      invokeBookingList,
      downloadReport,
      setClearLoading,
      downloadInvoice,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BookingDetailsScreen);

const styles = StyleSheet.create({
  noDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataTv: {
    textAlign: 'center',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    flexDirection: 'column',
    backgroundColor: Constants.COLOR.WHITE_COLOR,
  },
  bookingIdView: { flexDirection: 'row' },
  bookingIdLeftView: { alignSelf: 'center', flex: 3 },
  bookingIdRightView: {
    alignSelf: 'center',
  },
  bookingIdText: {
    fontWeight: 'bold',
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontSize: Constants.FONT_SIZE.M,
  },
  bookingIdTime: {
    marginTop: 5,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontSize: Constants.FONT_SIZE.SM,
  },
  bookingIdReportImage: {
    width: deviceHeight / 15,
    height: deviceHeight / 15,
    alignSelf: 'flex-end',
  },
  bookingIdReportLink: {
    marginTop: 5,
    color: Constants.COLOR.FONT_LINK_COLOR,
    alignSelf: 'flex-end',
    fontSize: Constants.FONT_SIZE.S,
    textAlign: 'center',
  },
  nameAddressView: { flexDirection: 'row', marginTop: 20 },
  nameAddressLeftView: {
    flex: 1,
    justifyContent: 'center',
  },
  nameAddressRightView: { flex: 3, marginStart: 10 },
  profileImageView: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    backgroundColor: '#F2F2F2',
    borderColor: '#4F4F4F',
    borderWidth: 2,
    overflow: 'hidden',
  },
  profileImageText: {
    alignItems: 'center',
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
    color: 'black',
    fontSize: Constants.FONT_SIZE.XXL,
  },
  nameAddressRightNameText: {
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontSize: Constants.FONT_SIZE.SM,
  },
  nameAddressRightAgePhoneView: { flexDirection: 'row', marginTop: 10 },
  nameAddressRightAgeImage: {
    width: deviceHeight / 40,
    height: deviceHeight / 40,
    alignSelf: 'center',
  },
  nameAddressRightAgeText: {
    marginLeft: 5,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontSize: Constants.FONT_SIZE.SM,
  },
  nameAddressRightMobileImage: {
    marginLeft: 10,
    width: deviceHeight / 40,
    height: deviceHeight / 40,
    alignSelf: 'center',
  },
  nameAddressRightMobileText: {
    marginLeft: 5,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontSize: Constants.FONT_SIZE.SM,
  },
  nameAddressRightAddressView: { flexDirection: 'row', marginTop: 10 },
  nameAddressRightAddressImage: {
    width: deviceHeight / 40,
    height: deviceHeight / 40,
  },
  nameAddressRightAddressText: {
    marginLeft: 5,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    fontSize: Constants.FONT_SIZE.SM,
  },
  ratingPhlebotomist: { marginTop: 30 },
  ratingService: { marginTop: 10 },
  postReviewsView: { marginTop: 20 },
  navigationView: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 10,
  },
  backButton: { justifyContent: 'flex-start' },

  contactMainView: {
    flex: 1,
    marginTop: 15,
    flexDirection: 'row',
    backgroundColor: '#DDDBDB',
    borderRadius: 7,
    alignItems: 'center',
    paddingVertical: 7,
  },
  contactImageView: { flex: 1 },
  contactImage: {
    height: deviceHeight / 20,
    width: deviceHeight / 20,
    borderRadius: deviceHeight / 20,
    alignSelf: 'center',
  },
  contactName: {
    flex: 3,
    fontSize: Constants.FONT_SIZE.SM,
    color: Constants.COLOR.FONT_COLOR,
  },

  contactArrowView: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  contactArrow: {
    marginRight: 10,
    textAlign: 'right',
    height: deviceHeight / 30,
    width: deviceHeight / 30,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  contactMobileView: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    borderBottomEndRadius: 7,
    alignItems: 'center',
    paddingVertical: 10,
  },
  contactMobileImageView: { flex: 1 },
  contactMobileImage: {
    height: deviceHeight / 30,
    width: deviceHeight / 30,
    alignSelf: 'center',
  },
  contactMobileText: {
    flex: 4,
    alignSelf: 'center',
    fontSize: Constants.FONT_SIZE.SM,
    color: Constants.COLOR.FONT_COLOR,
  },
  qrCodeView: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  qrNotedLabel: {
    fontSize: Constants.FONT_SIZE.SM,
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});




/*************************************************
 * SukraasLIS
 * @exports
 * @class OfferScreen.js
 * @extends Component
 * Created by Sankar on 12/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/
'use strict';
import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import LoadingScreen from '../common/LoadingScreen';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {
  getOfferDetails,
  hideOfferPageLoading,
  bookNowCart,
  getTestList,
} from '../../actions/DashboardAction';
import {addItemToCart, checkDuplicateTest} from '../../actions/LabTestAction';
import RenderHtml from 'react-native-render-html';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class OfferScreen extends Component {
 //  static propTypes = {
  //   offerPageLoading: PropTypes.bool,
  //   offerTestLoading: PropTypes.bool,
  //   isNetworkConnectivityAvailable: PropTypes.bool,
  //   offerDetailsArray: PropTypes.array,
  //   cartArray: PropTypes.array,

  //   getOfferDetails: PropTypes.func,
  //   hideOfferPageLoading: PropTypes.func,
  //   addItemToCart: PropTypes.func,
  //   checkDuplicateTest: PropTypes.func,
  //   bookNowCart: PropTypes.func,
  //   getTestList: PropTypes.func,

  //   currency: PropTypes.string,
  //   firmName: PropTypes.string,
  //   firmNo: PropTypes.string,
  // };

  constructor(props) {
    super(props);
    this.state = {
      activeSections: [],
      isFromLabs: this.props.isFromLabs,
      offerDetailsArrayState: [],
      isRender: false,
      branchName: '',
    };
  }

  componentDidMount() {
    let dicOfferDetails = {
      Firm_No: '',
      UserName: '9849390103',
    };
    this.props.getOfferDetails(dicOfferDetails, callback => {
      if (callback) {
        this.setState({offerDetailsArrayState: this.props.offerDetailsArray});
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  render() {
    return (
      <View style={styles.mainContainer}>{this._renderPageLoading()}</View>
    );
  }

  _renderPageLoading = () => {
    const {offerPageLoading, offerTestLoading} = this.props;
    if (offerPageLoading) {
      return (
        <View style={styles.loadingView}>
          <LoadingScreen
            isLoading={offerPageLoading}
            message={'No Record found'}
            onReloadPress={() => {
              // same api call which is in componentdidmount
            }}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.bodyView}>
          {this.state.isFromLabs !== true ? (
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-end',
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
              <Text style={{alignSelf: 'flex-end'}}>{this.props.firmName}</Text>
            </View>
          ) : null}
          <Text
            style={
              this.state.isFromLabs === true
                ? styles.headingTextFromLabs
                : styles.headingText
            }>
            {this.state.isFromLabs === true ? (
              <Text>Choose Package</Text>
            ) : (
              <Text>Package Offer</Text>
            )}
          </Text>

          <ScrollView
            style={{marginBottom: 50, flex: 0}}
            showsVerticalScrollIndicator={false}>
            <Accordion
              underlayColor={'#FFFFFF'}
              sections={this.props.offerDetailsArray}
              disabled={this.props.offerTestLoading}
              activeSections={this.state.activeSections}
              renderSectionTitle={this._renderSectionTitle}
              renderHeader={this._renderHeader}
              renderContent={this._renderContent}
              onChange={this._updateSections}
            />
          </ScrollView>
        </View>
      );
    }
  };

  _renderHeader = (section, index, isActive, sections) => {
    return (
      <View style={styles.headerView}>
        {section.Suppress_Discount ? (
          <Text style={styles.notes}>{'*'} </Text>
        ) : (
          <Text style={styles.notes}> </Text>
        )}
        <Text style={styles.headerLeftText}>{section.Service_Name}</Text>

        <View style={styles.rightView}>
          <View style={styles.headerRightText}>
            <RenderHtml
              baseFontStyle={styles.headerRightText}
              source={{html:this.props.currency + ' ' + section.Amount}}
            />
          </View>
          {this._renderHeaderIcon(isActive)}
        </View>
      </View>
    );
  };

  _renderHeaderIcon = isActive => {
    if (isActive) {
      return (
        <Image
          style={styles.headerRightImage}
          resizeMode="contain"
          source={require('../../images/arrowUp.png')}
        />
      );
    } else {
      return (
        <Image
          style={styles.headerRightImage}
          resizeMode="contain"
          source={require('../../images/arrowDown.png')}
        />
      );
    }
  };

  _renderDescription = (item, index) => {
    return <Text style={styles.contentText}>{item.item.Test_Name}</Text>;
  };

  _renderContent = (section, index, isActive, sections) => {
    const {addItemToCart} = this.props;

    if (isActive) {
      if (section.Service_Detail.length === 0) {
        if (this.props.isNetworkConnectivityAvailable) {
          this.props.getTestList(
            section.Service_Code,
            index,
            this.props.offerDetailsArray,
          );
        } else {
          Utility.showAlert(
            Constants.ALERT.TITLE.ERROR,
            Constants.VALIDATION_MSG.NO_INTERNET,
          );
        }
      }

      if (section.Service_Detail.length === 0) {
        return (
          <View style={{height: 100}}>
            <LoadingScreen />
          </View>
        );
      } else {
        return (
          <View style={styles.contentView}>
            <View style={{backgroundColor: 'white'}}>
              <TouchableOpacity
                style={{
                  marginTop: 20,
                  marginBottom: 5,
                  alignSelf: 'flex-start',
                }}
                onPress={() => {
                  this.state.isFromLabs === true
                    ? this._buttonClickCart(section)
                    : this._buttonClickBuyNow(section);
                }}>
                <Text style={styles.button}>{this._buttonName(section)}</Text>
              </TouchableOpacity>
            </View>
            <View>
              <FlatList
                initialNumToRender={section.Service_Detail.length}
                style={{
                  marginTop: 20,
                  marginBottom: 5,
                  flex: 0,
                }}
                extraData={section.Service_Detail}
                data={section.Service_Detail}
                renderItem={this._renderDescription}
                keyExtractor={item => item.id}
              />
            </View>
          </View>
        );
      }
    }
  };

  _buttonClickCart = section => {
    if (this.props.cartArray.length === 0) {
      // when cart is empty no need to check duplicate, just add to cart
      this.props.addItemToCart(section, 'add');
    } else {
      if (section.isInCart) {
        // isInCart = true ; remove from cart, package is already in cart
        this.props.addItemToCart(section, 'add');
      } else {
        // for adding another package - check duplicate
        this.props.checkDuplicateTest(
          section,
          this.props.cartArray,
          callBack => {
            if (callBack) {
              this.props.addItemToCart(section, 'add');
            }
          },
        );
      }
    }
    // if (section['isInCart'] === true) {
    //   section['isInCart'] = false;
    // } else {
    //   section['isInCart'] = true;
    // }
    this.setState({
      offerDetailsArrayState: this.state.offerDetailsArrayState,
    });
    Actions.LabTestSummary();
  };

  _buttonClickBuyNow = section => {
    this.props.bookNowCart(section, 'add');
    Actions.LabTestSummary({isFromLabs: false});
  };

  _buttonName = section => {
    return this.state.isFromLabs === true ? (
      section.isInCart === true ? (
        <Text>Remove from Cart</Text>
      ) : (
        <Text>Add to Cart</Text>
      )
    ) : (
      <Text>Book Package</Text>
    );
  };

  _updateSections = activeSections => {
    this.setState({activeSections});
  };
}

const mapStateToProps = (state, props) => {
  //props can be called as ownProps
  const {
    dashboardState: {offerPageLoading, offerDetailsArray, offerTestLoading},
    configState: {currency, firmName, firmNo},
    labTestState: {cartArray},
    deviceState: {isNetworkConnectivityAvailable},
  } = state;
  return {
    offerPageLoading,
    offerDetailsArray,
    currency,
    firmName,
    firmNo,
    offerTestLoading,
    cartArray,
    isNetworkConnectivityAvailable,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getOfferDetails,
      hideOfferPageLoading,
      addItemToCart,
      checkDuplicateTest,
      bookNowCart,
      getTestList,
    },
    // {getOfferDetails, hideOfferPageLoading, addItemToCart, bookNowCart},
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OfferScreen);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  loadingView: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  bodyView: {marginBottom: 0, flex: 0},
  headingText: {
    marginTop: 10,
    marginBottom: 10,
    marginStart: 10,
    color: '#808080',
    fontSize: Constants.FONT_SIZE.XL,
  },
  headingTextFromLabs: {
    color: Constants.COLOR.BLACK_COLOR,
    fontSize: Constants.FONT_SIZE.L,
  },
  headerView: {
    marginTop: 20,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderColor: '#F0F0F0',
    borderWidth: 1,
    padding: 15,
  },
  headerLeftText: {
    flex: 4,
    color: '#868686',
    alignItems: 'flex-start',
    fontSize: Constants.FONT_SIZE.SM,
  },
  rightView: {
    flex: 2,
    marginLeft: 20,
    marginRight: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  headerRightText: {
    color: '#3478C1',
    fontSize: Constants.FONT_SIZE.SM,
    alignSelf: 'center',
  },
  headerRightImage: {
    alignSelf: 'center',
    marginLeft: 10,
    width: deviceHeight / 45,
    height: deviceHeight / 45,
  },
  contentView: {
    flexDirection: 'column',
    overflow: 'hidden',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderColor: '#F0F0F0',
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  contentText: {
    color: '#9E9E9F',
    paddingTop: 10,
    fontSize: Constants.FONT_SIZE.SM,
  },
  wrapperCollapsibleList: {
    flex: 1,
    marginTop: 20,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    borderRadius: 5,
  },
  collapsibleItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#CCC',
    padding: 10,
  },
  button: {
    borderWidth: 1,
    textAlign: 'center',
    fontSize: Constants.FONT_SIZE.L,
    color: '#FFFFFF',
    fontWeight: 'normal',
    backgroundColor: '#0F73CA',
    borderColor: '#0F73CA',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 10,
    paddingBottom: 10,
    width: Platform.OS === 'ios' ? deviceHeight * 0.28 : deviceHeight * 0.25,
    borderRadius: 5,
    borderBottomWidth: 0,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  notes: {
    color: 'red',
    textAlign: 'center',
    alignSelf: 'center',
    paddingBottom: 4,
    fontSize: Constants.FONT_SIZE.S,
  },
});

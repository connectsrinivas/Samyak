/*************************************************
 * SukraasLIS
 * @exports
 * @class LabTestSummary.js
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
  FlatList,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { Actions } from 'react-native-router-flux';
// import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LoadingScreen from '../common/LoadingScreen';
import SearchListCell from './listCells/SearchListCell';
// import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheet from 'react-native-raw-bottom-sheet'; 
// import HTML from 'react-native-render-html';
import RenderHtml from 'react-native-render-html';

import {
  searchLabTest,
  clearLabTestSearch,
  setLabTestSearchToInitial,
} from '../../actions/LabTestAction';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

let timerId;

class LabTestSearch extends Component {
  //  static propTypes = {
  //   searchResponseArray: PropTypes.array,
  //   isSearchLoading: PropTypes.bool,
  //   cartCount: PropTypes.number,
  //   cartArray: PropTypes.array,
  //   totalCartAmount: PropTypes.number,

  //   searchLabTest: PropTypes.func,
  //   clearLabTestSearch: PropTypes.func,
  //   setLabTestSearchToInitial: PropTypes.func,
  //   currency: PropTypes.string,
  //   firmName: PropTypes.string,
  //   firmNo: PropTypes.string,
  // };

  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      closeSearchBtnClicked: false,
    };
  }

  componentWillUnmount() {
    this.props.clearLabTestSearch();
  }

  _renderCartItem = ({ item, index }) => (
    <SearchListCell
      id={item.id}
      key={index}
      item={item}
      currency={this.props.currency}
    />
  );

  _nextClick = () => {
    Actions.LabTestSummary({ isFromLabs: true });
  };

  _renderTransparentLoading = () => {
    const { isSearchLoading, searchResponseArray } = this.props;
    if (isSearchLoading) {
      return (
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}>
          <LoadingScreen
            isLoading={isSearchLoading}
            message={'No Record found'}
            onReloadPress={() => {
              this.props.searchLabTest('', 'T', '', 0, 10, '', '');
            }}
          />
        </View>
      );
    } else {
      return (
        <KeyboardAwareScrollView>
          {this.props.searchResponseArray.length > 0 ? (
            <View style={{ marginBottom: 10 }}>
              <FlatList
                data={searchResponseArray}
                renderItem={this._renderSearchRow}
                keyExtractor={this._keyExtractor}
              />

              <View style={styles.totalText}>
                <RenderHtml
                  baseFontStyle={styles.totalText}
                  source={{
                    html:
                      'Total Cart Value ' +
                      this.props.currency +
                      ' ' +
                      this.props.totalCartAmount
                  }}
                />
              </View>

              <TouchableOpacity
                onPress={() => {
                  // this._nextClick();
                  if (this.props.cartArray.length > 0) {
                    Actions.pop();
                    setTimeout(() => {
                      Actions.LabTestSummary({ isFromLabs: true });
                    }, 1000);
                  } else {
                    Alert.alert(
                      Constants.ALERT.TITLE.INFO,
                      'Please Select Test',
                      [
                        {
                          text: Constants.ALERT.BTN.OK,
                          onPress: () => {
                            // Actions.pop();
                          },
                        },
                      ],
                      { cancelable: false },
                    );
                  }
                }}>
                <View style={styles.buttonBackground}>
                  <Text style={styles.buttonTitle}> PROCEED </Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.notes}>
                Note : * - Indicates Non Discounted Test
              </Text>
            </View>
          ) : (
            <View style={styles.noDataView}>
              <Text style={styles.noDataText}>
                {/* {this.state.searchValue.length <= 3  ? '' : ' No Search Results Found'} */}
              </Text>
            </View>
          )}
        </KeyboardAwareScrollView>
      );
    }
  };

  render() {
    return this._renderSearchView();
  }

  _renderSearchRow = ({ item, index }) => (
    <SearchListCell
      id={item.id}
      key={index}
      item={item}
      currency={this.props.currency}
    />
  );

  _keyExtractor = data => {
    return data.type;
  };
  _renderSheetContent() {
    return (
      <KeyboardAwareScrollView>
        {this.props.cartArray.length > 0 ? (
          <View style={{ marginBottom: 20, marginHorizontal: 5 }}>
            <FlatList
              data={this.props.cartArray}
              renderItem={this._renderCartItem}
              keyExtractor={this._keyExtractor}
            />

            <View style={styles.totalText}>
              <RenderHtml
                baseFontStyle={styles.totalText}
                source={{html:
                  'Total Cart Value ' +
                  this.props.currency +
                  ' ' +
                  this.props.totalCartAmount
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                Actions.pop();
                setTimeout(() => {
                  Actions.LabTestSummary({ isFromLabs: true });
                }, 500);
              }}>
              <View style={styles.buttonBackground}>
                <Text style={styles.buttonTitle}> PROCEED </Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.notes}>
              Note : * - Indicates Non Discounted Test
            </Text>
          </View>
        ) : (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}>
            <Text
              style={{
                fontSize: Constants.FONT_SIZE.L,
                color: Constants.COLOR.BLACK_COLOR,
              }}>
              Cart is Empty
            </Text>
          </View>
        )}
      </KeyboardAwareScrollView>
    );
  }
  _renderSearchView = () => {
    const { cartArray } = this.props;
    return (
      <View style={styles.mainContainer}>
        <View style={styles.searchHeaderView}>
          <Text style={styles.searchHeaderTitleView}>Search Test</Text>
          <TouchableOpacity
            disabled={this.state.closeSearchBtnClicked}
            style={styles.closeImageView}
            onPress={() => {
              this._closeClick();
              this.setState({
                closeSearchBtnClicked: true,
              });
              setTimeout(() => {
                this.setState({
                  closeSearchBtnClicked: false,
                });
              }, 1000);
            }}>
            <Image
              style={styles.closeImageStyle}
              source={require('../../images/black_cross.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Image
            style={styles.searchImageStyle}
            source={require('../../images/search.png')}
            resizeMode="contain"
          />
          <TextInput
            style={styles.input}
            placeholder="Search"
            autoCapitalize={false}
            value={this.state.searchValue}
            returnKeyType={'done'}
            underlineColorAndroid="transparent"
            autoFocus={true}
            onChangeText={searchValue => {
              this.setState({ searchValue });

              if (timerId) {
                clearTimeout(timerId);
                timerId = undefined;
              }

              timerId = setTimeout(() => {
                timerId = undefined;

                searchValue.length > 1
                  ? this.props.searchLabTest(
                    '',
                    'T',
                    searchValue,
                    0,
                    10,
                    '',
                    '',
                  )
                  : this.props.clearLabTestSearch();
              }, 1000);
            }}
            onSubmitEditing={() => {
              // this._validateInputs();
            }}
          />
          <TouchableOpacity
            onPress={() => {
              cartArray.length > 0
                ? this.RBSheet.open()
                : alert('Cart is empty');
            }}
            style={{
              flexDirection: 'row',
              marginHorizontal: 10,
            }}>
            <Image
              style={styles.cartImageStyle}
              source={require('../../images/addCart.png')}
              resizeMode="contain"
            />
            {this.props.cartArray.length > 0 ? (
              <View
                style={
                  this.props.cartArray.length >= 10
                    ? [styles.cartCircle]
                    : styles.cartCircle
                }>
                <Text
                  style={{
                    padding: 1,
                    alignSelf: 'center',
                    fontSize: Constants.FONT_SIZE.S,
                  }}>
                  {this.props.cartArray.length}
                </Text>
              </View>
            ) : (
              <View style={styles.cartCircleEmpty} />
            )}
          </TouchableOpacity>
        </View>
        {this._renderTransparentLoading()}
        <BottomSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={deviceHeight * (3 / 5)}
          duration={250}
          animationType={'fade'}
          // closeOnDragDown={true}
          customStyles={{
            container: {
              // justifyContent: 'center',
              // alignItems: 'center',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: '#EBF0F1',
            },
          }}>
          {this._renderSheetContent()}
        </BottomSheet>
      </View>
    );
  };
  _validateInputs = () => {
    // Call Search List Web service
  };

  _closeClick = () => {
    Actions.pop();
  };
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Constants.COLOR.LAB_SEARCH_SCREEN_BG,
  },
  searchHeaderView: {
    flexDirection: 'row',
    padding: 5,
    marginTop: 10,
    marginRight: 5,
    marginLeft: 5,
    marginBottom: 10,
  },
  searchHeaderTitleView: {
    flex: 1,
    alignSelf: 'center',
    fontSize: Constants.FONT_SIZE.L,
  },
  closeImageView: {
    justifyContent: 'center',
  },
  closeImageStyle: {
    padding: 10,
    width: deviceHeight / 35,
    height: deviceHeight / 35,
  },
  searchContainer: {
    flexDirection: 'row',
    marginVertical: 16,
    backgroundColor: Constants.COLOR.SEARCH_BG,
    shadowColor: Constants.COLOR.LAB_SEARCH_SCREEN_BG,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    elevation: 6,
  },
  searchImageStyle: {
    marginVertical: 16,
    width: deviceHeight / 35,
    height: deviceHeight / 35,
    alignSelf: 'center',
    marginLeft: 8,
  },
  cartImageStyle: {
    marginLeft: 10,
    marginRight: 15,
    marginTop: 4,
    width: deviceHeight / 35,
    height: deviceHeight / 35,
    alignSelf: 'center',
  },
  input: {
    marginHorizontal: 4,
    flex: 1,
    alignSelf: 'center',
    fontSize: Constants.FONT_SIZE.M,
    padding: 6,
  },
  cartCircleEmpty: {
    marginTop: 10,
    bottom: 20,
    right: 0,
    left: 22,
    marginLeft: 2,
    overflow: 'hidden',
    borderWidth: 3,
    textAlign: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartCircle: {
    marginTop: 10,
    position: 'absolute',
    bottom: 20,
    right: 0,
    left: 22,
    marginLeft: 2,
    width: 26,
    height: 26,
    borderRadius: 26 / 2,
    backgroundColor: '#F6F3F3',
    borderColor: '#F6F3F3',
    overflow: 'hidden',
    borderWidth: 3,
    textAlign: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalText: {
    fontSize: Constants.FONT_SIZE.L,
    color: Constants.COLOR.BLACK_COLOR,
    alignSelf: 'center',
    marginTop: 16,
  },
  buttonBackground: {
    borderRadius: 20,
    width: deviceWidth / 1.2,
    backgroundColor: Constants.COLOR.LAB_SEARCH_BUTTON_BG,
    marginTop: 16,
    alignSelf: 'center',
  },
  buttonTitle: {
    fontSize: Constants.FONT_SIZE.M,
    color: Constants.COLOR.WHITE_COLOR,
    padding: 12,
    alignSelf: 'center',
  },
  noDataView: {
    alignItems: 'center',
    justifyContent: 'center',
    height: deviceHeight - 200,
  },
  noDataText: {
    fontSize: Constants.FONT_SIZE.M,
    fontWeight: 'bold',
  },
  notes: {
    color: 'red',
    textAlign: 'center',
    alignSelf: 'flex-start',
    fontSize: Constants.FONT_SIZE.S,
    marginTop: 10,
    marginLeft: 30,
  },
});

const mapStateToProps = (state, props) => {
  //props can be called as ownProps
  const {
    labTestState: {
      searchResponseArray,
      isSearchLoading,
      cartCount,
      cartArray,
      totalCartAmount,
    },
    configState: { currency, firmName, firmNo },
  } = state;

  return {
    searchResponseArray,
    isSearchLoading,
    cartCount,
    cartArray,
    totalCartAmount,
    currency,
    firmName,
    firmNo,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      searchLabTest,
      clearLabTestSearch,
      setLabTestSearchToInitial,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LabTestSearch);

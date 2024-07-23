/* eslint-disable react-native/no-inline-styles */
/*************************************************
 * Sukraas-Lis
 * @exports
 * @class SearchListCell.js
 * @extends Component
 * Created by Abdul Rahman on 11/06/2020
 * Copyright © 2020 Sukraas-Lis. All rights reserved.
 *************************************************/

'use strict';

import React, {PureComponent, Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Text,
  Platform,
} from 'react-native';

// import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Constants from '../../../util/Constants';
import Utility from '../../../util/Utility';
import {
  addItemToCart,
  checkDuplicateTest,
} from '../../../actions/LabTestAction';
import _ from 'lodash';
import {ReloadInstructions} from 'react-native/Libraries/NewAppScreen';
// import HTML from 'react-native-render-html';
import RenderHtml from 'react-native-render-html';

import {
  emptySampleCollectionArray,
  setCartAmount,
} from '../../../actions/LabTestSummaryAction';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class SearchListCell extends Component {
 //  static propTypes = {
  //   item: PropTypes.object,
  //   index: PropTypes.number,
  //   cartArray: PropTypes.array,

  //   addItemToCart: PropTypes.func,
  //   checkDuplicateTest: PropTypes.func,
  //   emptySampleCollectionArray: PropTypes.func,
  //   setCartAmount: PropTypes.func,
  // };

  constructor(props) {
    super(props);
    this.state = {};
  }

  _renderButtonName = (cartArray, item) => {
    if (
      item !== undefined &&
      item.hasOwnProperty('isInCart') &&
      item.isInCart === true
    ) {
      return this._renderTickImage(cartArray, item);
    } else {
      return this._renderTickImage(cartArray, item);
    }
  };

  _renderTickImage = (cartArray, item) => {
    if (
      item !== undefined &&
      item.hasOwnProperty('isInCart') &&
      item.isInCart === true
    ) {
      return this._tickImageView();
    } else {
      if (cartArray.length > 0) {
        for (let index = 0; index < cartArray.length; index++) {
          if (cartArray[index].Service_Code === item.Service_Code) {
            return this._tickImageView();
          } else {
            return this._cartImageView();
          }
        }
      } else {
        return this._cartImageView();
      }
    }
  };

  _tickImageView = () => {
    return (
      <View style={{flexDirection: 'row-reverse', marginHorizontal: 4}}>
        <Text style={styles.addText}>Remove </Text>
        <Image
          style={styles.tickImageStyle}
          source={require('../../../images/removeCart.png')}
          resizeMode="contain"
        />
      </View>
    );
  };

  _cartImageView = () => {
    return (
      <View style={{flexDirection: 'row-reverse', marginHorizontal: 4}}>
        <Text style={styles.addText}>Add Cart</Text>
        <Image
          style={styles.tickImageStyle}
          source={require('../../../images/addCart.png')}
          resizeMode="contain"
        />
      </View>
    );
  };

  _renderEmptyView = () => {
    return <View style={{padding: 10}} />;
  };

  render() {
    const {
      item,
      index,
      addItemToCart,
      checkDuplicateTest,
      emptySampleCollectionArray,
      setCartAmount,
      cartArray,
    } = this.props;
    return (
      <View style={styles.rowContainer}>
        <View style={[styles.subRowContainer]}>
          <View style={{flexDirection: 'row', width: '70%'}}>
            {item.Suppress_Discount ? (
              <Text style={styles.notes}>{' *'} </Text>
            ) : (
              <Text style={styles.notes}>{'  '} </Text>
            )}
            <Text style={[styles.rowText, {flex: 1.6}]}>
              {item.Service_Name}{' '}
            </Text>
            <View style={styles.prizeTextView}>
              <RenderHtml
                baseFontStyle={styles.prizeText}
                source={{html:this.props.currency + ' ' + item.Amount}}
              />
            </View>
          </View>
          <TouchableOpacity
            style={[styles.addBackground]}
            onPress={() => {
              if (cartArray.length > 0) {
                if (item.isInCart) {
                  // isInCart = true ; remove from cart, test is already in cart
                  addItemToCart(item, 'add');
                  emptySampleCollectionArray();
                  setCartAmount('');
                } else {
                  // for adding another test - check duplicate
                  checkDuplicateTest(item, cartArray, callBack => {
                    if (callBack) {
                      addItemToCart(item, 'add');
                    }
                  });
                }
              } else {
                // when cart is empty no need to check duplicate, just add to cart
                addItemToCart(item, 'add');
              }
            }}>
            {this._renderButtonName(cartArray, item)}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, props) => {
  //props can be called as ownProps
  const {
    labTestState: {cartArray},
  } = state;

  return {cartArray};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      addItemToCart,
      checkDuplicateTest,
      emptySampleCollectionArray,
      setCartAmount,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchListCell);

// export default SearchListCell;

// define your styles
const styles = StyleSheet.create({
  divider: {
    width: '100%',
    height: 0.3,
    backgroundColor: Constants.COLOR.LAB_SEARCH_TEXT,
  },
  rowContainer: {
    margin: 8,
  },
  subRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  prizeTextView: {
    fontSize: Constants.FONT_SIZE.SM,
    paddingVertical: 8,
    paddingHorizontal: 0,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    flex: 0.7,
  },
  prizeText: {
    fontSize: Constants.FONT_SIZE.SM,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    color: Constants.COLOR.BLACK_COLOR,
    alignSelf: 'flex-end',
    textAlign: 'right',
  },
  rowText: {
    flex: Platform.OS === 'ios' ? 1 : null,
    width: Platform.OS === 'android' ? deviceWidth / 1.9 : null,
    fontSize: Constants.FONT_SIZE.SM,
    paddingVertical: 8,
    color: Constants.COLOR.LAB_SEARCH_TEXT,
    alignSelf: 'center',
  },
  resultText: {
    fontSize: Constants.FONT_SIZE.S,
    paddingVertical: 8,
    color: Constants.COLOR.LAB_SEARCH_TEXT,
    alignSelf: 'center',
  },
  addBackground: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: Constants.COLOR.LAB_SEARCH_TEXT,
    marginVertical: 10,
    borderRadius: 5,
    shadowColor: Constants.COLOR.LAB_SEARCH_SCREEN_BG,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    elevation: 1,
    alignSelf: 'center',
  },
  addText: {
    fontSize: Constants.FONT_SIZE.S,
    paddingVertical: 6,
    color: Constants.COLOR.BLACK_COLOR,
    alignSelf: 'center',
    marginLeft: 4,
  },
  tickImageStyle: {
    width: deviceHeight / 35,
    height: deviceHeight / 35,
    alignSelf: 'center',
  },
  cartImageStyle: {
    width: deviceHeight / 48,
    height: deviceHeight / 48,
    alignSelf: 'center',
  },
  tickImageStyleEmpty: {
    marginLeft: deviceHeight / 35,
    alignSelf: 'center',
  },
  notes: {
    color: 'red',
    textAlign: 'center',
    alignSelf: 'center',
    paddingBottom: 4,
    fontSize: Constants.FONT_SIZE.S,
  },
});

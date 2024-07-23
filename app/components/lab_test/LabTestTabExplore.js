/*************************************************
 * SukraasLIS
 * @exports
 * @class PopularRow.js
 * @extends Component
 * Created by Shiva Sankar on 12/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, {Component} from 'react';

import {Text, View, StyleSheet, Dimensions, FlatList} from 'react-native';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const DATA = [
  {
    id: '1',
    title: 'First Item',
  },
  {
    id: '2',
    title: 'Second Item',
  },
  {
    id: '3',
    title: 'Third Item',
  },
];

function Item({title}) {
  return (
    <View style={styles.mainBorder}>
      <View style={styles.subBorder}>
        <View style={styles.topView}>
          <Text style={styles.topText}> Preventive </Text>
          <Text style={styles.topText}> Health Check Up</Text>
        </View>

        <View style={styles.bottomView}>
          <Text style={styles.actualPrize}> $2000</Text>
          <Text style={styles.offerPrize}> $1000</Text>
          <Text style={styles.discount}> 50% Discount</Text>
        </View>
      </View>
    </View>
  );
}

class LabTestTabExplore extends Component {
  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.headerView}>
          <Text style={styles.headerTitleTv}>Popular Now</Text>
          <Text style={styles.headerLinkTv}>Show Result </Text>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={DATA}
          renderItem={({item}) => <Item title={item.title} />}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#FBFBFB'},
  headerView: {
    flexDirection: 'row',
    flex: 1,
    paddingVertical: 5,
    marginBottom: 10,
  },
  headerTitleTv: {
    flex: 1,
    color: 'black',
    fontSize: Constants.FONT_SIZE.M,
    padding: 5,
  },
  headerLinkTv: {
    flex: 1,
    padding: 5,
    textAlign: 'right',
    color: '#EBAB4D',
    fontSize: Constants.FONT_SIZE.SM,
  },
  mainBorder: {
    width: deviceWidth / 2.2,
    backgroundColor: Constants.COLOR.LAB_POPULAR_BG,
    margin: 5,
    height: deviceHeight / 3.8,
  },
  subBorder: {
    marginVertical: 14,
    alignSelf: 'center',
    height: deviceHeight / 4.6,
  },
  topView: {
    backgroundColor: Constants.COLOR.LAB_POPULAR_TOP,
    flex: 1,
    justifyContent: 'center',
  },
  bottomView: {
    backgroundColor: 'white',
    flex: 1.5,
    justifyContent: 'space-around',
  },
  topText: {
    fontSize: Constants.FONT_SIZE.SM,
    color: 'white',
    paddingHorizontal: 8,
  },
  actualPrize: {
    fontSize: Constants.FONT_SIZE.S,
    color: Constants.COLOR.LAB_POPULAR_PRIZE,
    alignSelf: 'center',
    padding: 8,
  },
  offerPrize: {
    fontSize: Constants.FONT_SIZE.SM,
    color: Constants.COLOR.LAB_POPULAR_PRIZE,
    alignSelf: 'center',
    padding: 8,
  },
  discount: {
    fontSize: Constants.FONT_SIZE.S,
    color: Constants.COLOR.LAB_POPULAR_DISCOUNT,
    alignSelf: 'center',
    padding: 8,
  },
});

export default LabTestTabExplore;

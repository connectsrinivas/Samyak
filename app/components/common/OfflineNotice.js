/* eslint-disable react-native/no-inline-styles */
/*************************************************
 * SukraasLIS
 * OfflineNotice.js
 * Created by Abdul Rahman on 29/06/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';

import React, {PureComponent} from 'react';
import {View, Text, NetInfo, Dimensions, StyleSheet} from 'react-native';
const {width} = Dimensions.get('window');

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
// import PropTypes from 'prop-types';

function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>No Internet Connection</Text>
    </View>
  );
}
class OfflineNotice extends PureComponent {
  render() {
    if (
      this.props.isNetworkConnectivityAvailable !== undefined &&
      !this.props.isNetworkConnectivityAvailable
    ) {
      return (
        // <View
        //   style={{
        //     backgroundColor: 'red',
        //     alignItems: 'center',
        //     justifyContent: 'center',
        //     padding: 7,
        //   }}>
        //   <Text style={{color: 'white', fontSize: 12}}>
        //     No Internet Connection
        //   </Text>
        // </View>
        <MiniOfflineSign />
      );
    } else {
      return null;
    }
  }
}
const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    position: 'absolute',
    top: 50,
  },
  offlineText: {
    color: '#fff',
  },
});

const mapStateToProps = (state, ownProps) => {
  const {
    deviceState: {isNetworkConnectivityAvailable},
  } = state;

  return {
    isNetworkConnectivityAvailable,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OfflineNotice);

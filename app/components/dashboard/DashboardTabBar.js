// import React, { Component } from 'react';
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   Text,
//   Image,
//   Dimensions,
// } from 'react-native';
// import PropTypes from 'prop-types';
// import { Actions } from 'react-native-router-flux';
// import Constants from '../../util/Constants';
// import Utility from '../../util/Utility';
// import { getNotificationCount } from '../../actions/NotificationActions';
// import {
//   getPromotionDetails,
//   getOfferDetails,
// } from '../../actions/DashboardAction';
// import { getTipsDetails } from '../../actions/TipsAction';

// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
// import store from '../../store';

// const deviceHeight = Utility.isiPhoneX()
//   ? Constants.SCREEN_SIZE.PLUS_SIZE
//   : Dimensions.get('window').height;

// class DashboardTabBar extends Component {
//   static propTypes = {
//     getNotificationCount: PropTypes.func,
//     mobileNo: PropTypes.string,
//   };
//   constructor(props) {
//     super(props);
//   }

//   componentDidMount() {
//     if (store.getState().deviceState.isNetworkConnectivityAvailable) {
//       this.willFocusSubscription = this.props.navigation.addListener(
//         'willFocus',
//         () => {
//           this.props.getOfferDetails();
//         },
//       );
//     } else {
//       this.internetAlert(Constants.VALIDATION_MSG.NO_INTERNET);
//     }
//     this.getNotificationCountAPI();

//     if (this.timer === undefined) {
//       this.timer = setInterval(() => this.getNotificationCountAPI(), 1000 * 30);
//     } else {
//       clearInterval(this.timer);
//     }
//   }

//   async getNotificationCountAPI() {
//     this.props.getNotificationCount(this.props.mobileNo);
//   }

//   componentWillUnmount() {
//     clearInterval(this.timer);
//   }

//   render() {
//     const { state } = this.props.navigation;
//     const activeTabIndex = state.index;
//     return (
//       <View style={styles.mainContainer}>
//         <TouchableOpacity
//           style={styles.bodyContainer}
//           onPress={() => {
//             this.props.getOfferDetails();
//             Actions.offerTab({ updatePackage: true });
//           }}>
//           <View
//             style={[
//               styles.imageBackground,
//               activeTabIndex === 0
//                 ? { backgroundColor: '#D58303' }
//                 : { backgroundColor: '#FFFFFF' },
//             ]}>
//             {this._displayOfferImage(activeTabIndex)}
//           </View>

//           <Text style={styles.label}>Package Offer</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.bodyContainer}
//           onPress={() => {
//             this.props.getPromotionDetails();
//             Actions.promotionTab();
//           }}>
//           <View
//             style={[
//               styles.imageBackground,
//               activeTabIndex === 1
//                 ? { backgroundColor: '#D58303' }
//                 : { backgroundColor: '#FFFFFF' },
//             ]}>
//             {this._displayPromotionImage(activeTabIndex)}
//           </View>
//           <Text style={styles.label}>Promotion</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.bodyContainer}
//           onPress={() => {
//             this.props.getTipsDetails(callback => { });
//             Actions.tipsTab();
//           }}>
//           <View
//             style={[
//               styles.imageBackground,
//               activeTabIndex === 2
//                 ? { backgroundColor: '#D58303' }
//                 : { backgroundColor: '#FFFFFF' },
//             ]}>
//             {this._displayTipsImage(activeTabIndex)}
//           </View>
//           <Text style={styles.label}>Health Tips</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }
//   _displayOfferImage = index => {
//     return index === 0 ? (
//       <Image
//         style={[styles.avatar, {}]}
//         resizeMode="contain"
//         source={require('../../images/offerWhite.png')}
//       />
//     ) : (
//       <Image
//         style={[styles.avatar, {}]}
//         resizeMode="contain"
//         source={require('../../images/offerBlack.png')}
//       />
//     );
//   };
//   _displayPromotionImage = index => {
//     return index === 1 ? (
//       <Image
//         style={[styles.avatar, {}]}
//         resizeMode="contain"
//         source={require('../../images/promotionWhite.png')}
//       />
//     ) : (
//       <Image
//         style={[styles.avatar, {}]}
//         resizeMode="contain"
//         source={require('../../images/promotionBlack.png')}
//       />
//     );
//   };
//   _displayTipsImage = index => {
//     return index === 2 ? (
//       <Image
//         style={[styles.avatar, {}]}
//         resizeMode="contain"
//         source={require('../../images/tipsWhite.png')}
//       />
//     ) : (
//       <Image
//         style={[styles.avatar, {}]}
//         resizeMode="contain"
//         source={require('../../images/tipsBlack.png')}
//       />
//     );
//   };
// }

// const mapStateToProps = (state, props) => {
//   //props can be called as ownProps
//   const {
//     configState: { mobileNo },
//   } = state;

//   return {
//     mobileNo,
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return bindActionCreators(
//     {
//       getNotificationCount,
//       getPromotionDetails,
//       getTipsDetails,
//       getOfferDetails,
//     },
//     dispatch,
//   );
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(DashboardTabBar);

// const styles = StyleSheet.create({
//   mainContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Constants.COLOR.THEME_COLOR,
//   },
//   bodyContainer: {
//     backgroundColor: Constants.COLOR.THEME_COLOR,
//     flex: 1,
//     justifyContent: 'center',
//     paddingTop: 30,
//   },
//   imageBackground: {
//     paddingVertical: 15,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//     alignSelf: 'center',
//   },
//   avatar: {
//     width: deviceHeight / 25,
//     height: deviceHeight / 25,
//   },
//   label: {
//     alignSelf: 'center',
//     color: 'white',
//     paddingVertical: 8,
//     fontSize: 14,
//   },
// });




import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import OfferScreen from './OfferScreen';
import PromotionScreen from './PromotionScreen';
import TipsScreen from './TipsScreen';

class DashboardTabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'PackageOffer'
    };
  }

  handleTabPress = (tabName) => {
    this.setState({ activeTab: tabName });
  };

  renderTabItem = (tabName, iconImage) => {
    const { activeTab } = this.state;
    const isActive = activeTab === tabName;
    return (
      <View>
        <TouchableOpacity
          key={tabName}
          style={[
            styles.tabItem,
            isActive ? styles.activeTabItem : null,
          ]}
          onPress={() => this.handleTabPress(tabName)}>
          <View style={styles.tabContent}>
            <Image
              style={[styles.tabIcon, isActive ? styles.activeTabIcon : styles.inactiveTabIcon]}
              source={iconImage}
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.tabText}>{tabName}</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          {this.renderTabItem('PackageOffer', require('../../images/offerWhite.png'))}
          {this.renderTabItem('Promotion', require('../../images/promotionWhite.png'))}
          {this.renderTabItem('Tips', require('../../images/tipsWhite.png'))}
        </View>

        {this.state.activeTab === 'PackageOffer' && <OfferScreen />}
        {this.state.activeTab === 'Promotion' && <PromotionScreen />}
        {this.state.activeTab === 'Tips' && <TipsScreen />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  activeTabItem: {
    backgroundColor: '#D58303',
  },
  tabContent: {
    alignItems: 'center',
  },
  tabIcon: {
    width: 25,
    height: 25,
    marginBottom: 5,
  },
  activeTabIcon: {
    tintColor: 'white',
  },
  inactiveTabIcon: {
    tintColor: 'black',
  },
  tabText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 5
  },
  activeTabText: {
    color: 'white',
  },
});

export default DashboardTabBar;






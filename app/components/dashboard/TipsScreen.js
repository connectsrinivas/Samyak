import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
  RefreshControl,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import LoadingScreen from '../common/LoadingScreen';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getTipsDetails} from '../../actions/TipsAction';
import TipsListRow from './TipsListRow';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';




const deviceWidth = Dimensions.get('window').width;

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;

class TipsScreen extends Component {
 //  static propTypes = {
  //   getTipsDetails: PropTypes.func,
  //   isTipsLoading: PropTypes.bool,
  //   tipsDetails: PropTypes.string,
  //   currency: PropTypes.string,
  //   firmName: PropTypes.string,
  //   firmNo: PropTypes.string,
  // };

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  componentDidMount() {
    this.props.getTipsDetails(callback => {
      if (callback) {
        console.log("Tips details fetched successfully:", callback);
      }
    });
  }
  

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  render() {
    return this._renderScreens();
  }

  _renderScreens = () => {
    return <View style={styles.container}>{this._renderPage()}</View>;
  };

  _screenLoading = () => {
    return (
      <LoadingScreen
        isLoading={true}
        message={'No Record found'}
        onReloadPress={() => {}}
      />
    );
  };

  _navigateTipsrowListScreen = (titleData, desc, date) => {
    Actions.TipsListRow({title: titleData, content: desc, date: date});
  };

  _renderTipsItem = ({item}) => {
    return (
      <View style={styles.itemList}>
        <Text style={styles.rightText}>{item.Updated_Date}</Text>

        <Text numberOfLines={2} style={styles.centerText}>
          {item.Health_Title}
        </Text>
        <TouchableOpacity
          onPress={() => {
            this._navigateTipsrowListScreen(
              item.Health_Title,
              item.Health_Desc,
              item.Updated_Date,
            );
          }}>
          <Text style={styles.leftText}>Read More</Text>
        </TouchableOpacity>
      </View>
    );
  };

  _renderPage = () => {
    if (this.props.isTipsLoading) {
      return this._screenLoading();
    } else if (this.props.tipsDetails.length > 0) {
      return (
        <View style={{marginBottom: 40}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignSelf: 'flex-end',
            }}>
            <Image
              style={{
                width: deviceHeight / 35,
                height: deviceHeight / 35,
                marginHorizontal: 5,
              }}
              source={require('../../images/placeholder.png')}
            />
            <Text style={{}}>{this.props.firmName}</Text>
          </View>
          <Text style={styles.headingText}>Health Tips</Text>
          <FlatList
            data={JSON.parse(this.props.tipsDetails)}
            renderItem={this._renderTipsItem}
            keyExtractor={this._keyExtractor}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          />
        </View>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: Constants.FONT_SIZE.XXL,
            }}>
            No Health Tips Found
          </Text>
        </View>
      );
    }
  };

  // pull to refresh
  _onRefresh = () => {
    this.props.getTipsDetails(callback => {
      if (callback) {
      }
    });
  };

  _keyExtractor = data => {
    return data.id;
  };
}

const mapStateToProps = (state, props) => {
  //props can be called as ownProps

  const {
    tipsState: {isTipsLoading, tipsDetails},
    configState: {currency, firmName, firmNo},
  } = state;

  return {
    isTipsLoading,
    tipsDetails,
    currency,
    firmName,
    firmNo,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({getTipsDetails}, dispatch);
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TipsScreen);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
  },
  headingText: {
    marginBottom: 10,
    color: '#868686',
    fontSize: Constants.FONT_SIZE.XL,
  },

  itemList: {
    backgroundColor: '#002D87',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 5,
  },
  rightText: {
    color: Constants.COLOR.WHITE_COLOR,
    fontSize: Constants.FONT_SIZE.SM,
    paddingTop: 5,
    paddingLeft: 2,
  },
  centerText: {
    color: Constants.COLOR.WHITE_COLOR,
    fontSize: Constants.FONT_SIZE.L,
    paddingLeft: 2,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 50,
  },
  leftText: {
    color: Constants.COLOR.WHITE_COLOR,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginLeft: 200,
  },
});



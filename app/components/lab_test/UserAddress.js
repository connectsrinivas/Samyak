import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import Constants from '../../util/Constants';
import ButtonNext from '../common/ButtonNext';
import LabTestHeader from './LabTestHeader';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Actions} from 'react-native-router-flux';
import LoadingScreen from '../common/LoadingScreen';

export default class UserAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: null,
      btnAddressDisabled: false,
    };
  }

  selectItem(item, index) {
    this.setState({selectedItem: index});
    this.props.onClickAddress(item);
  }

  componentDidMount() {
    if (this.props.rowData !== null && this.props.rowData.length > 0) {
      this.props.onClickAddress(this.props.rowData[0]);
    }
  }
  addressList = ({item, index}) => {
    return (
      <TouchableOpacity onPress={() => this.selectItem(item, index)}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.AddressContentView}>
            <Text style={{padding: 5, fontSize: Constants.FONT_SIZE.M}}>
              {item.Address_Type_Desc}
            </Text>
            <Text style={{padding: 5, fontSize: Constants.FONT_SIZE.SM}}>
              {item.Full_Address}
            </Text>
            {this._renderLandmark(item)}
          </View>
          <View style={styles.circleContentView}>
            {this.state.selectedItem === index ? (
              <View style={styles.selectedCircleShapeView} />
            ) : (
              <View style={styles.circle} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _renderLandmark = item => {
    if (
      item.Landmark !== null &&
      item.Landmark !== undefined &&
      item.Landmark !== '' &&
      item.Landmark.trim().length > 0
    ) {
      return (
        <Text style={{padding: 5, fontSize: Constants.FONT_SIZE.SM}}>
          Landmark: {item.Landmark}
        </Text>
      );
    } else {
      return <Text style={{padding: 5, fontSize: Constants.FONT_SIZE.SM}} />;
    }
  };
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 10,
          width: '100%',
          backgroundColor: 'white',
        }}
      />
    );
  };

  render() {
    return (
      <View style={styles.mainView}>
        <View style={styles.headerTitle}>
          <Text style={{fontSize: Constants.FONT_SIZE.M}}>Choose Address </Text>
          <TouchableOpacity
            disabled={this.state.btnAddressDisabled}
            onPress={() => {
              this.setState({
                btnAddressDisabled: true,
              });
              Actions.addAddressScreen();
              setTimeout(() => {
                this.setState({
                  btnAddressDisabled: false,
                });
              }, 1000);
            }}>
            <Text style={{color: '#0F97F5', fontSize: Constants.FONT_SIZE.M}}>
              Add{' '}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{flexDirection: 'row', marginVertical: 0, marginRight: 10}}>
          {this._renderContents()}
        </View>
      </View>
    );
  }

  _renderContents = () => {
    if (this.props.isShowLoading) {
      return <LoadingScreen />;
    } else {
      if (this.props.rowData != null && this.props.rowData.length > 0) {
        return (
          <FlatList
            data={this.props.rowData}
            extraData={this.state.selectedItem}
            renderItem={this.addressList}
            ItemSeparatorComponent={this.renderSeparator}
          />
        );
      } else {
        return (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                margin: 20,
              }}>
              No Data Available
            </Text>
          </View>
        );
      }
    }
  };
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },

  headerTitle: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  circle: {
    width: 18,
    height: 18,
    borderRadius: 18 / 2,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    alignSelf: 'center',
    marginHorizontal: 8,
    marginVertical: 16,
    borderColor: '#ACACAC',
    borderWidth: 5,
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
  AddressContentView: {
    flex: 5,
    backgroundColor: '#F7F7F7',
    padding: 20,
    marginLeft: 10,
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  circleContentView: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    margin: 0,
    flexDirection: 'row-reverse',
  },
});

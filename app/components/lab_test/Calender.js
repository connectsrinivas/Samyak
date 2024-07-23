
/*************************************************
 * SukraasLIS
 * @exports
 * @class Calender.js
 * @extends Component
 * Created by Kishore on 25/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/
'use strict';
import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  TouchableOpacity,
  FlatList,
} from 'react-native';
// import PropTypes from 'prop-types';
import {CalendarList} from 'react-native-calendars';
import ButtonNext from '../common/ButtonNext';
import ButtonBack from '../common/ButtonBack';
import LoadingScreen from '../common/LoadingScreen';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import moment from 'moment';
import {Actions} from 'react-native-router-flux';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default class Calender extends Component {
 //  static propTypes = {
  //   bookingHomeorWalkIn: PropTypes.object,
  //   daySlotWise: PropTypes.object,
  //   isCalenderLoading: PropTypes.bool,
  //   isNetworkAvailable: PropTypes.bool,
  //   isfromHomeBookingType: PropTypes.bool,
  // };
  constructor(props) {
    super(props);
    this.state = {
      isTimeSelectedforHome: false,
      isTimeSelectedforWalkin: false,

      markedDatesHome: {},
      markedDatesWalkin: {},

      homeDate: '',
      WalkinDate: '',

      homeTime: '',
      WalkinTime: '',

      selectIdforHome: '',
      selectIdforWalkin: '',

      btnNextDisabled: false,
      btnBackDisabled: false,
    };
  }

  _clearCalendarData = () => {
    this.setState({
      markedDatesHome: {},
      markedDatesWalkin: {},

      homeDate: '',
      WalkinDate: '',

      homeTime: '',
      WalkinTime: '',

      selectIdforHome: '',
      selectIdforWalkin: '',
    });
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  showDatetoTextBox(dateString) {
    const dateStr = JSON.parse(dateString);
    const dateformat = moment(dateStr).format('YYYY/MM/DD');
    let markedDates = {};
    markedDates[dateStr] = {selected: true};
    if (this.props.isfromHomeBookingType === true) {
      const formattedDate = moment(dateStr).format('YYYY-MM-DD');
      this.setState({
        homeDate: formattedDate,
        markedDatesHome: markedDates,
        markedDatesWalkin: '',
        WalkinDate: '',
      });
      if (this.props.bookingHomeorWalkIn.Type_Of_Booking === 'Home') {
        const bookingTypeHome = 'H';
        this.props.callDate(dateformat, bookingTypeHome);
      }
    } else {
      const formattedDate = moment(dateStr).format('YYYY-MM-DD');
      this.setState({
        WalkinDate: formattedDate,
        markedDatesWalkin: markedDates,
        markedDatesHome: '',
        homeDate: '',
      });
      if (this.props.bookingHomeorWalkIn.Type_Of_Booking !== 'Home') {
        const bookingTypeWalkIn = 'W';
        this.props.callDate(dateformat, bookingTypeWalkIn);
      }
    }
    this.props.setDate(dateformat);
    this.props.setTime('');
    this.setState({
      selectIdforHome: '',
      selectIdforWalkin: '',

      isTimeSelectedforHome: false,
      isTimeSelectedforWalkin: false,

      homeTime: '',
      WalkinTime: '',
    });
  }

  _selectItemforHome(item, index) {
    this.setState({
      selectIdforHome: index,
      selectIdforWalkin: '',
      homeTime: item.Slot_Time,
      WalkinTime: '',
      isTimeSelectedforHome: true,
      isTimeSelectedforWalkin: false,
    });
  }

  _selectItemforWalkin(item, index) {
    this.setState({
      selectIdforHome: '',
      selectIdforWalkin: index,
      homeTime: '',
      WalkinTime: item.Slot_Time,
      isTimeSelectedforWalkin: true,
      isTimeSelectedforHome: false,
    });
  }
  _renderTimeList = ({item, index}) => {
    if (this.props.isfromHomeBookingType) {
      return (
        <TouchableOpacity onPress={() => this._timeClickforHome(item, index)}>
          {this.state.selectIdforHome === index ? (
            <View style={[styles.timeListView, {backgroundColor: '#58AFFF'}]}>
              <Text style={styles.timeText}>{item.Slot_Time}</Text>
            </View>
          ) : (
            <View style={styles.timeListView}>
              <Text style={styles.timeText}>{item.Slot_Time}</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => this._timeClickforWalkin(item, index)}>
          {this.state.selectIdforWalkin === index ? (
            <View style={[styles.timeListView, {backgroundColor: '#58AFFF'}]}>
              <Text style={styles.timeText}>{item.Slot_Time}</Text>
            </View>
          ) : (
            <View style={styles.timeListView}>
              <Text style={styles.timeText}>{item.Slot_Time}</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }
  };

  _timeClickforHome = (item, index) => {
    this._selectItemforHome(item, index);
    this.props.setTime(item.Slot_Time);
  };

  _timeClickforWalkin = (item, index) => {
    this._selectItemforWalkin(item, index);
    this.props.setTime(item.Slot_Time);
  };

  _itemSeperator = () => {
    return <View style={{marginHorizontal: 20}} />;
  };

  render() {
    var defaultDate = new Date();
    if (this.props.isCalenderLoading) {
      return <LoadingScreen />;
    } else {
      const arrSlotTimings = this.props.daySlotWise.Slot_Detail;
      return (
        <View style={styles.HeaderView}>
          <Text style={styles.HeaderText}>Choose date and time</Text>
          <View style={styles.BorderTextView}>
            {this._showDateandTimeTextBox()}
            <View style={styles.calenderImageView}>
              <Image
                style={styles.avatar}
                resizeMode="contain"
                source={require('../../images/calenderBlack.png')}
              />
            </View>
          </View>
          <View style={styles.calenderContentView}>
            <CalendarList
              current={
                this.props.isfromHomeBookingType
                  ? this.state.homeDate !== ''
                    ? moment(this.state.homeDate).format('YYYY-MM-DD')
                    : moment(defaultDate).format('YYYY-MM-DD')
                  : this.state.WalkinDate !== ''
                  ? moment(this.state.WalkinDate).format('YYYY-MM-DD')
                  : moment(defaultDate).format('YYYY-MM-DD')
              }
              // minDate={moment(
              //   this.props.bookingHomeorWalkIn.Slot_Start_Date,
              // ).format('YYYY-MM-DD')}
              // maxDate={moment(
              //   this.props.bookingHomeorWalkIn.Slot_End_Date,
              // ).format('YYYY-MM-DD')}
              disableAllTouchEventsForDisabledDays={true}
              style={styles.calenderList}
              pastScrollRange={1}
              futureScrollRange={1}
              horizontal={true}
              pagingEnabled={true}
              disableArrowLeft={true}
              calendarWidth={deviceWidth - 24}
              disableArrowRight={true}
              onDayPress={({dateString}) =>
                this.showDatetoTextBox(JSON.stringify(dateString))
              }
              markedDates={
                this.props.isfromHomeBookingType
                  ? this.state.markedDatesHome
                  : this.state.markedDatesWalkin
              }
              markingType={'custom'}
              firstDay={1}
              theme={{
                textSectionTitleColor: 'black',
                selectedDayBackgroundColor: 'green',
                selectedDayTextColor: 'white',
                todayTextColor: 'black',
                dayTextColor: 'black',
                textDisabledColor: 'darkgray',
                monthTextColor: 'white',
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 15,

                'stylesheet.calendar.header': {
                  header: {
                    marginTop: 0,
                    height: 80,
                    marginLeft: -15,
                    marginRight: -15,
                    borderRadius: 10,

                    alignItems: 'center',
                    backgroundColor: '#424141',
                  },

                  monthText: {
                    marginTop: 15,
                    color: 'white',
                    fontWeight: '700',
                    fontSize: 16,
                  },
                  dayHeader: {
                    marginTop: -42,
                    marginBottom: 7,
                    width: 30,
                    textAlign: 'center',
                    fontSize: 14,
                    color: 'white',
                  },
                },
              }}
            />
            <View style={styles.TimeView}>
              <FlatList
                style={{marginTop: 10, marginRight: 10}}
                data={arrSlotTimings}
                extraData={arrSlotTimings}
                horizontal={true}
                renderItem={this._renderTimeList}
                ItemSeparatorComponent={this._itemSeperator}
                scrollBar
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </View>

          <View style={styles.buttonView}>
            <TouchableOpacity
              disabled={this.state.btnBackDisabled}
              onPress={() => {
                this.setState({
                  btnBackDisabled: true,
                });
                Actions.pop();
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
      );
    }
  }

  _showDateandTimeTextBox = () => {
    if (this.props.isfromHomeBookingType) {
      return (
        <View style={{flex: 3, flexDirection: 'row'}}>
          <Text style={styles.TextStyle}>
            {this.state.homeDate !== ''
              ? moment(this.state.homeDate).format('DD-MM-YYYY')
              : ''}
          </Text>
          <Text style={styles.TextStyle}>{this.state.homeTime}</Text>
        </View>
      );
    } else {
      return (
        <View style={{flex: 3, flexDirection: 'row'}}>
          <Text style={styles.TextStyle}>
            {this.state.WalkinDate !== ''
              ? moment(this.state.WalkinDate).format('DD-MM-YYYY')
              : ''}
          </Text>
          <Text style={styles.TextStyle}>{this.state.WalkinTime}</Text>
        </View>
      );
    }
  };
  _nextClick = () => {
    if (this.props.isNetworkAvailable) {
      if (this.props.isfromHomeBookingType) {
        if (
          this.state.homeDate.length > 2 &&
          this.state.homeTime.length > 2 &&
          this.state.isTimeSelectedforHome
        ) {
          Actions.PatientInfo();
        } else {
          Utility.showAlert(
            Constants.ALERT.TITLE.ERROR,
            Constants.VALIDATION_MSG.NO_DATE_TIME_SELECTED,
          );
        }
      } else {
        if (
          this.state.WalkinDate.length > 2 &&
          this.state.WalkinTime.length > 2 &&
          this.state.isTimeSelectedforWalkin
        ) {
          Actions.PatientInfo();
        } else {
          Utility.showAlert(
            Constants.ALERT.TITLE.ERROR,
            Constants.VALIDATION_MSG.NO_DATE_TIME_SELECTED,
          );
        }
      }
    } else {
      Utility.showAlert(
        Constants.ALERT.TITLE.ERROR,
        Constants.VALIDATION_MSG.NO_INTERNET,
      );
    }
  };
}

const styles = StyleSheet.create({
  HeaderView: {
    flex: 1,
    backgroundColor: 'white',
    padding: 0,
    marginTop: 20,
    flexDirection: 'column',
  },
  HeaderText: {
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: Constants.FONT_SIZE.M,
    color: '#1C1C1C',
    // paddingHorizontal:10
  },
  calenderImageView: {
    flexDirection: 'row-reverse',
    backgroundColor: 'white',
  },
  BorderTextView: {
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 0,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: 'lightgray',
    padding: 5,
    backgroundColor: 'white',
    flexDirection: 'row',
  },

  TextStyle: {
    textAlign: 'center',
    alignSelf: 'center',
    color: Constants.COLOR.LAB_CART_ITEM_FONT,
    padding: 10,
    marginLeft: 10,
  },
  avatar: {
    padding: 5,
    width: 25,
    height: 25,
    backgroundColor: 'white',
    marginRight: 10,
    alignSelf: 'center',
  },
  calenderContentView: {
    marginBottom: 10,
    marginTop: -10,
    marginHorizontal: 0,
    alignContent: 'center',
    justifyContent: 'center',
  },
  calenderList: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'lightgray',
  },

  TimeView: {
    marginVertical: 10,
  },
  buttonView: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 0,
    flexDirection: 'row',
  },
  timeListView: {
    flexDirection: 'row',
    borderColor: '#A9A9A9',
    borderWidth: 0.4,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  timeText: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});


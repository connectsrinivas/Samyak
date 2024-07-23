/* eslint-disable no-undef */
/*************************************************
 * SukraasLIS
 * @exports
 * @class TrendsScreen.js
 * @extends Component
 * Created by Sankar on 03/06/2020
 * Copyright Ā© 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, { useState, Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import { LineChart } from 'react-native-chart-kit';
import Popup from '../../components/common/Model';
import { Actions } from 'react-native-router-flux';
// import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Rect, Text as TextSVG, Svg } from 'react-native-svg';
import {
  TestTrendsResultAction,
  selectPatientList,
  selectTestList,
} from '../../actions/TestTrendsAction';
import LoadingScreen from '../common/LoadingScreen';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Grid } from 'react-native-svg-charts';
import { jsxNamespacedName } from '../../../node_modules/@babel/types';
import store from '../../store';

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const arrdata = {
  labels: [],

  datasets: [
    {
      data: [63, 56.7, 78.9],
    },
    {
      data: [],
      strokeWidth: 2,
      color: (opacity = 1) => 'rgba(34,139,34, 1)',
      withDots: false,
    },
    {
      data: [],
      strokeWidth: 2,
      color: (opacity = 1) => 'rgba(255,0,0, 1)',
      withDots: false,
    },
  ],
};

const chartConfig = {
  backgroundColor: 'white ',
  backgroundGradientFrom: 'white',
  backgroundGradientTo: 'white',
  decimalPlaces: 0,
  fontSize: 6,
  color: (opacity = 2) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: { marginLeft: 20 },
  propsForDots: {
    r: '2',
    strokeWidth: '8',
    stroke: 'blue',
  },
};

class TrendsScreen extends Component {
  //  static propTypes = {
  //   isTestTrendsScreenLoading: PropTypes.bool,
  //   showPatientList: PropTypes.bool,
  //   arrPatientList: PropTypes.array,
  //   arrTestLists: PropTypes.array,
  //   arrTestResults: PropTypes.array,
  //   TestTrendsResultAction: PropTypes.func,
  //   selectTestList: PropTypes.func,
  //   selectPatientList: PropTypes.func,
  //   serviceValue: PropTypes.object,
  // };

  constructor(props) {
    super(props);
    this.state = {
      showModel: false,
      selectDropDownType: '',
      test: '',
      patientName: '',
      patientGender: '',
      patientRelation: '',
      patientCode: '',
      patientAge: '',
      isgraphShowing: true,
      isrotateIconBtnPressed: false,
      userName: '',
      tooltipPos: {
        x: 0,
        y: 0,
        visible: false,
        value: 0,
      },
      isDataPointClicked: false,
    };
  }
  componentDidMount() {
    if (store.getState().deviceState.isNetworkConnectivityAvailable) {
      this.willFocusSubscription = this.props.navigation.addListener(
        'willFocus',
        () => {
          this.TrendscomponentDidMount();
        },
      );
    } else {
      this.internetAlert(Constants.VALIDATION_MSG.NO_INTERNET);
    }
  }

  async TrendscomponentDidMount() {
    const userName = await AsyncStorage.getItem(
      Constants.ASYNC.ASYNC_PHONE_NUMBER,
    );
    this.setState({ userName: userName });
    this.props.selectPatientList(userName, isSuccess => {
      if (isSuccess === true) {
        const {
          name,
          gender,
          relation,
          patientTestCode,
          patientAge,
        } = this.props.arrPatientList[0];
        this.setState({
          patientName: name,
          patientGender: gender,
          patientRelation: relation,
          patientCode: patientTestCode,
          patientAge: patientAge,
        });
        let dictInfo = {
          Username: this.state.userName,
          Pt_Code: patientTestCode,
        };
        this.props.selectTestList(dictInfo, isSuccess1 => {
          if (isSuccess1 === true) {
            this.setState({
              test: this.props.arrTestLists[0].testName,
            });
          }
        });
      }
    });
  }

  renderDotContent = ({ x, y, index }) => {
    return (
      <View>
        <Svg>
          <Rect x={x - 15} y={y + 10} width="40" height="30" />
          <TextSVG
            x={x + 5}
            y={y + 30}
            fill="black"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle">
            {dataSets[index]}
          </TextSVG>
        </Svg>
      </View>
    );
  };
  _renderScreens = () => {
    if (this.props.isTestTrendsScreenLoading) {
      return this._screenLoading();
    } else {
      if (this.props.arrPatientList.length > 0) {
        return this._renderPage();
      } else {
        return (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ padding: 20 }}>No Data found!</Text>
          </View>
        );
      }
    }
  };

  _screenLoading = () => {
    return <LoadingScreen />;
  };

  _renderList = ({ item }) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.dateAndTimeView}>
          <Text> {item.Date}</Text>
        </View>
        <View style={styles.dateAndTimeView}>
          <Text> {item.Result}</Text>
        </View>
      </View>
    );
  };

  _showTestList = () => {
    if (this.props.arrTestLists.length > 0) {
      // console.log("arrTestList", arrTestLists);
      return (
        <TouchableOpacity
          style={[styles.testDropDown]}
          onPress={() => {
            [
              this.setState({ showModel: !this.state.showModel }),
              this.setState({ selectDropDownType: 'TEST' }),
            ];
          }}>
          <View style={styles.dropDownView}>
            <Text style={[styles.textStyle, { color: '#60b450' }]}>
              Select Test
            </Text>
            <Image
              style={styles.dropDownStyle}
              source={require('../../images/downArrow.png')}
              resizeMode="contain"
            />
          </View>
          <Text
            style={[
              styles.textStyle,
              { color: Constants.COLOR.BOOK_ADDRESS_TEXT_COLOR },
            ]}>
            {this.state.test}
          </Text>
        </TouchableOpacity>
      );
    }
    else {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            width: deviceWidth,
            height: deviceHeight - 200,
          }}>
          <Text style={{ padding: 20 }}>No Data found!</Text>
        </View>
      );
    }
  };

  _renderLineChart = () => {
    let maxIndex = arrdata.datasets[0].data.indexOf(
      Math.max(...arrdata.datasets[0].data),
    );
    let minIndex = arrdata.datasets[0].data.indexOf(
      Math.min(...arrdata.datasets[0].data),
    );
    let dataSets = arrdata.datasets[0].data;
    return (
      <View style={{}}>
        {arrdata.datasets[0].data.length >= 5 ? (
          <ScrollView horizontal={true}>
            <LineChart
              renderDotContent={({x, y, index}) => {
                return (
                  <View>
                    <Svg>
                      <Rect x={x - 15} y={y + 10} width="20" height="20" />
                      <TextSVG
                        x={x + 10}
                        y={y + 17}
                        fill="black"
                        fontSize="14"
                        fontWeight="bold"
                        textAnchor="middle">
                        {dataSets[index]}
                      </TextSVG>
                    </Svg>
                  </View>
                );
              }}
              style={{margin: 10}}
              data={arrdata}
              width={arrdata.datasets[0].data.length * 120}
              withVerticalLabels={true}
              height={deviceHeight / 3}
              withDots={true}
              segments={0}
              withShadow={false}
              withInnerLines={true}
              withOuterLines={false}
              fromZero={true}
              getDotColor={(dataPoint, dataPointIndex) => {
                return '#0936EE';
              }}
              getDotProps={(value, index) => {
                return {
                  strokeWidth: '4',
                  r: '6',
                };
              }}
              chartConfig={{
                backgroundColor: 'white',
                backgroundGradientFrom: 'white',
                backgroundGradientTo: 'white',
                decimalPlaces:
                  this.props.serviceValue.No_Of_Decimal !== undefined &&
                  this.props.serviceValue.No_Of_Decimal !== null
                    ? this.props.serviceValue.No_Of_Decimal
                    : 0,
                fontSize: 1,
                color: (opacity = 2) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {paddingLeft: 10},
                propsForDots: {
                  r: '2',
                  strokeWidth: '8',
                  stroke: 'blue',
                },
              }}
            />
         
          </ScrollView>
        ) : (
          <LineChart
            renderDotContent={({ x, y, index }) => {
              return (
                <View>
                  <Svg>
                    <Rect x={x - 15} y={y + 10} width="20" height="20" />
                    <TextSVG
                      x={x + 10}
                      y={y + 17}
                      fill="black"
                      fontSize="14"
                      fontWeight="bold"
                      textAnchor="middle">
                      {dataSets[index]}
                    </TextSVG>
                  </Svg>
                </View>
              );
            }}
            style={{ margin: 10 }}
            data={arrdata}
            width={deviceWidth - 20}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            height={deviceHeight / 3}
            withDots={true}
            segments={0}
            withShadow={false}
            withInnerLines={true}
            withOuterLines={false}
            fromZero={true}
            getDotColor={(dataPoint, dataPointIndex) => {
              return '#0936EE';
            }}
            getDotProps={(value, index) => {
              return {
                strokeWidth: '4',
                r: '6',
              };
            }}
            chartConfig={{
              backgroundColor: 'white ',
              backgroundGradientFrom: 'white',
              backgroundGradientTo: 'white',
              decimalPlaces:
                this.props.serviceValue.No_Of_Decimal !== undefined &&
                  this.props.serviceValue.No_Of_Decimal !== null
                  ? this.props.serviceValue.No_Of_Decimal
                  : 0,
              fontSize: 6,
              color: (opacity = 2) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { marginLeft: 20 },
            }}
          />
        )}
      </View>
    );
  };

  _showTestResults = () => {
    arrdata.labels = this.props.arrTestResults.map(value => value.Date);
    arrdata.datasets[0].data = this.props.arrTestResults.map(
      value => value.Result,
    );
    arrdata.datasets[1].data = arrdata.datasets[0].data.map(
      value => this.props.serviceValue.To_Value,
    );

    arrdata.datasets[2].data = arrdata.datasets[0].data.map(
      value => this.props.serviceValue.From_Value,
    );
    if (arrdata.datasets[0].data.length < 5) {
      arrdata.datasets[1].data = [
        ...arrdata.datasets[1].data,
        this.props.serviceValue.To_Value,
        this.props.serviceValue.To_Value,
        this.props.serviceValue.To_Value,
        this.props.serviceValue.To_Value,
        this.props.serviceValue.To_Value,
      ];
      arrdata.datasets[2].data = [
        ...arrdata.datasets[2].data,
        this.props.serviceValue.From_Value,
        this.props.serviceValue.From_Value,
        this.props.serviceValue.From_Value,
        this.props.serviceValue.From_Value,
        this.props.serviceValue.From_Value,
      ];
    }
    if (this.props.arrTestResults.length > 0) {
      return (
        <View style={{ flexDirection: 'column' }}>
          <View style={styles.tablechartHeaderView}>
            <TouchableOpacity
              style={
                this.state.isgraphShowing === true
                  ? [styles.chartIconBtn, { backgroundColor: '#3399ff' }]
                  : styles.chartIconBtn
              }
              onPress={() =>
                this.setState({
                  isgraphShowing: true,
                })
              }>
              <Image
                style={styles.graphImageAvatar}
                source={require('../../images/graphImage.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={
                this.state.isgraphShowing === false
                  ? [styles.tableIconBtn, { backgroundColor: '#3399ff' }]
                  : styles.tableIconBtn
              }
              onPress={() =>
                this.setState({
                  isgraphShowing: false,
                })
              }>
              <Image
                style={styles.tableImageAvatar}
                source={require('../../images/tableImage.png')}
              />
            </TouchableOpacity>
          </View>
          {this.state.isgraphShowing === true ? (
            this._renderLineChart()
          ) : (
            <View style={{ flexDirection: 'column' }}>
              <View style={styles.tableHeaderView}>
                <Text style={styles.tableHeaderText}>Date</Text>
                <Text style={styles.tableHeaderText}>Result</Text>
              </View>
              <FlatList
                style={{
                  borderWidth: 0.5,
                  borderColor: 'black',
                  borderRadius: 10,
                }}
                data={this.props.arrTestResults}
                renderItem={this._renderList}
              />
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  // marginHorizontal: 10,
                }}>
                <Text
                  style={{ paddingVertical: 20, paddingHorizontal: 10, flex: 1 }}>
                  {this.props.serviceValue.Ref_Value}
                </Text>
                <TouchableOpacity
                  style={{ alignSelf: 'center' }}
                  disabled={this.state.isrotateIconBtnPressed}
                  onPress={() => {
                    this.setState({
                      isrotateIconBtnPressed: true,
                    });
                    Actions.tableTestReport({
                      tableData: this.props.arrTestResults,
                      refValue: this.props.serviceValue.Ref_Value,
                    });
                    setTimeout(() => {
                      this.setState({
                        isrotateIconBtnPressed: false,
                      });
                    }, 1000);
                  }}>
                  <Image
                    style={styles.rotateImage}
                    source={require('../../images/rotation.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          <View style={styles.RotateImageView}>
            <TouchableOpacity
              disabled={this.state.isrotateIconBtnPressed}
              onPress={() => {
                if (this.state.isgraphShowing === true) {
                  this.setState({
                    isrotateIconBtnPressed: true,
                  });
                  Actions.fullChart({
                    Data: this.props.arrTestResults,
                    ChartConfig: chartConfig,
                    ServiceValue: this.props.serviceValue,
                    decimalDigits:
                      this.props.serviceValue.No_Of_Decimal !== undefined &&
                        this.props.serviceValue.No_Of_Decimal !== null
                        ? this.props.serviceValue.No_Of_Decimal
                        : 0,
                  });
                  setTimeout(() => {
                    this.setState({
                      isrotateIconBtnPressed: false,
                    });
                  }, 1000);
                }
              }}>
              {this.state.isgraphShowing === true ? (
                <Image
                  style={styles.rotateImage}
                  source={require('../../images/rotation.png')}
                />
              ) : null}
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            width: deviceWidth,
            height: deviceHeight - 200,
          }}>
          <Text style={{ padding: 20 }}>No Data found!</Text>
        </View>
      );
    }
  };
  _showPatientList = () => {
    if (this.props.arrPatientList.length > 0) {
      return (
        <View style={{ flexDirection: 'column' }}>
          <TouchableOpacity
            style={styles.dropDownView}
            onPress={() => {
              [
                this.setState({ showModel: !this.state.showModel }),
                this.setState({ selectDropDownType: 'PATIENT' }),
              ];
            }}>
            <Text style={styles.textStyle}>Select Patient</Text>
            <Image
              style={styles.dropDownStyle}
              source={require('../../images/downArrow.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View
            style={
              ([styles.tableViewContainer],
              {
                padding: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderColor: Constants.COLOR.BLACK_COLOR,
                borderStyle: 'dashed',
                borderWidth: 1,
                borderRadius: 1,
                marginVertical: 16,
              })
            }>
            <Text style={[styles.patientTextStyle, { flex: 2 }]}>
              {this.state.patientName} , {this.state.patientAge}
            </Text>
            <View style={styles.verticalView} />
            <Text style={[styles.patientTextStyle, { flex: 1 }]}>
              {this.state.patientGender}
            </Text>
            <View style={styles.verticalView} />
            <Text style={[styles.patientTextStyle, { flex: 1 }]}>
              {this.state.patientRelation}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 25,
          }}>
          <Text style={{ padding: 20 }}>No Data found!</Text>
        </View>
      );
    }
  };

  _renderPage = () => {
    arrdata.labels = this.props.arrTestResults.map(value => value.Date);
    arrdata.datasets[0].data = this.props.arrTestResults.map(
      value => value.Result,
    );
    arrdata.datasets[1].data = arrdata.datasets[0].data.map(
      value => this.props.serviceValue.To_Value,
    );
    arrdata.datasets[2].data = arrdata.datasets[0].data.map(
      value => this.props.serviceValue.From_Value,
    );
    if (arrdata.datasets[0].data.length < 5) {
      arrdata.datasets[1].data = [
        ...arrdata.datasets[1].data,
        this.props.serviceValue.To_Value,
        this.props.serviceValue.To_Value,
        this.props.serviceValue.To_Value,
        this.props.serviceValue.To_Value,
        this.props.serviceValue.To_Value,
      ];
      arrdata.datasets[2].data = [
        ...arrdata.datasets[2].data,
        this.props.serviceValue.From_Value,
        this.props.serviceValue.From_Value,
        this.props.serviceValue.From_Value,
        this.props.serviceValue.From_Value,
        this.props.serviceValue.From_Value,
      ];
    }
    return (
      <View style={styles.mainContainer}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <View style={styles.bodyContainer}>
            {this._showPatientList()}
            <View style={styles.dropDownView}>
              {this.props.arrPatientList.length > 0
                ? this._showTestList()
                : null}
            </View>
            {this._showModal(this.state.selectDropDownType)}
            {this.props.arrTestLists.length > 0
              ? this._showTestResults()
              : null}
          </View>
        </ScrollView>
      </View>
    );
  };

  _onRefresh = async () => {
    const userName = await AsyncStorage.getItem(
      Constants.ASYNC.ASYNC_PHONE_NUMBER,
    );
    this.setState({ userName: userName });
    this.props.selectPatientList(userName, isSuccess => {
      if (isSuccess === true) {
        const {
          name,
          gender,
          relation,
          patientTestCode,
          patientAge,
        } = this.props.arrPatientList[0];
        this.setState({
          patientName: name,
          patientGender: gender,
          patientRelation: relation,
          patientCode: patientTestCode,
          patientAge: patientAge,
        });
        let dictInfo = {
          Username: this.state.userName,
          Pt_Code: patientTestCode,
        };
        this.props.selectTestList(dictInfo, isSuccess1 => {
          if (isSuccess1 === true) {
            this.setState({
              test: this.props.arrTestLists[0].testName,
            });
          }
        });
      }
    });
  };
  render() {
    return this._renderScreens();
  }

  _showModal = dropDownType => {
    const arrPatientDetail = this.props.arrPatientList;
    if (dropDownType === 'TEST') {
      return (
        <Popup
          visible={this.state.showModel}
          dropDownType={dropDownType}
          array={this.props.arrTestLists}
          showTop={false}
          hideModel={() => {
            this.setState({ showModel: false });
          }}
          onPressed={(testName, testCode, testSubCode) => {
            [
              this.setState({ showModel: !this.state.showModel }),
              this.setState({ test: testName }),
              this.setState({ isDataPointClicked: false }),
            ];
            let dictInfo = {
              Username: this.state.userName,
              Pt_Code: this.state.patientCode,
              Test_Code: testCode,
              Test_Sub_Code: testSubCode,
            };
            this.props.TestTrendsResultAction(dictInfo);
          }}
        />
      );
    } else if (dropDownType === 'PATIENT') {
      return (
        <Popup
          visible={this.state.showModel}
          dropDownType={dropDownType}
          array={arrPatientDetail}
          showTop={true}
          hideModel={() => {
            this.setState({ showModel: false });
          }}
          onPressed={(name, gender, relation, patientCode, patientAge) => {
            [
              this.setState({ showModel: !this.state.showModel }),
              this.setState({ patientName: name }),
              this.setState({ patientGender: gender }),
              this.setState({ patientRelation: relation }),
              this.setState({ patientCode: patientCode }),
              this.setState({ patientAge: patientAge }),
              this.setState({ isDataPointClicked: false }),
            ];
            let dictInfo = {
              Username: this.state.userName,
              Pt_Code: patientCode,
            };
            this.props.selectTestList(dictInfo, isSuccess1 => {
              if (isSuccess1 === true) {
                this.setState({
                  test: this.props.arrTestLists[0].testName,
                });
              }
            });
          }}
        />
      );
    }
  };
}
const mapStateToProps = (state, props) => {
  const {
    testTrendState: {
      isTestTrendsScreenLoading,
      arrPatientList,
      arrTestResults,
      arrTestLists,
      showPatientList,
      serviceValue,
    },
  } = state;

  return {
    isTestTrendsScreenLoading,
    showPatientList,
    arrPatientList,
    arrTestLists,
    arrTestResults,
    serviceValue,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      TestTrendsResultAction,
      selectPatientList,
      selectTestList,
    },
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrendsScreen);
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
  },
  bodyContainer: {
    marginVertical: 8,
    marginHorizontal: 12,
  },
  patientPickerStyle: {
    margin: 10,
    backgroundColor: 'blue',
  },
  dropDownStyle: {
    width: deviceHeight / 35,
    height: deviceHeight / 35,
    marginTop: 4,
  },
  tableViewContainer: {
    flex: 1,
    padding: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patientTextStyle: {
    paddingHorizontal: 5,
    textAlign: 'center',
    alignSelf: 'center',
    color: Constants.COLOR.BOOK_ADDRESS_TEXT_COLOR,
  },
  verticalView: {
    borderRightWidth: 0.5,
    borderRightColor: Constants.COLOR.BOOK_ADDRESS_TEXT_COLOR,
  },
  dropDownView: {
    flexDirection: 'row',
    width: deviceWidth - 20,
    justifyContent: 'space-between',
  },
  testDropDown: {
    backgroundColor: '#f1f1f1',
    width: deviceWidth - 20,
    paddingVertical: 10,
  },
  monthDropDown: {
    backgroundColor: '#f1f1f1',
    width: deviceWidth / 2.5,
    padding: 10,
  },
  textStyle: {
    fontSize: Constants.FONT_SIZE.M,
    paddingVertical: 4,
  },
  chartIconBtn: {
    marginRight: 0,
    padding: 3,
  },
  tableIconBtn: {
    padding: 3,
  },
  graphImageAvatar: {
    width: 35,
    height: 35,
  },
  tableImageAvatar: {
    marginVertical: 5,
    width: 35,
    height: 35,
    padding: 5,
    overflow: 'hidden',
  },
  RotateImageView: {
    alignItems: 'flex-end',
    flexDirection: 'row-reverse',
    marginTop: 25,
  },
  rotateImage: {
    width: deviceHeight / 20,
    height: deviceHeight / 20,
    opacity: 0.8,
    alignSelf: 'center',
  },
  tableHeaderView: {
    marginVertical: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tableHeaderText: {
    fontSize: 20,
    marginHorizontal: 20,
  },
  dateAndTimeView: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#D8D8D8',
    padding: 20,
    alignItems: 'center',
  },
  tablechartHeaderView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 10,
  },
});



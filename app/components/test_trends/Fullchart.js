/*************************************************
 * SukraasLIS
 * @exports
 * @class TrendsScreen.js
 * @extends Component
 * Created by Kishore on 10/07/2020
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
  TouchableOpacity,
} from 'react-native';
import Constants from '../../util/Constants';
import Utility from '../../util/Utility';
import {LineChart} from 'react-native-chart-kit';
import {Actions} from 'react-native-router-flux';
import ButtonBack from '../common/ButtonBack';
import {ScrollView} from 'react-native-gesture-handler';
import OrientationLocker, {Orientation} from 'react-native-orientation-locker';
import {Rect, Text as TextSVG, Svg} from 'react-native-svg';

const arrdata = {
  labels: [],
  datasets: [
    {
      data: [],
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
  backgroundColor: 'black ',
  backgroundGradientFrom: 'white',
  backgroundGradientTo: 'white',
  decimalPlaces: 1,
  fontSize: 6,
  color: (opacity = 2) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForDots: {
    r: '2',
    strokeWidth: '8',
    stroke: 'blue',
  },
};

const deviceHeight = Utility.isiPhoneX()
  ? Constants.SCREEN_SIZE.PLUS_SIZE
  : Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default class FullChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backbtnPressed: false,
      tooltipPos: {
        x: 0,
        y: 0,
        visible: false,
        value: 0,
      },
    };
  }

  componentDidMount() {
    Orientation.lockToLandscape();
  }

  componentWillUnmount() {
    Orientation.lockToPortrait();
  }

  render() {
    arrdata.labels = this.props.Data.map(value => value.Date);
    arrdata.datasets[0].data = this.props.Data.map(value => value.Result);
    arrdata.datasets[1].data = arrdata.datasets[0].data.map(
      () => this.props.ServiceValue.To_Value,
    );
    arrdata.datasets[2].data = arrdata.datasets[0].data.map(
      () => this.props.ServiceValue.From_Value,
    );
    if (arrdata.datasets[0].data.length < 5) {
      arrdata.datasets[1].data = [
        ...arrdata.datasets[1].data,
        this.props.ServiceValue.To_Value,
        this.props.ServiceValue.To_Value,
        this.props.ServiceValue.To_Value,
        this.props.ServiceValue.To_Value,
        this.props.ServiceValue.To_Value,
      ];
      arrdata.datasets[2].data = [
        ...arrdata.datasets[2].data,
        this.props.ServiceValue.From_Value,
        this.props.ServiceValue.From_Value,
        this.props.ServiceValue.From_Value,
        this.props.ServiceValue.From_Value,
        this.props.ServiceValue.From_Value,
      ];
    }

    let maxIndex = arrdata.datasets[0].data.indexOf(
      Math.max(...arrdata.datasets[0].data),
    );
    let minIndex = arrdata.datasets[0].data.indexOf(
      Math.min(...arrdata.datasets[0].data),
    );
    let dataSets = arrdata.datasets[0].data;

    return (
      <View style={styles.mainContainer}>
        {arrdata.datasets[0].data.length >= 2 ? (
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
              style={styles.chartStyles}
              data={arrdata}
              width={arrdata.datasets[0].data.length * 120}
              height={200}
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
                decimalPlaces: this.props.decimalDigits,
                fontSize: 2,
                color: (opacity = 2) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {marginLeft: 20},
              }}
              withDots={true}
              segments={0}
              withShadow={false}
              withInnerLines={true}
              withOuterLines={false}
              fromZero={true}
            />
          </ScrollView>
        ) : (
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
            style={styles.chartStyles}
            data={arrdata}
            width={deviceHeight / 2}
            height={200}
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
              decimalPlaces: this.props.decimalDigits,
              fontSize: 6,
              color: (opacity = 2) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {marginLeft: 20},
            }}
            withDots={true}
            segments={0}
            withShadow={false}
            withInnerLines={true}
            withOuterLines={false}
            fromZero={true}
          />
        )}
        <View style={styles.backButton}>
          <TouchableOpacity
            disabled={this.state.backbtnPressed}
            onPress={() => {
              this.setState({
                backbtnPressed: true,
              });
              Actions.pop();
              setTimeout(() => {
                this.setState({
                  backbtnPressed: false,
                });
              }, 1000);
            }}>
            <ButtonBack />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: 'green',
  },
  chartStyles: {
    marginTop: deviceHeight / 14,
    marginBottom: deviceHeight / 55,
  },
  backButton: {
    flexDirection: 'column',
    margin: 10,
    alignSelf: 'flex-start',
  },
});

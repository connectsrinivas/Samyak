import React, {Component} from 'react';
import {View, StyleSheet, TextInput, Text} from 'react-native';

class Input extends Component {
  render() {
    return (
      <View>
        <Text style={styles.placeholder}>{this.props.label}</Text>
        <TextInput
          style={styles.inputs}
          placeholder={this.props.placeholder}
          value={this.props.value}
          editable={this.props.editable}
          keyboardType={this.props.keyboardType}
          underlineColorAndroid="transparent"
          onChangeText={this.props.onChangeText}
          secureTextEntry={this.props.secureTextEntry}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  placeholder: {
    marginTop: 10, // use marginVertical - not compulsary
    marginLeft: 0,
    marginRight: 0, // use marginhorizontal - not compulsary
    marginBottom: 15,
    fontSize: 16,
    color: '#1E75C0',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  inputs: {
    height: 50, // height and width based on deviceHeight and deviceWidth
    marginLeft: 0,
    marginRight: 0,
    borderBottomColor: '#FCF8F9',
    backgroundColor: '#FCF8F9',
    borderRadius: 1,
    borderBottomWidth: 1,
    marginBottom: 30,
    paddingLeft: 10,
    color: 'black', // color, fontSize use it from constants
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Input;

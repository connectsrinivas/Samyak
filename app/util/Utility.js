/*************************************************
 * SukraasLIS
 * Utility.js
 * Created by Jagadish Sellamuthu on 12/05/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

import {Alert, Dimensions} from 'react-native';

import {Actions} from 'react-native-router-flux';
import {BackHandler} from 'react-native';

export let userTokenRenewalTimer;
import {ALERT} from './Constants';
//import * as Keychain from 'react-native-keychain';
// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {isDevelopment} from '../util/URL';

const {height} = Dimensions.get('window');

export default class Utility {
  static showAlert(title, message) {
    Alert.alert(title, message), [{text: ALERT.BTN.OK}];
  }

  static showAlertWithPopAction(title, message) {
    Alert.alert(
      title,
      message,
      [{text: ALERT.BTN.OK, onPress: () => Actions.pop()}],
      {cancelable: false},
    );
  }

  static showAlertWithExitApp(title, message) {
    Alert.alert(
      title,
      message,
      [{text: ALERT.BTN.OK, onPress: () => BackHandler.exitApp()}],
      {cancelable: false},
    );
  }

  static validateEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  static myLog(...params) {
    if (isDevelopment) {
      console.log(...params);
    }
  }

  /**
   * Finds the device
   * @returns boolean value
   */
  static isiPhoneX() {
    if (height === 812) {
      // iPhone X / iPhone XS
      return true;
    } else if (height === 896) {
      // iPhone XS Max / iPhone XR
      return true;
    } else {
      return false;
    }
  }
  // // Store data to async storage
  // static storeKeyChainData = async (username, password) => {
  //   try {
  //     await Keychain.setGenericPassword(username, password);
  //   } catch (error) {
  //     console.log('keychain save error', error);
  //   }
  // };

  // // Fetch data from async storage
  // static retrieveKeyChainData = async () => {
  //   try {
  //     const credentials = await Keychain.getGenericPassword();
  //     console.log('credentials', credentials);
  //     if (credentials !== null && credentials !== undefined) {
  //       console.log('retrieveData value', credentials);
  //       return credentials;
  //     }
  //   } catch (error) {
  //     console.log('keychain get error', error);
  //   }
  // };

  // // delete data from async storage
  // static deleteKeyChain = async () => {
  //   try {
  //     await Keychain.resetGenericPassword();
  //   } catch (error) {
  //     console.log('Async get error', error);
  //   }
  // };

  // Store data to async storage
  static storeData = async (key, value) => {
    console.log('storeData value', value);
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log('Async save error', error);
    }
  };

  // Fetch data from async storage
  static retrieveData = async key => {
    try {
      console.log('retrieveData key', key);
      const value = await AsyncStorage.getItem(key);
      console.log('asyncStorageValue', value);
      if (value !== null && value !== undefined) {
        console.log('retrieveData value', value);
        return value;
      }
    } catch (error) {
      console.log('Async get error', error);
    }
  };
  //   // delete data from async storage
  //   static deleteAllData = async (key) => {
  //     console.log('Async deleteAllData key', key);

  //     try {
  //       for (let i = 0; i < key.length; i++) {
  //         let keyString = key[i];
  //         // eslint-disable-next-line no-await-in-loop
  //         const value = await AsyncStorage.removeItem(keyString);
  //         if (value == null && value == undefined) {
  //           return true;
  //         }
  //       }
  //     } catch (error) {
  //       console.log('Async get error', error);
  //     }
  //   }
  // }

  // delete data from async storage
  static deleteAllData = async key => {
    console.log('Async deleteAllData key', key);
    try {
      const value = await AsyncStorage.multiRemove(key);
      if (value == null && value === undefined) {
        return true;
      }
    } catch (error) {
      console.log('Async get error', error);
    }
    console.log('Done');
  };
}
/**
 * To show log if only isDevelopment is true
 * @param {*} params
 */
export function myLog(...params) {
  if (isDevelopment) {
    console.log(...params);
  }
}

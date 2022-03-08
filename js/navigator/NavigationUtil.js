import React, {Component} from 'react';
import {View} from 'react-native';

class NavigationUtil extends Component {
  /**
   * 重置到首页
   * @param params
   */
  static resetToHomePage(params) {
    const {navigation} = params;
    navigation.navigate('HomePage');
  }
}

export default NavigationUtil;

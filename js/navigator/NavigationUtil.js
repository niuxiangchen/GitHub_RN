import React, {Component} from 'react';

class NavigationUtil extends Component {
  /**
   *跳转到指定页面
   */
  static goPage(params, page) {
    const navigation = NavigationUtil.navigation;
    if (!navigation) {
      console.log('NavigationUtil.navigation can not be null');
    }
    navigation.navigate(page, {
      ...params,
    });
  }

  /**
   * 返回上一页
   * @param navigation
   */
  static goBack(navigation) {
    navigation.goBack();
  }

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

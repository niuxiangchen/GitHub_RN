import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';

class WelcomePage extends Component {
  componentDidMount() {
    this.timer = setTimeout(() => {
      //  跳转到首页
      NavigationUtil.resetToHomePage(this.props);
    }, 200);
  }
  componentWillUnMount() {
    //  页面销毁时，清空计时器
    this.timer && clearTimeout(this.timer);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default WelcomePage;

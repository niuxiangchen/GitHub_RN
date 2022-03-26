import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import {WebView} from 'react-native-webview';
import NavigationUtil from '../navigator/NavigationUtil';

const TRENDING_URL = 'https://github.com/';
type Props = {};
const THEME_COLOR = '#678';

export default class WebViewPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.params = this.props.route.params;
    this.title = this.params.title;
    this.url = this.params.url;
    this.state = {
      title: this.title,
      url: this.url,
      canGoBack: false,
    };
  }

  onBack() {
    if (this.state.canGoBack) {
      this.webView.goBack();
    } else {
      NavigationUtil.goBack(this.props.navigation);
    }
  }

  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url,
    });
  }

  render() {
    const {url, title} = this.state;
    let navigationBar = (
      <NavigationBar
        leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
        title={title}
        style={{backgroundColor: THEME_COLOR}}
      />
    );
    return (
      <View style={styles.container}>
        {navigationBar}
        <WebView
          ref={webView => (this.webView = webView)}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
          source={{uri: url}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});

import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import {WebView} from 'react-native-webview';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavigationUtil from '../navigator/NavigationUtil';

const TRENDING_URL = 'https://github.com/';
type Props = {};
const THEME_COLOR = '#678';

export default class DetailPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.params = this.props.route.params;
    const {projectModel} = this.params;
    console.log(this.props, 'this.props');
    console.log(this.params, 'params');
    console.log(projectModel, 'projectModel');
    let title;
    if (projectModel.repo || projectModel.repo_link) {
      this.url = projectModel.repo_link || TRENDING_URL + projectModel.repo;
      title = projectModel.repo;
    } else {
      this.url = projectModel.html_url || TRENDING_URL + projectModel.full_name;
      title = projectModel.full_name;
    }
    this.state = {
      title: title,
      url: this.url,
      canGoBack: false,
    };
  }
  renderRightButton() {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => {}}>
          <FontAwesome
            name={this.state.isFavorite ? 'star' : 'star-o'}
            size={20}
            style={{color: 'white', marginRight: 10}}
          />
        </TouchableOpacity>
      </View>
    );
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
        rightButton={this.renderRightButton()}
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

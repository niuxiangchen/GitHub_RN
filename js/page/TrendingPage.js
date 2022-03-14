import React, {Component} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import NavigationUtil from '../navigator/NavigationUtil';
import {connect} from 'react-redux';
import actions from '../actions';
import Toast from 'react-native-easy-toast';
import NavigationBar from '../common/NavigationBar';
import TrendingItem from '../common/TrendingItem';

const URL = `https://trendings.herokuapp.com/repo?lang=`;
const Tab = createMaterialTopTabNavigator();
const THEME_COLOR = '#678';
const tabNames = [{name: 'java'}, {name: 'c'}, {name: 'javascript'}];

class TrendingPage extends Component {
  constructor(props) {
    super(props);
    console.log(NavigationUtil.navigation);
  }

  //动态返回顶部tab栏
  // (map)初始值, 或者计算结束后的返回值 (item)当前元素
  //这个函数返回值是 {'Java': TrendingTabPage tabLabel={'Java'} />,
  //                 Android': TrendingTabPage tabLabel={'Android'} />}
  mapRoute = tabNames.reduce((map, item) => {
    const route = () => <TrendingTabPage tabLabel={item.name} />;
    return {
      ...map,
      [item.name]: route,
    };
  }, {});

  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    };
    let navigationBar = (
      <NavigationBar
        title={'趋势'}
        statusBar={statusBar}
        style={{backgroundColor: THEME_COLOR}}
      />
    );
    const {mapRoute} = this;
    return (
      <View style={styles.container}>
        {navigationBar}
        <Tab.Navigator>
          {
            // Object.keys() 方法会返回一个由一个给定对象的自身可枚举属性组成的数组
            // ['Java','Android'...]
            Object.keys(mapRoute).map(name => (
              <Tab.Screen name={name} component={mapRoute[name]} key={name} />
            ))
          }
        </Tab.Navigator>
      </View>
    );
  }
}

const pageSize = 10; //设为常量 防止修改

class TrendingTab extends Component<Props> {
  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
  }
  componentDidMount() {
    this.loadData();
  }

  //加载数据
  loadData(loadMore) {
    //从redux中获取这两个方法
    const {onRefreshTrending, onLoadMoreTrending} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMoreTrending(
        this.storeName,
        ++store.pageIndex,
        pageSize,
        store.items,
        callback => {
          this.refs.toast.show('没有更多了');
        },
      );
    } else {
      onRefreshTrending(this.storeName, url, pageSize);
    }
  }

  //返回state里保存的trending state对象
  _store() {
    //获取state容器里的
    const {trending} = this.props;
    let store = trending[this.storeName];
    if (!store) {
      //默认值
      store = {
        items: [],
        isLoading: false,
        projectModels: [], //要显示的数据
        hideLoadingMore: true, //默认隐藏加载更多
      };
    }
    return store;
  }

  //返回加工后的url
  genFetchUrl(key) {
    return URL + key + `&since=daily`;
  }

  renderItem(data) {
    const item = data.item;
    return (
      <TrendingItem
        item={item}
        onSelect={() => {
          this.refs.toast.show('没有更多了');
        }}
      />
    );
  }

  // 正在加载的指示器
  genIndicator() {
    return this._store().hideLoadingMore ? null : (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator style={styles.indicator} />
        <Text>正在加载更多</Text>
      </View>
    );
  }

  render() {
    let store = this._store();
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + (item.id || item.fullName)}
          refreshControl={
            <RefreshControl
              title={'Loading...'}
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={THEME_COLOR}
            />
          }
          ListFooterComponent={() => this.genIndicator()}
          onEndReached={() => {
            setTimeout(() => {
              if (this.canLoadMore) {
                this.loadData(true);
                this.canLoadMore = false;
              }
            }, 100);
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
          }}
        />
        <Toast ref={'toast'} position={'center'} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  trending: state.trending,
});

const mapDispatchToProps = dispatch => ({
  //刷新
  onRefreshTrending: (storeName, url, pageSize) =>
    dispatch(actions.onRefreshTrending(storeName, url, pageSize)),

  //加载更多
  onLoadMoreTrending: (storeName, pageIndex, pageSize, items, callBack) =>
    dispatch(
      actions.onLoadMoreTrending(
        storeName,
        pageIndex,
        pageSize,
        items,
        callBack,
      ),
    ),
});

const TrendingTabPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrendingTab);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabStyle: {
    // minWidth: 50 //fix minWidth会导致tabStyle初次加载时闪烁
    padding: 0,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white',
  },
  labelStyle: {
    fontSize: 13,
    margin: 0,
  },
  indicatorContainer: {
    alignItems: 'center',
  },
  indicator: {
    color: 'red',
    margin: 10,
  },
});

export default TrendingPage;

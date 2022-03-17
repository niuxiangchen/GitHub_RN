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
import PopularItem from '../common/PopularItem';
import Toast from 'react-native-easy-toast';
import NavigationBar from '../common/NavigationBar';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import FavoriteDao from '../expand/dao/FavoriteDao';
import FavoriteUtil from '../util/FavoriteUtil';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const Tab = createMaterialTopTabNavigator();
const THEME_COLOR = '#678';
const tabNames = [{name: 'Java'}, {name: 'Android'}, {name: 'ios'}];
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

class PopularPage extends Component {
  constructor(props) {
    super(props);
    console.log(NavigationUtil.navigation);
  }

  //动态返回顶部tab栏
  // (map)初始值, 或者计算结束后的返回值 (item)当前元素
  //这个函数返回值是 {'Java': PopularTabPage tabLabel={'Java'} />,
  //                 Android': PopularTabPage tabLabel={'Android'} />}
  mapRoute = tabNames.reduce((map, item) => {
    const route = () => <PopularTabPage tabLabel={item.name} />;
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
        title={'最热'}
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

class PopularTab extends Component<Props> {
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
    const {onRefreshPopular, onLoadMorePopular} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMorePopular(
        this.storeName,
        ++store.pageIndex,
        pageSize,
        store.items,
        favoriteDao,
        callback => {
          this.refs.toast.show('没有更多了');
        },
      );
    } else {
      onRefreshPopular(this.storeName, url, pageSize, favoriteDao);
    }
  }

  //返回state里保存的popular state对象
  _store() {
    //获取state容器里的
    const {popular} = this.props;
    let store = popular[this.storeName];
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
    return URL + key + QUERY_STR;
  }

  renderItem(data) {
    const item = data.item;
    return (
      <PopularItem
        projectModel={item}
        onSelect={callback => {
          NavigationUtil.goPage(
            {
              projectModel: item,
              flag: FLAG_STORAGE.flag_popular,
              callback,
            },
            'DetailPage',
          );
        }}
        onFavorite={(item, isFavorite) =>
          FavoriteUtil.onFavorite(
            favoriteDao,
            item,
            isFavorite,
            FLAG_STORAGE.flag_popular,
          )
        }
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
          keyExtractor={item => '' + item.item.id}
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
  popular: state.popular,
});

const mapDispatchToProps = dispatch => ({
  //刷新
  onRefreshPopular: (storeName, url, pageSize, favoriteDao) =>
    dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao)),

  //加载更多
  onLoadMorePopular: (
    storeName,
    pageIndex,
    pageSize,
    items,
    callBack,
    favoriteDao,
  ) =>
    dispatch(
      actions.onLoadMorePopular(
        storeName,
        pageIndex,
        pageSize,
        items,
        favoriteDao,
        callBack,
      ),
    ),
});

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);

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

export default PopularPage;

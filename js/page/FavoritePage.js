import React, {Component} from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import NavigationUtil from '../navigator/NavigationUtil';
import {connect} from 'react-redux';
import actions from '../actions';
import Toast from 'react-native-easy-toast';
import NavigationBar from '../common/NavigationBar';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import FavoriteDao from '../expand/dao/FavoriteDao';
import FavoriteUtil from '../util/FavoriteUtil';
import PopularItem from '../common/PopularItem';
import TrendingItem from '../common/TrendingItem';
import EventTypes from '../util/EventTypes';
import EventBus from 'react-native-event-bus';

const Tab = createMaterialTopTabNavigator();
const THEME_COLOR = '#678';
const tabNames = [
  {name: '最热', flag: FLAG_STORAGE.flag_popular},
  {name: '趋势', flag: FLAG_STORAGE.flag_trending},
];

class FavoritePage extends Component {
  constructor(props) {
    super(props);
    console.log(NavigationUtil.navigation);
  }

  //动态返回顶部tab栏
  // (map)初始值, 或者计算结束后的返回值 (item)当前元素
  //这个函数返回值是 {'Java': FavoriteTabPage tabLabel={'Java'} />,
  //                 Android': FavoriteTabPage tabLabel={'Android'} />}
  mapRoute = tabNames.reduce((map, item) => {
    const route = () => (
      <FavoriteTabPage tabLabel={item.name} flag={item.flag} />
    );
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
        title={'收藏'}
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

class FavoriteTab extends Component<Props> {
  constructor(props) {
    super(props);
    const {flag} = this.props;
    this.storeName = flag;
    this.favoriteDao = new FavoriteDao(flag);
    console.log(this.props, 'this.props');
    console.log(flag, 'flag');
  }

  componentDidMount() {
    this.loadData(true);
    EventBus.getInstance().addListener(
      EventTypes.bottom_tab_select,
      (this.listener = data => {
        //收藏tab位于第3个位置
        if (data.to === 2) {
          this.loadData(false);
        }
      }),
    );
  }

  componentWillUnMount() {
    EventBus.getInstance().removeListener(this.listener);
  }

  //加载数据
  loadData(isShowLoading) {
    const {onLoadFavoriteData} = this.props;
    onLoadFavoriteData(this.storeName, isShowLoading);
  }

  /**
   * 获取与当前页面有关的数据
   * @returns {*}
   * @private
   */
  _store() {
    const {favorite} = this.props;
    let store = favorite[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [], //要显示的数据
      };
    }
    return store;
  }

  onFavorite(item, isFavorite) {
    FavoriteUtil.onFavorite(
      this.favoriteDao,
      item,
      isFavorite,
      this.props.flag,
    );
    if (this.storeName === FLAG_STORAGE.flag_popular) {
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular);
    } else {
      EventBus.getInstance().fireEvent(EventTypes.favoriteChanged_trending);
    }
  }

  renderItem(data) {
    const item = data.item;
    const Item =
      this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
    return (
      <Item
        projectModel={item}
        onSelect={callback => {
          NavigationUtil.goPage(
            {
              projectModel: item,
              flag: this.storeName,
              callback,
            },
            'DetailPage',
          );
        }}
        onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
      />
    );
  }

  render() {
    let store = this._store();
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + (item.item.id || item.item.fullName)}
          refreshControl={
            <RefreshControl
              title={'Loading...'}
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData(true)}
              tintColor={THEME_COLOR}
            />
          }
        />
        <Toast ref={'toast'} position={'center'} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  favorite: state.favorite,
});

const mapDispatchToProps = dispatch => ({
  //将 dispatch(onRefreshPopular(storeName, url))绑定到props
  onLoadFavoriteData: (storeName, isShowLoading) =>
    dispatch(actions.onLoadFavoriteData(storeName, isShowLoading)),
});

const FavoriteTabPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FavoriteTab);

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

export default FavoritePage;

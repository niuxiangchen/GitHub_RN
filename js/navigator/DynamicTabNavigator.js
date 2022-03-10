//在这里配置页面的路由
import PopularPage from '../page/PopularPage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TrendingPage from '../page/TrendingPage';
import FavoritePage from '../page/FavoritePage';
import MyPage from '../page/MyPage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {connect} from 'react-redux';

const Tab = createBottomTabNavigator();

const TABS = {
  _PopularPage: {
    name: 'PopularPage',
    component: {PopularPage},
    options: {
      tabBarLabel: '最热',
      tabBarIcon: ({color, size}) => (
        <MaterialIcons name={'whatshot'} size={26} />
      ),
    },
  },
  _TrendingPage: {
    name: 'TrendingPage',
    component: {TrendingPage},
    options: {
      tabBarLabel: '趋势',
      tabBarIcon: ({color, size}) => (
        <MaterialIcons name={'trending-up'} size={26} />
      ),
    },
  },
  _FavoritePage: {
    name: 'FavoritePage',
    component: {FavoritePage},
    options: {
      tabBarLabel: '收藏',
      tabBarIcon: ({color, size}) => (
        <MaterialIcons name={'favorite'} size={26} />
      ),
    },
  },
  _MyPage: {
    name: 'MyPage',
    component: {MyPage},
    options: {
      tabBarLabel: '我的',
      tabBarIcon: ({color, size}) => (
        <MaterialIcons name={'person'} size={26} />
      ),
    },
  },
};

function DynamicTabNavigator(props) {
  const {_PopularPage, _TrendingPage, _FavoritePage, _MyPage} = TABS;
  console.log(props);
  return (
    <NavigationContainer
      independent={true}
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: props.theme,
        },
      }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Tab.Screen
          name={_PopularPage.name}
          component={PopularPage}
          options={_PopularPage.options}
        />
        <Tab.Screen
          name="TrendingPage"
          component={TrendingPage}
          options={_TrendingPage.options}
        />
        <Tab.Screen
          name="FavoritePage"
          component={FavoritePage}
          options={_FavoritePage.options}
        />
        <Tab.Screen
          name="MyPage"
          component={MyPage}
          options={_MyPage.options}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const mapStateToProps = state => ({
  theme: state.theme.theme,
});

export default connect(mapStateToProps)(DynamicTabNavigator);

import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import FavoritePage from '../page/FavoritePage';
import MyPage from '../page/MyPage';
import PopularPage from '../page/PopularPage';
import TrendingPage from '../page/TrendingPage';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const Tab = createBottomTabNavigator();
class HomePage extends Component {
  render() {
    // const Tab = this._tabNavigator();
    return (
      <NavigationContainer independent={true}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Tab.Screen
            name="PopularPage"
            component={PopularPage}
            options={{
              tabBarLabel: '最热',
              tabBarIcon: ({color, size}) => (
                <MaterialIcons name={'whatshot'} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="TrendingPage"
            component={TrendingPage}
            options={{
              tabBarLabel: '趋势',
              tabBarIcon: ({color, size}) => (
                <MaterialIcons name={'trending-up'} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="FavoritePage"
            component={FavoritePage}
            options={{
              tabBarLabel: '收藏',
              tabBarIcon: ({color, size}) => (
                <MaterialIcons name={'favorite'} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="MyPage"
            component={MyPage}
            options={{
              tabBarLabel: '我的',
              tabBarIcon: ({color, size}) => (
                <MaterialIcons name={'person'} size={26} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
export default HomePage;

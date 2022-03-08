// In App.js in a new project

import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomePage from '../page/HomePage';
import FavoritePage from '../page/FavoritePage';
import MyPage from '../page/MyPage';
import PopularPage from '../page/PopularPage';
import TrendingPage from '../page/TrendingPage';
import WelcomePage from '../page/WelcomePage';

const Stack = createNativeStackNavigator();

function AppNavigators() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="WelcomePage" component={WelcomePage} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="FavoritePage" component={FavoritePage} />
        <Stack.Screen name="MyPage" component={MyPage} />
        <Stack.Screen name="PopularPage" component={PopularPage} />
        <Stack.Screen name="TrendingPage" component={TrendingPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigators;

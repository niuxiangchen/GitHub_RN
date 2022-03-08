import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';

class TrendingPage extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>TrendingPage</Text>
      </View>
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
export default TrendingPage;

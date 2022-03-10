import React, {useEffect} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import actions from '../actions';

function TrendingPage(props) {
  useEffect(() => {
    console.log(props.theme);
  });
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>TrendingPage</Text>
      <Button
        title={'修改主题'}
        onPress={() => props.onThemeChange('orange')}
      />
    </View>
  );
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

const mapDispatchToProps = dispatch => ({
  onThemeChange: theme => dispatch(actions.onThemeChange(theme)),
});
export default connect(null, mapDispatchToProps)(TrendingPage);

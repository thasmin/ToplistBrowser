/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

'use strict';

import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DrawerNavigator, StackNavigator } from 'react-navigation';

import styles from './Styles';
import HomeScreen from './HomeScreen';
import DetailsScreen from './DetailsScreen';

class PlainScreen extends React.Component {
  static navigationOptions = {
    title: 'Plain2',
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Plain Screen</Text>
        <Button
          title="Open Drawer"
          onPress={() => this.props.navigation.navigate('details')}
        />
      </View>
    )
  }
}

const defaultNavigationOptions = {
  headerStyle: { backgroundColor: '#f4511e' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold' },
};

const StackNav = StackNavigator(
  {
    plain: { screen: PlainScreen },
    details: { screen: DetailsScreen }
  },
  {
    navigationOptions: ({navigation}) => ({
      headerLeft: <Icon name="menu" size={35} color="#ffffff" style={styles.drawerIcon} onPress={() => navigation.navigate('DrawerOpen')} />,
      headerStyle: { backgroundColor: '#f4511e' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    })
  }
);

const HomeNavigation = StackNavigator(
  {
    home: { screen: HomeScreen },
    details: { screen: DetailsScreen }
  },
  {
    navigationOptions: ({ navigation }) => ({
      headerStyle: { backgroundColor: '#f4511e' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    })
  }
);

const DrawerNav = DrawerNavigator(
  {
    home: { screen: HomeNavigation },
    stacknav: { screen: StackNav },
  },
  {
    initialRouteName: 'home',
    contentOptions: {
      activeTintColor: '#f4511e'
    }
  }
)

export default class App extends React.Component {
  render() {
    return <DrawerNav />;
  }
}

'use strict';

import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import styles from './Styles';
import iTunes from './ITunes';

const { height, width } = Dimensions.get('window');
const itemWidth = (width - 16) / 2;

const localStyles = StyleSheet.create({
  itemStyle: {
    width: itemWidth,
    padding: 5,
    alignItems: 'center',
  },
  itemTitle: {
    textAlign: 'center'
  }
});

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigate, navigation }) => ({
    title: 'Top Audio Podcasts',
    headerLeft: <Icon
      name="menu"
      size={35}
      color="#ffffff"
      style={styles.drawerIcon}
      onPress={() => navigation.navigate('DrawerOpen')} />,
  });

  componentWillMount() {
    this.setState({feed: null});
  }

  componentDidMount() {
    iTunes.loadToplist().then( toplist => this.setState({feed: toplist}) );
  }

  render() {
    if (this.state.feed == null)
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
          <ActivityIndicator size="large" color="#f4511e" />
        </View>
      )

    return (
      <View style={styles.container}>
        <FlatList
          data={ this.state.feed.entry }
          keyExtractor={ item => item.id.attributes['im:id'] }
          numColumns={2}
          renderItem={({item}) => this._renderItem(item)}
        />
      </View>
    )
  }

  _onItemPress(podcast) {
    this.props.navigation.navigate('details', { podcast });
  }

  _renderItem(podcast) {
    return (
      <TouchableOpacity onPress={() => { this._onItemPress(podcast) }}>
        <View style={localStyles.itemStyle}>
          <Image
            style={{ width: 170, height: 170 }}
            source={{ uri: podcast["im:image"][2].label }}
          />
          <Text style={localStyles.itemTitle}>{podcast.title.label}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default HomeScreen;
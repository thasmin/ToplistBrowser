'use strict';

import React from 'react';
import {
  Text,
  View,
  Button,
  Image,
  FlatList,
  ActivityIndicator,
  Linking,
} from 'react-native';

import styles from './Styles';
import ITunes from './ITunes';

function child(node, childName) {
  return node.getElementsByTagName(childName)[0];
}

function val(node, childName) {
  const childNode = child(node, childName);
  return childNode ? childNode.value : 'invalid child value';
}

class DetailsScreen extends React.Component {
  constructor(params) {
    super(params);
  }

  static navigationOptions = ({ navigation, navigationOptions }) => {
    const podcast = navigation.state.params.podcast;
    return {
      title: podcast.title.label,
    };
  };

  componentWillMount() {
    this.props.navigation.setParams({ increaseItemId: this._increaseItemId });
    this.setState({ itemId: this.props.navigation.state.params.itemId || 0 });

    ITunes.loadPodcast(this.props.navigation.state.params.podcast.link.attributes.href)
      .then(rssUrl => {
        this.setState({rssUrl})
        ITunes.loadEpisodes(rssUrl)
          .then(feed => {
            this.setState({
              channel: feed.children[0],
              episodes: feed.children[0].getElementsByTagName('item')
            })
          })
          .catch(e => console.error(e));
      })
      .catch(e => console.error(e));
  }

  state = {
    rssUrl: '',
    episodes: [],
    channel: null,
    itemId: 0,
  }

  _increaseItemId = () => {
    this.setState({ itemId: this.state.itemId + 1 });
  }

  render() {
    if (this.state.channel == null)
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
          <ActivityIndicator size="large" color="#f4511e" />
        </View>
      )

    const podcast = this.props.navigation.state.params.podcast;

    return (
      <View>
        <View style={{flexDirection:'row'}}>
            <Image
              style={{ flexBasis: 170, width: 170, height: 170, marginRight: 10 }}
              source={{ uri: podcast["im:image"][2].label }}
            />
            <View style={{flexGrow:1, flexShrink:1, alignItems:'center'}}>
              <Text style={{fontSize:24}}>{val(this.state.channel, 'title')}</Text>
              <Text style={{marginBottom:5}}>{val(this.state.channel, 'description')}</Text>
            </View>
        </View>
        <Text style={{fontSize:18, textAlign:'center'}}>Episodes</Text>
        <FlatList
          data={this.state.episodes}
          keyExtractor={ (item, index) => ''+index }
          renderItem={({item}) => this._renderEpisode(item)}
        />
      </View>
    )
  }

  _renderEpisode(episode) {
    const enclosure = child(episode, 'enclosure');
    const enclosureUrl = enclosure ? enclosure.attributes['url'] : '';
    return (
      <View style={[styles.cardContainer, styles.card]}>
        <Text>{val(episode, 'title')}</Text>
        <Text>{val(episode, 'pubDate')}</Text>
      </View>
    );
  }
}

export default DetailsScreen;
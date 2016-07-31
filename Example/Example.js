import React, {
  PropTypes,
  Component,
} from 'react'

import {
 StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native'

import { EmojiOverlay } from '../'
// var {EmojiOverlay} = require('../')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  emoji: {
    fontSize: 50,
    textAlign: 'center',
    margin: 50,
    color: 'black'
  },
});


class Example extends Component {
  state = {
    selectedEmoji: null,
    showPicker: false,
  };

  _emojiSelected = emoji => {
    this.setState({
      selectedEmoji: emoji,
      showPicker: false,
    });
  }

  render() {
    return (
      <View style={styles.container}>

        <TouchableHighlight
          onPress={() => this.setState({showPicker: true})}>
          <Text style={styles.emoji}>
            {this.state.selectedEmoji || 'no emoji selected'}
          </Text>
        </TouchableHighlight>

        <EmojiOverlay
          style={{
            height: 400,
            backgroundColor: '#f4f4f4'
          }}
          horizontal={true}
          visible={this.state.showPicker}
          onEmojiSelected={this._emojiSelected.bind(this)}
          onTapOutside={() => this.setState({showPicker: false})} />

      </View>
    );
  }
};

module.exports = Example

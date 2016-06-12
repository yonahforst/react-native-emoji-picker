'use strict'
import React, {
  PropTypes,
} from 'react'

import {
  StyleSheet,
  ListView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'

import emoji from 'emojilib'

const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

const EmojiPicker = (props) => {
  let contentStyle = {}

  if (props.horizontal) {
    contentStyle.flexDirection = 'column'
    contentStyle.flex = 1
  } else {
    contentStyle.flexDirection = 'row'
  }

  return (
    <View style={props.style}>
      <ListView
        dataSource={dataSource.cloneWithRows(emoji.ordered)}
        contentContainerStyle={[styles.container, contentStyle]}
        renderRow={name => EmojiButton(name, props.onEmojiSelected)}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal={props.horizontal}
        initialListSize={50}
        pageSize={5}
        scrollRenderAheadDistance={500}
        {...props.listViewProps}
        />
      {props.hideClearButton ? null : ClearButon(props)}
    </View>
  )
}

const ClearButon = props => {
  return (
    <Text 
      style={styles.clearButton}
      onPress={() => props.onEmojiSelected(null)}>
      {props.clearButtonText || 'Clear'}
    </Text>
  )
}

const EmojiButton = (name, onPress) => {
  let char = emoji.lib[name].char
  return (
    <Text 
      style={styles.text}
      onPress={() => onPress(char)}
      key={name}>{char}</Text>
  )
}

let styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 20,
    padding: 10,
  },
  clearButton: {
    padding: 15,
    textAlign: 'center',
  }
})
EmojiPicker.propTypes = {
  onEmojiSelected: PropTypes.func.isRequired,
}

module.exports = EmojiPicker
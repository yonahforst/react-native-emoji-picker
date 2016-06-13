'use strict'
import React, {
  PropTypes,
} from 'react'

import {
  StyleSheet,
  ListView,
  Text,
  TouchableOpacity,
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
        initialListSize={80}
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


export const EmojiOverlay = props => (
  <View style={[styles.absolute, props.visible ? styles.visible : styles.hidden]}>
    <TouchableOpacity style={styles.absolute} onPress={props.onTapOutside}>
      <View style={styles.background} />
    </TouchableOpacity>
    <View>
      {props.visible ? <EmojiPicker {...props}/> : null}
    </View>
  </View>
)

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
  },
  absolute: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  visible: {
    top: 0,
    flex: 1,
    justifyContent: 'center',
  },
  hidden: {
    top: 1000,
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: 'grey',
    opacity: 0.5,
  },
})

EmojiPicker.propTypes = {
  onEmojiSelected: PropTypes.func.isRequired,
}

export default EmojiPicker

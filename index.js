'use strict'
import React, {
  PropTypes,
} from 'react'

import {
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import emoji from 'emojilib'

const letterSpacing = 10
const defaultEmojiSize = 30

const EmojiPicker = (props) => {
  let container = []
  let rowCount = props.rows || 7
  let ordered = emoji.ordered
  for (var i = 0; i < rowCount; i++) {
    let row = []
    for (var n = 0; n < ordered.length/rowCount; n++) {
      let index = i + n * rowCount + 1
      if (index < ordered.length) {
        row.push(ordered[index])  
      }
    }
    container.push(row)
  }

  return (
    <View style={props.style}>
      <ScrollView horizontal={true}>
        <View style={styles.innerContainer}>
          {container.map(array => <Row {...props} array={array} key={array[0]} />)}
        </View>
      </ScrollView>
      {props.hideClearButton ? null : <ClearButon {...props} />}
    </View>
  )
}

const Row = props => {
  let size = props.emojiSize || defaultEmojiSize

  function handlePress(event) {
    let i = Math.floor(event.nativeEvent.locationX/(size + 5 + letterSpacing/2))
    let name = props.array[i]
    props.onEmojiSelected(emoji.lib[name].char)
  }

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View>
        <Text style={[styles.rowText, {fontSize: size}]} >
          {props.array.map(name => emoji.lib[name].char)}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  )
}
const ClearButon = props => {
  return (
    <TouchableOpacity 
      onPress={() => props.onEmojiSelected(null)}>
      <Text style={styles.clearButton}>
        {props.clearButtonText || 'Clear'}
      </Text>
    </TouchableOpacity>
  )
}

const EmojiOverlay = props => (
  <View style={[styles.absolute, props.visible ? styles.visible : styles.hidden]}>
    <TouchableOpacity style={styles.absolute} onPress={props.onTapOutside}>
      <View style={styles.background} />
    </TouchableOpacity>
    {props.visible ? <EmojiPicker {...props}/> : null}
  </View>
)

let styles = StyleSheet.create({
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
  innerContainer: {
    flexWrap: 'wrap', 
    flexDirection: 'column',
  },
  rowText: {
    letterSpacing: letterSpacing,
    paddingHorizontal: 5,
  }
})

EmojiPicker.propTypes = {
  onEmojiSelected: PropTypes.func.isRequired,
}

export { EmojiPicker as default, EmojiOverlay as EmojiOverlay }
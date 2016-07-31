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
  Platform,
} from 'react-native'

import emoji from 'emoji-datasource'

import {
  groupBy,
  orderBy,
  includes,
} from 'lodash/collection'

import {
  mapValues,
} from 'lodash/object'

//polyfil for android
require('string.fromcodepoint');

// i dont understand ANY of this but there's somethign called codepoints and surrogate pairs
// and this converts utf16 to a charachter in javascript. see more here:
//https://mathiasbynens.be/notes/javascript-unicode
//https://mathiasbynens.be/notes/javascript-escapes#unicode-code-point
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint
const charFromUtf16 = utf16 => String.fromCodePoint(...utf16.split('-').map(u => '0x' + u))
const charFromEmojiObj = obj => charFromUtf16(obj.unified)
const blacklistedEmojis = ['white_frowning_face', 'keycap_star', 'eject']


const isAndroid = Platform.OS == 'android'
const letterSpacing = 10
const defaultEmojiSize = 30
const categories = ['People', 'Nature', 'Foods', 'Activity', 'Places', 'Objects', 'Symbols', 'Flags']
const filteredEmojis = emoji.filter(e => isAndroid ? !!e.google : !includes(blacklistedEmojis, e.short_name))
// sort emojis by 'sort_order' then group them into categories
const groupedAndSorted = groupBy(orderBy(filteredEmojis, 'sort_order'), 'category')
// convert the emoji object to a character
const emojisByCategory = mapValues(groupedAndSorted, group => group.map(charFromEmojiObj))


const EmojiPicker = (props) => {

  // instead listing emojis left-to-right we want to list them top-to-bottom.
  // we split them in to rows by sequentially taking every Xth value, where X is the number of rows
  function transposeEmojisVertically(emojis, rowCount = 7) {
    let array = []
    for (var i = 0; i < rowCount; i++) {
      let row = []
      for (var n = 0; n < emojis.length/rowCount; n++) {
        let index = i + n * rowCount
        if (index < emojis.length) {
          row.push(emojis[index])
        }
      }
      array.push(row)
    }
    return array
  }

  function renderSectionForCategory(c) {
    let emojis = transposeEmojisVertically(emojisByCategory[c])
    return (
     <View key={c} style={styles.innerContainer}>
        <Text style={[styles.headerText, props.headerStyle]}>{c}</Text>
        {emojis.map(array => <Row {...props} array={array} key={array[0]} />)}
      </View>
    )
  }

  return (
    <View style={props.style}>
      <ScrollView horizontal={true}>
        {categories.map(renderSectionForCategory)}
      </ScrollView>
      {props.hideClearButton ? null : <ClearButon {...props} />}
    </View>
  )
}

const Row = props => {
  let size = props.emojiSize || defaultEmojiSize

  function handlePress(event) {
    let i = Math.floor(event.nativeEvent.locationX/(size + 5 + letterSpacing/2))
    if (i < props.array.length) {
      let emoji = props.array[i]
      props.onEmojiSelected(emoji)  
    }
  }

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View>
        <Text style={[styles.rowText, {fontSize: size}]} >
          {props.array}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

const ClearButon = props => {
  return (
    <TouchableOpacity 
      onPress={() => props.onEmojiSelected(null)}>
      <Text style={[styles.clearButton, props.clearButtonStyle]}>
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
    color: 'black',
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
    color: 'black',
  },
  headerText: {
    padding: 5,
    color: 'black',
  }
})

EmojiPicker.propTypes = {
  onEmojiSelected: PropTypes.func.isRequired,
}

export { EmojiPicker as default, EmojiOverlay as EmojiOverlay }
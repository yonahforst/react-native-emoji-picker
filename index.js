'use strict'
import React, {
  PropTypes,
  Component,
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
const filteredEmojis = emoji.filter(e => isAndroid ? !!e.google : !includes(blacklistedEmojis, e.short_name))
// sort emojis by 'sort_order' then group them into categories
const groupedAndSorted = groupBy(orderBy(filteredEmojis, 'sort_order'), 'category')
// convert the emoji object to a character
const emojisByCategory = mapValues(groupedAndSorted, group => group.map(charFromEmojiObj))

const CATEGORIES = ['People', 'Nature', 'Foods', 'Activity', 'Places', 'Objects', 'Symbols', 'Flags']


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


class EmojiPicker extends Component {
  state = {
    categories: CATEGORIES.slice(0, 1),
  }

  componentWillUnmount() {
    clearTimeout(this._timeout)
    this.setState({isVisible: false})
  }



  loadNextCategory() {
    if (this.state.categories.length < CATEGORIES.length) {
      this.setState({categories: CATEGORIES.slice(0, this.state.categories.length + 1)})
    }
  }

  renderSectionForCategory(category) {
    return (
      <EmojiCategory 
        {...this.props}
        key={category}
        category={category}
        finishedLoading={() => this._timeout = setTimeout(this.loadNextCategory.bind(this), 100)} />
      )
  }

  render() {
    return (
      <View style={this.props.style}>
        <ScrollView horizontal={true}>
          {this.state.categories.map(this.renderSectionForCategory.bind(this))}
        </ScrollView>
        {this.props.hideClearButton ? null : <ClearButon {...this.props} />}
      </View>
    )
  }

}

class EmojiCategory extends Component {
  componentDidMount() {
    this.props.finishedLoading()
  }

  render() {
    let emojis = transposeEmojisVertically(emojisByCategory[this.props.category])
    let Component = Platform.OS == 'android' ? RowAndroid : RowIos
    return (
     <View key={this.props.category} style={styles.innerContainer}>
        <Text style={[styles.headerText, this.props.headerStyle]}>{this.props.category}</Text>
        {emojis.map(array => <Component {...this.props} array={array} key={array[0]} />)}
      </View>
    )
  }
}

const RowIos = props => {
  let size = props.emojiSize || defaultEmojiSize

  function handlePress(event) {
    let i = Math.floor(event.nativeEvent.locationX/(size + 5 + letterSpacing/2))
    if (i < props.array.length) {
      let emoji = props.array[i]
      props.onEmojiSelected(emoji)  
    }
  }

  let style = {
    size: size,
    letterSpacing: letterSpacing,
    color: 'black',
  }

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View>
        <Text style={style} >
          {props.array}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

const RowAndroid = props => {
  let size = props.emojiSize || defaultEmojiSize

  let style = {
      fontSize: size-4,
      color: 'black',
      height: size+4,
      width: size+4,
      textAlign: 'center',
    }

  return (
      <View style={styles.rowStyle}>
        {props.array.map(emoji => 
          <Text 
            key={emoji} 
            style={style} 
            onPress={() => props.onEmojiSelected(emoji)}>
            {emoji}
          </Text>
        )}
      </View>
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
    justifyContent: 'center',
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
  headerText: {
    padding: 5,
    color: 'black',
    justifyContent: 'center',
  },
  rowStyle: {
    flexDirection: 'row',
    paddingHorizontal: letterSpacing/2,
  }
})

EmojiPicker.propTypes = {
  onEmojiSelected: PropTypes.func.isRequired,
}

export { EmojiPicker as default, EmojiOverlay as EmojiOverlay }
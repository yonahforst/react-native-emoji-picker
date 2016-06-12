## Emoji picker for react-native
Powered by the awesome `emojilib`

### Installation
```bash
npm install react-native-emoji-picker
```

### Usage example
```javascript
const EmojiPicker = require('react-native-emoji-picker');

class Overlay extends React.Component {
  _emojiSelected(emoji) {
    console.log(emoji)
  }

  render() {
    return (
      <View style={styles.container}>
        <EmojiPicker 
          style={styles.emojiPicker} 
          horizontal={true}
          onEmojiSelected={this._emojiSelected}/>
      </View>
    );
  }
}

```

### Component props
- `onEmojiSelected` (Function) - Required. Called when the user taps on an emoji.
- `horizontal` (Bool) - Optional. Should the list of emojis scroll horizontally or vertically (default)
- `style` (Object) - Optional. Standard view style for the enclosing component
- `clearButtonText` (String) - Optional. Alternate text for the clear button. Defaults to 'Clear'.
- `hideClearButton` (Bool) - Optional. Hide the clear button. 
- `listViewProps` (Object) - Optional. Override default ListView props.

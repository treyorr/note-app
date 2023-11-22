import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

export function EmojiSelect({ close, setCode }) {
  function handleClick(shortcodes) {
    setCode(shortcodes)
    close()
  }
  return <Picker data={data} onEmojiSelect={(emoji) => handleClick(emoji.shortcodes)} />
}

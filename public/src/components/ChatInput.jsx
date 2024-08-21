import React, { useState } from 'react'
import Picker from "emoji-picker-react"
import { BsEmojiSmileFill } from "react-icons/bs"
import { IoMdSend } from "react-icons/io"
import ChatInputCssContainer from '../componentsCss/ChatInputCssContainer'

export default function ChatInput({handleSendMsg}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  }

  const sendChat = (event) => {
    event.preventDefault();
    if(msg.length>0) {
      handleSendMsg(msg);
      setMsg('')
    }
  }

  return (
    <ChatInputCssContainer>
      <div className="button-container">
        <div className="emoji">
            <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
          <div className="emoji-picker-react">
             {showEmojiPicker && <Picker theme="dark" onEmojiClick={(emojiObject)=> setMsg((prevMsg)=> prevMsg + emojiObject.emoji)}/>} 
          </div>
        </div>
      </div>
      <form className="input-container" onSubmit={(e)=>sendChat(e)} >
        <input  
          type="text" 
          placeholder='Type your message here' 
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
          />
        <button className='submit'>
          <IoMdSend />
        </button>
      </form>
    </ChatInputCssContainer>

  )
}

import React from 'react'
import Hello from '../assets/hello.gif'
import WelcomePageContainerCss from '../componentsCss/WelcomePageContainerCss'

export default function Welcome({currentUser}) {
  return (
    <WelcomePageContainerCss>
        <img src={Hello} alt="hello" />
        <h1>
            Welcome, <span> {currentUser && currentUser.username}</span>
        </h1>
        <h3>Please select a chat to Start Messaging</h3>
    </WelcomePageContainerCss>
  )
}

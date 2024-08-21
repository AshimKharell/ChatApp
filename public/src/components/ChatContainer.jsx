import React, { useEffect, useState, useRef } from "react";
import ChatContainerCss from "../componentsCss/ChatContainerCss";
import Logout from "./Logout";
import ChatInput from "./ChatInput";
import axios from "axios";
import { sendMessageRoute, getAllMessageRoute } from "../utils/APIRoutes";
import { v4 as uuidv4 } from "uuid";
import debounce from 'lodash/debounce';

export default function ChatContainer({ currentChat, currentUser, socket = [], setNotification, notification }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChat) {
        const response = await axios.post(getAllMessageRoute, {
          from: currentUser._id,
          to: currentChat._id,
        });
        setMessages(response.data);
      }
    };

    fetchMessages();
  }, [currentChat, currentUser]);

  const handleSendMsg = async (msg) => {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
    });
    const messageData = {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
    };

    console.log("Emitting message:", messageData);

    socket.current.emit("send-msg", messageData);
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  // Debounced notification handler to prevent rapid updates
  const debouncedHandleNotification = useRef(
    debounce((msg) => {
      setNotification((prev) => [...prev, { from: msg.from, content: msg.message }]);
    }, 1000) // Adjust debounce time as needed
  ).current;

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        console.log("Received message:", msg);
        if (currentChat && msg.from === currentChat._id) {
          setArrivalMessage({ fromSelf: false, message: msg });
        } else {
          // Use debounced handler for notifications
          debouncedHandleNotification(msg);
        }
      });
    }

    return () => {
      if (socket.current) {
        socket.current.off("msg-recieve");
      }
    };
  }, [socket, currentChat, setNotification, debouncedHandleNotification]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ChatContainerCss>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt="avatar"
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={uuidv4()} ref={scrollRef}>
            <div
              className={`message ${message.fromSelf ? "sended" : "received"}`}
            >
              <div className="content">
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ChatInput handleSendMsg={handleSendMsg} />
    </ChatContainerCss>
  );
}

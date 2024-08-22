import React, { useEffect, useState, useRef } from 'react';
import HomePageContainerCss from '../componentsCss/HomePageContainerCss';
import Welcome from '../components/Welcome';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { allUsersRoute, host } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import ChatContainer from '../components/ChatContainer';
import { io } from 'socket.io-client';

export default function Chat() {
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [notification, setNotification] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!localStorage.getItem('chat-app-user')) {
        navigate("/login");
      } else {
        const user = await JSON.parse(localStorage.getItem("chat-app-user"));
        setCurrentUser(user);
      }
    };
    fetchCurrentUser();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id)
    }
  }, [currentUser])

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        } else {
          navigate('/setAvatar');
        }
      }
    };
    fetchContacts();
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  }

  return (
    <HomePageContainerCss style={{ margin: '-8px' }}>
      <div className="container">
        <Contacts 
          contacts={contacts} 
          currentUser={currentUser} 
          changeChat={handleChatChange}
          notification={notification}
          setNotification={setNotification}
        />
        {
          currentChat === undefined ? (
            <Welcome currentUser={currentUser} />
          ) : (
            <ChatContainer 
              currentChat={currentChat} 
              currentUser={currentUser} 
              socket={socket} 
              notification={notification}
              setNotification={setNotification}
            />
          )
        }
      </div>
    </HomePageContainerCss>
  );
}

import React, { useState, useEffect } from 'react';
import Logo from '../assets/chatting-app.png';
import ContactContainerCss from '../componentsCss/ContactContainerCss';

export default function Contacts({ contacts, currentUser, changeChat, notification = [], setNotification }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    if (currentUser) {
      setCurrentUserImage(currentUser.avatarImage);
      setCurrentUserName(currentUser.username);
    }
  }, [currentUser]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);

    // Clear notifications for the selected contact
    setNotification(prev => prev.filter(notif => notif.from !== contact._id));
  };

  // Count the number of messages from a specific contact
  const getNotificationCount = (contactId) => {
    return notification.filter(notif => notif.from === contactId).length;
  };

  return (
    <>
      {currentUserImage && currentUserName && (
        <ContactContainerCss>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>Instant Talk</h3>
          </div>

          <div className="contacts">
            {contacts.map((contact, index) => (
              <div
                key={index}
                className={`contact ${index === currentSelected ? "selected" : ""}`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className="avatar">
                  <img
                    src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                    alt='avatar'
                  />
                </div>
                <div className="username">
                  <h3 style={{ display: 'inline-block', marginRight: '10px' }}>{contact.username}</h3>
                  {getNotificationCount(contact._id) > 0 && (
                    <span className="notification-dot" style={{ 
                      width: "20px",
                      height: "20px",
                      backgroundColor: "red",
                      border: "3px solid rgb(51, 51, 51)",
                      borderRadius: "50%",
                      display: 'inline-block',
                      marginLeft: '-78px',
                      verticalAlign: "top",
                      color: 'white',
                      fontSize: '15px',
                      lineHeight: '20px',
                      textAlign: 'center',
                     }}>
                      {getNotificationCount(contact._id)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt='avatar'
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </ContactContainerCss>
      )}
    </>
  );
}

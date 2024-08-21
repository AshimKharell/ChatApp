import React, { useState, useEffect } from 'react';
import Logo from '../assets/chatting-app.png';
import ContactContainerCss from '../componentsCss/ContactContainerCss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

export default function Contacts({ contacts, currentUser, changeChat, notification = [], setNotification }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setCurrentUserImage(currentUser.avatarImage);
      setCurrentUserName(currentUser.username);
    }
  }, [currentUser]);

  const getSenderUsername = (from) => {
    const contact = contacts.find(contact => contact._id === from);
    return contact ? contact.username : 'Unknown';
  };

  const getContactFromUserId = (userId) => {
    return contacts.find(contact => contact._id === userId);
  };

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleNotificationClick = (from) => {
    const contact = getContactFromUserId(from);
    if (contact) {
      const contactIndex = contacts.indexOf(contact);
      setCurrentSelected(contactIndex);
      changeChat(contact);
      setNotification([]); // Clear all notifications
      setShowNotifications(false); // Hide notifications dropdown
    }
  };

  return (
    <>
      {currentUserImage && currentUserName && (
        <ContactContainerCss>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>
              Instant Talk
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <FontAwesomeIcon
                  icon={faBell}
                  style={{ marginLeft: '140px', cursor: "pointer" }}
                  onClick={handleBellClick}
                />
                {notification.length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-10px',
                      backgroundColor: 'red',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                    }}
                  >
                    {notification.length}
                  </div>
                )}
              </div>
            </h3>
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
                  <h3>{contact.username}</h3>
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

          {showNotifications && (
            <div className="notifications-dropdown" style={{
              position: 'absolute',
              top: '50px',
              right: '20px',
              backgroundColor: '#f9f9f9',
              border: '1px solid #ddd',
              padding: '15px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              width: '300px',
              maxHeight: '400px',
              overflowY: 'auto',
              zIndex: 1000,
            }}>
              {notification.length === 0 ? (
                <p>No new notifications</p>
              ) : (
                notification.map((notif, index) => (
                  <div
                    key={index}
                    className="notification-item"
                    onClick={() => handleNotificationClick(notif.from)}
                    style={{
                      padding: '10px',
                      borderBottom: '1px solid #ddd',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s',
                    }}
                  >
                    <p style={{ margin: '0', fontWeight: 'bold' }}>
                      Message received from: {getSenderUsername(notif.from)}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </ContactContainerCss>
      )}
    </>
  );
}

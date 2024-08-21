import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import AvatarPageContainerCss from '../componentsCss/AvatarPageContainerCss'
import loader from '../assets/loader.gif'
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from '../utils/APIRoutes';
import { Buffer } from 'buffer';

export default function SetAvatar() {
    const api = "https://api.multiavatar.com/45676543";
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    const toastOptions = {
        position: "top-right",
        autoClose: 2500,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
    }

    useEffect(() => {
        if(!localStorage.getItem('chat-app-user')) {
          navigate("/login")
        }
      }, [])

    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error("Please select an avatar", toastOptions);
        } else {
            const user = await JSON.parse(localStorage.getItem("chat-app-user"));
            const {data} = await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar],
            });
            if(data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem("chat-app-user", JSON.stringify(user));
                toast.success("Avatar set Sucessfully.")
                setTimeout(() => {
                    navigate('/login')
                }, 1500)
            }else {
                toast.error("Error setting avatar. Please try again", toastOptions)
            }
        }
    };

    const fetchAvatars = async () => {
        try {
            const data = [];
            for (let i = 0; i < 4; i++) {
                const response = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`, {
                    responseType: 'arraybuffer'
                });
                const base64 = Buffer.from(response.data, 'binary').toString('base64');
                data.push(base64);
            }
            setAvatars(data);
        } catch (error) {
            toast.error('Failed to load avatars, too many request', toastOptions);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAvatars();
    }, []);

    return (
        <>
            {
                isLoading ? (
                    <AvatarPageContainerCss style={{ margin: '-8px' }}>
                        <img src={loader} alt="loader" className='loader' />
                    </AvatarPageContainerCss>
                ) : (
                    <AvatarPageContainerCss style={{ margin: '-8px' }}>
                        <div className="title-container">
                            <h1>Pick an avatar as your profile picture</h1>
                        </div>
                        <div className="avatars">
                            {
                                avatars.map((avatar, index) => {
                                    return (
                                        <div
                                            className={`avatar ${selectedAvatar === index ? "selected" : ""}`}>
                                            <img
                                                src={`data:image/svg+xml;base64,${avatar}`}
                                                key={index}
                                                alt='avatar'
                                                onClick={() => setSelectedAvatar(index)}
                                            />
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <button className="submit-btn" onClick={setProfilePicture }>
                            Set as profile picture
                        </button>
                    </AvatarPageContainerCss>
                )
            }
            <ToastContainer />
        </>
    )
}

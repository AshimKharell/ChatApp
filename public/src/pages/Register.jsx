import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import LoginFormContainerCss from '../componentsCss/LoginFormContainerCss'
import Logo from '../assets/chatting-app.png'
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from '../utils/APIRoutes';

export default function Register() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const toastOptions = {
        position: "top-right",
        autoClose: 2500,
        pauseOnHover: true,
        draggable: true,
        theme: "dark"
    }

    useEffect(() => {
        if(localStorage.getItem('chat-app-user')) {
          navigate("/")
        }
      }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (handleValidation()) {
            const { password, username, email } = values;
            const { data } = await axios.post(registerRoute, {
                username,
                email,
                password
            });
            if (data.status === false) {
                toast.error(data.msg, toastOptions);
            }
            if (data.status === true) {
                localStorage.setItem("chat-app-user", JSON.stringify(data.user));
                toast.success("User Created Successfully", toastOptions);
                setTimeout(() => {
                    navigate("/setAvatar");
                }, 1500); 
            }
            
        }
    };

    const handleValidation = () => {
        const { password, confirmPassword, email, username } = values;
        if (password !== confirmPassword) {
            toast.error("Password and Confirm Password should be same", toastOptions)
            return false;
        } else if (username.length < 4) {
            toast.error("Username should be greater than 4 characters", toastOptions)
            return false;
        } else if (password.length < 6) {
            toast.error("Password should be greater than 6 characters", toastOptions)
            return false;
        } else if (email === "") {
            toast.error("Email is required", toastOptions);
            return false;
        } else {
            return true;
        }
    }
    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    }
    return (
        <>
            <LoginFormContainerCss style={{ margin: '-10px' }}>
                <form onSubmit={(event) => handleSubmit(event)}>
                    <div className="brand">
                        <img src={Logo} alt="Logo" />
                        <h1>Instant Talk</h1>
                    </div>
                    <input
                        type="text"
                        placeholder="Username"
                        name='username'
                        onChange={e => handleChange(e)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        name='email'
                        onChange={e => handleChange(e)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name='password'
                        onChange={e => handleChange(e)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name='confirmPassword'
                        onChange={e => handleChange(e)}
                    />
                    <button type='submit'>Create User</button>
                    <span>Already have an account? <Link to='/login'>Login</Link></span>
                </form>
            </LoginFormContainerCss>
            <ToastContainer />
        </>
    )
}

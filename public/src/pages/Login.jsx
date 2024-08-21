import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import LoginFormContainerCss from '../componentsCss/LoginFormContainerCss'
import Logo from '../assets/chatting-app.png'
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from '../utils/APIRoutes';

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: ""
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
      const { password, username } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem("chat-app-user", JSON.stringify(data.user));
        navigate("/");
      }
    }
  };

  const handleValidation = () => {
    const { password, username } = values;
    if (password === "") {
      toast.error("Email and Password is required", toastOptions)
      return false;
    } else if (username.length === "") {
      toast.error("Email and Password is required", toastOptions)
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
            min= "3"
          />
          <input
            type="password"
            placeholder="Password"
            name='password'
            onChange={e => handleChange(e)}
          />
          <button type='submit'>Login</button>
          <span>Don't have an account? <Link to='/register'>Register</Link></span>
        </form>
      </LoginFormContainerCss>
      <ToastContainer />
    </>
  )
}

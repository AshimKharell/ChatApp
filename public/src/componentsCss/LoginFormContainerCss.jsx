import styled from "styled-components";

const LoginFormContainerCss = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #2b2b4b;
    .brand {
        display: flex;
        aligh-items: center;
        gap: 1rem;
        justify-content: center;
        img{
            height: 5rem;
        }
        h1 {
        color: white;
        text-transform: uppercase;
        }
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background-color: #00000076;
        border-radius: 2rem;
        padding: 3rem 5rem;
        input { 
            background-color: transparent;
            padding: 1rem;
            border: 0.1rem solid #4e0eff;
            border-radius: 0.4rem;
            color: white;
            width: 100%
            font-size: 1rem;
            &:focus {
                border: 0.1rem solid #997af0;
                outline: none;
            }
        }
        button{
            background-color: #997af0;
            color: white;
            padding: 1rem 2rem;
            border: none;
            font-weight: bold;
            cursor: pointer;
            border-radius: 0.4 rem;
            font-size: 1rem;
            text-transform: uppercase;
            transition: 0.4s ease-in-out;
            &:hover {
                background-color: #4e0eff;
            }
        }
            span {
            font-size: 1.2rem;
            color: white;
                 a {
                        color: #4e0eff;
                        text-decoration: none;
                        font-weight: bold;
                    }
            }
    }

`

export default LoginFormContainerCss;
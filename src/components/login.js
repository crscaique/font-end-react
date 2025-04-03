import React, {useEffect, useState} from 'react';
import {BaseUrl} from "../constants";
import axios from "axios";

function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [Err, setErr] = useState("")

    useEffect(() => {
        if (localStorage.getItem("Token") !== null) {
            window.location.href = "/dashboard";
        }
    }, []);

    function usernameChangeHandler(event) {
        setUsername(event.target.value);
    }

    function passwordChangeHandler(event) {
        setPassword(event.target.value);
    }

    function login() {
        let data = JSON.stringify({
            "username": username,
            "password": password
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: BaseUrl+'/api/login/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                localStorage.setItem("Token", response.data.token);
                setErr("Login success");
                // Redirect to dashboard after successful login
                window.location.href = "/dashboard";
            })
            .catch((error) => {
                console.log(error);
                // Handle the error response properly
                if (error.response && error.response.data) {
                    // If it's an object with error messages
                    if (typeof error.response.data === 'object') {
                        // Extract error messages from the object
                        const errorMessages = Object.entries(error.response.data)
                            .map(([field, message]) => `${field}: ${message}`)
                            .join(', ');
                        setErr(errorMessages);
                    } else {
                        // If it's already a string, use it directly
                        setErr(error.response.data);
                    }
                } else {
                    // Fallback error message
                    setErr("Login failed. Please try again.");
                }
            });

    }

    return (
        <div>
            <h1>Login</h1>
            <input type="text" placeholder="Username" onChange={usernameChangeHandler}/>
            <input type="password" placeholder="Password" onChange={passwordChangeHandler}/>
            <button onClick={login}>Login</button>
            <p>{Err}</p>
        </div>
    );
}

export default Login;
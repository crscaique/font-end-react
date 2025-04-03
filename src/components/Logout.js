import React, {useEffect, useState} from 'react';
import axios from "axios";
import {BaseUrl} from "../constants";

function Logout(props) {
    const [token, setToken] = useState("")
    const [Err, setErr] = useState("")

    useEffect(() => {
        setToken(localStorage.getItem("Token"));
    }, [token]);

    function logout() {
        let data = '';

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: BaseUrl+'/api/logout/',
            headers: {
                'Authorization': 'Token ' + token
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                localStorage.removeItem("Token");
                window.location.href = "/login";
            })
            .catch((error) => {
                console.log(error);
                // Handle the error response properly
                if (error.response && error.response.data) {
                    // If it's an object with error messages
                    if (typeof error.response.data === 'object') {
                        // Check if there's a detail message
                        if (error.response.data.detail) {
                            setErr(error.response.data.detail);
                        } else {
                            // Extract all error messages from the object
                            const errorMessages = Object.entries(error.response.data)
                                .map(([field, message]) => `${field}: ${message}`)
                                .join(', ');
                            setErr(errorMessages);
                        }
                    } else {
                        // If it's already a string, use it directly
                        setErr(error.response.data);
                    }
                } else {
                    // Fallback error message
                    setErr("Logout failed. Please try again.");
                }
            });

    }

    return (
        <div>
            <h1>Logout</h1>
            <button onClick={logout}>Logout</button>
            <p>{Err}</p>
        </div>
    );
}

export default Logout;

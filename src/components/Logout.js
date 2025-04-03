import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { BaseUrl } from "../constants";
import '../styles/GlobalStyles.css';

function Logout() {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("Token");

    useEffect(() => {
        // If no token, redirect to login immediately
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const handleLogout = async () => {
        setIsLoading(true);
        setError("");

        try {
            await axios.post(`${BaseUrl}/api/logout/`, null, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Clear token and redirect to login
            localStorage.removeItem("Token");
            localStorage.removeItem("user_id");
            setIsLoading(false);
            navigate('/login');
        } catch (err) {
            setIsLoading(false);
            if (err.response && err.response.data) {
                // Handle object error response
                if (typeof err.response.data === 'object') {
                    if (err.response.data.detail) {
                        setError(err.response.data.detail);
                    } else {
                        const errorMessage = Object.values(err.response.data).flat().join(", ");
                        setError(errorMessage || "Logout failed. Please try again.");
                    }
                } else {
                    setError(err.response.data || "Logout failed. Please try again.");
                }
            } else {
                setError("Logout failed. Please check your connection and try again.");
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Logout</h2>
                
                {error && (
                    <div className="alert alert-danger">{error}</div>
                )}
                
                <p>Are you sure you want to logout?</p>
                
                <button 
                    onClick={handleLogout} 
                    className="btn"
                    disabled={isLoading}
                >
                    {isLoading ? "Logging out..." : "Logout"}
                </button>
            </div>
        </div>
    );
}

export default Logout;

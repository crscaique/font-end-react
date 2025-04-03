import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { BaseUrl } from '../constants';
import '../styles/GlobalStyles.css';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const { username, email, password, password2 } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess(false);

        // Password validation
        if (password !== password2) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            // Using axios but not storing the response since we don't need it
            await axios.post(`${BaseUrl}/api/register/`, {
                username,
                email,
                password
            });
            
            setIsLoading(false);
            setSuccess(true);
            
            // Delay navigation slightly to show success message
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            setIsLoading(false);
            if (err.response && err.response.data) {
                // Handle object error response
                if (typeof err.response.data === 'object') {
                    const errorMessage = Object.values(err.response.data).flat().join(", ");
                    setError(errorMessage || "Registration failed.");
                } else {
                    setError(err.response.data || "Registration failed.");
                }
            } else {
                setError("Registration failed. Please check your connection and try again.");
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Create an Account</h2>
                
                {error && (
                    <div className="alert alert-danger">{error}</div>
                )}
                
                {success && (
                    <div className="alert alert-success">
                        Registration successful! Redirecting to login...
                    </div>
                )}
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            placeholder="Choose a username"
                            value={username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password2">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password2"
                            name="password2"
                            placeholder="Confirm your password"
                            value={password2}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn" 
                        disabled={isLoading || success}
                    >
                        {isLoading ? "Registering..." : "Register"}
                    </button>
                </form>
                
                <div className="auth-links">
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Register;
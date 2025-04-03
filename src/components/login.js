import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { BaseUrl } from "../constants";
import '../styles/GlobalStyles.css';

function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already logged in
        if (localStorage.getItem("Token") !== null) {
            // Use navigate instead of window.location for consistent routing
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await axios.post(`${BaseUrl}/api/login/`, {
                username,
                password,
            });
            
            localStorage.setItem("Token", response.data.token);
            localStorage.setItem("user_id", response.data.user_id);
            
            setIsLoading(false);
            // Navigate to dashboard
            navigate("/dashboard");
        } catch (err) {
            setIsLoading(false);
            if (err.response && err.response.data) {
                // Handle object error response
                if (typeof err.response.data === 'object') {
                    const errorMessage = Object.values(err.response.data).flat().join(", ");
                    setError(errorMessage || "Login failed. Please check your credentials.");
                } else {
                    setError(err.response.data || "Login failed. Please check your credentials.");
                }
            } else {
                setError("Login failed. Please check your connection and try again.");
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Login to Your Account</h2>
                
                {error && (
                    <div className="alert alert-danger">{error}</div>
                )}
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn" 
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
                
                <div className="auth-links">
                    <p>Don't have an account? <Link to="/register">Register here</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;
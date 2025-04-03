import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BaseUrl } from '../constants';
import '../styles/GlobalStyles.css';

const TodoForm = ({ onNoteCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [token, setToken] = useState('');

    // Get token on component mount
    useEffect(() => {
        const storedToken = localStorage.getItem('Token');
        if (!storedToken) {
            navigate('/login');
        } else {
            setToken(storedToken);
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        if (!token) {
            setError('Not authenticated. Please log in again.');
            setIsLoading(false);
            navigate('/login');
            return;
        }
        
        try {
            // Log token and request data for debugging
            console.log('Token:', token);
            console.log('Request URL:', `${BaseUrl}/api/create/`);
            console.log('Request data:', { title, content });
            
            const response = await axios.post(
                `${BaseUrl}/api/create/`, 
                { title, content },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log('Success response:', response.data);
            setTitle('');
            setContent('');
            setIsLoading(false);
            
            // Call the callback with the new note if provided
            if (onNoteCreated) {
                onNoteCreated(response.data);
            }
        } catch (err) {
            setIsLoading(false);
            
            // Detailed error logging
            console.error('Error creating note:', err);
            
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error response data:', err.response.data);
                console.error('Error response status:', err.response.status);
                console.error('Error response headers:', err.response.headers);
                
                // Check for 401 Unauthorized
                if (err.response.status === 401) {
                    setError('Authentication failed. Please log in again.');
                    // Clear token and redirect to login
                    localStorage.removeItem('Token');
                    setTimeout(() => navigate('/login'), 2000);
                    return;
                }
                
                if (typeof err.response.data === 'object') {
                    const errorMessage = Object.values(err.response.data).flat().join(", ");
                    setError(errorMessage || 'Failed to create note');
                } else {
                    setError(err.response.data || 'Failed to create note');
                }
            } else if (err.request) {
                // The request was made but no response was received
                console.error('Error request:', err.request);
                setError('No response received from server. Check your connection.');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error message:', err.message);
                setError('Error setting up request: ' + err.message);
            }
        }
    };

    return (
        <div className="note-form">
            {error && (
                <div className="alert alert-danger">{error}</div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input 
                        type="text" 
                        id="title"
                        className="form-control"
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="Title" 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="content">Content:</label>
                    <textarea 
                        id="content"
                        className="form-control todo-textarea"
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        placeholder="Content" 
                        required 
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="btn"
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating...' : 'Create Note'}
                </button>
            </form>
        </div>
    );
};

export default TodoForm;

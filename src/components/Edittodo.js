import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { BaseUrl } from '../constants';

const EditTodoForm = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTodo = async () => {
            try {
                const token = localStorage.getItem('Token');
                const response = await axios.get(`${BaseUrl}/api/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setTitle(response.data.title);
                setContent(response.data.content);
            } catch (error) {
                console.error('Error fetching todo:', error);
                alert('Failed to fetch todo details');
                navigate('/dashboard');
            }
        };
        fetchTodo();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('Token');
            await axios.put(`${BaseUrl}/api/update/${id}/`, { title, content }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            alert('Todo updated successfully');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error updating todo:', error);
            alert('Failed to update todo');
        }
    };

    return (
        <div className="edit-todo-container">
            <h2>Edit Todo</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" required />
                <div className="form-buttons">
                    <button type="submit">Update Todo</button>
                    <button type="button" onClick={() => navigate('/dashboard')}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditTodoForm;
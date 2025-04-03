import React, { useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '../constants';

const TodoForm = ({ onNoteCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('Token');
            const response = await axios.post(`${BaseUrl}/api/notes/create/`, { title, content }, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            alert('Note created successfully');
            setTitle('');
            setContent('');
            
            // Call the callback with the new note if provided
            if (onNoteCreated) {
                onNoteCreated(response.data);
            }
        } catch (error) {
            console.error('Error creating note:', error);
            alert('Failed to create note');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" required />
            <button type="submit">Create Note</button>
        </form>
    );
};

export default TodoForm;

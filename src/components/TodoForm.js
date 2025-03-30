import React, { useState } from 'react';
import axios from 'axios';

const NoteForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8000/notes/create/', { title, content }, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            alert('Note created successfully');
            setTitle('');
            setContent('');
        } catch (error) {
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

export default NoteForm;

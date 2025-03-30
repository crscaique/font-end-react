import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditNoteForm = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        const fetchNote = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/notes/${id}/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            setTitle(response.data.title);
            setContent(response.data.content);
        };
        fetchNote();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8000/notes/update/${id}/`, { title, content }, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            alert('Note updated successfully');
        } catch (error) {
            alert('Failed to update note');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" required />
            <button type="submit">Update Note</button>
        </form>
    );
};

export default EditNoteForm;
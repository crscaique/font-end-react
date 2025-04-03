import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from '../constants';
import TodoForm from './TodoForm';
import Deletenote from './Deletenote';
import '../styles/GlobalStyles.css';

function Dashboard() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('Token');

    const fetchNotes = async () => {
        try {
            const response = await axios.get(`${BaseUrl}/api/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setNotes(response.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('Token');
            }
            setError('Failed to fetch notes');
        }
    };

    useEffect(() => {
        if (!token) return;
        fetchNotes();
    }, [token]);

    const handleNoteCreated = (newNote) => {
        setNotes([...notes, newNote]);
    };

    const handleDeleteNote = (id) => {
        setNotes(notes.filter(note => note.id !== id));
    };

    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title">My Notes</h1>
                
            </div>

            <div className="todo-form-container">
                <h2 className="todo-form-title">Create New Note</h2>
                <TodoForm onNoteCreated={handleNoteCreated} />
            </div>

            {loading ? (
                <div className="loading-container">
                    <p>Loading notes...</p>
                </div>
            ) : error ? (
                <div className="error-container">
                    <p>{error}</p>
                </div>
            ) : notes.length === 0 ? (
                <div className="empty-state-container">
                    <div className="card">
                        <p>No notes found. Create your first note above!</p>
                    </div>
                </div>
            ) : (
                <div className="notes-grid">
                    {notes.map(note => (
                        <div key={note.id} className="card note-card">
                            <div className="note-content">
                                <h3>{note.title}</h3>
                                <p>{note.content}</p>
                            </div>
                            <div className="note-actions">
                                <Link to={`/edit-note/${note.id}`} className="btn">Edit</Link>
                                <Deletenote id={note.id} onDelete={handleDeleteNote} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dashboard;

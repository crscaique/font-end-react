import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import TodoForm from './TodoForm';
import DeleteNoteButton from './Deletenote';
import { BaseUrl } from '../constants';
import { Link } from 'react-router-dom';

function Dashboard() {
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(true);

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('Token');
        if (!token) {
            setAuthenticated(false);
            return;
        }

        // Fetch notes
        const fetchNotes = async () => {
            try {
                const response = await axios.get(`${BaseUrl}/api/notes/`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setNotes(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching notes:', error);
                setIsLoading(false);
                // If unauthorized, redirect to login
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('Token');
                    setAuthenticated(false);
                }
            }
        };

        fetchNotes();
    }, []);

    // Handle successful note creation
    const handleNoteCreated = (newNote) => {
        setNotes([...notes, newNote]);
    };

    // Handle successful note deletion
    const handleNoteDeleted = (deletedId) => {
        setNotes(notes.filter(note => note.id !== deletedId));
    };

    // Redirect if not authenticated
    if (!authenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="dashboard">
            <h1>Your Notes Dashboard</h1>
            
            <div className="nav-links">
                <Link to="/logout">Logout</Link>
            </div>
            
            <div className="note-form-container">
                <h2>Create New Note</h2>
                <TodoForm onNoteCreated={handleNoteCreated} />
            </div>
            
            <div className="notes-list">
                <h2>Your Notes</h2>
                {isLoading ? (
                    <p>Loading notes...</p>
                ) : notes.length === 0 ? (
                    <p>No notes found. Create one above!</p>
                ) : (
                    <ul>
                        {notes.map(note => (
                            <li key={note.id} className="note-item">
                                <h3>{note.title}</h3>
                                <p>{note.content}</p>
                                <div className="note-actions">
                                    <Link to={`/edit-note/${note.id}`}>
                                        <button>Edit</button>
                                    </Link>
                                    <DeleteNoteButton 
                                        id={note.id} 
                                        onDelete={handleNoteDeleted} 
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Dashboard;

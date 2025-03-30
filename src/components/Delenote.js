import React from 'react';
import axios from 'axios';

const DeleteNoteButton = ({ id, onDelete }) => {
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8000/notes/delete/${id}/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            onDelete(id);
            alert('Note deleted successfully');
        } catch (error) {
            alert('Failed to delete note');
        }
    };

    return (
        <button onClick={handleDelete}>Delete Note</button>
    );
};

export default DeleteNoteButton;

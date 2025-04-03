import React from 'react';
import axios from 'axios';
import { BaseUrl } from '../constants';

const DeleteNoteButton = ({ id, onDelete }) => {
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('Token');
            await axios.delete(`${BaseUrl}/api/notes/delete/${id}/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            // Call the callback to update the parent component
            if (onDelete) {
                onDelete(id);
            }
            alert('Note deleted successfully');
        } catch (error) {
            console.error('Error deleting note:', error);
            alert('Failed to delete note');
        }
    };

    return (
        <button onClick={handleDelete}>Delete Note</button>
    );
};

export default DeleteNoteButton;

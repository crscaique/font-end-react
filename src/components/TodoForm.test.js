import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TodoForm from './TodoForm';
import axios from 'axios';
import { BaseUrl } from '../constants';

// Mock axios
jest.mock('axios');

describe('TodoForm Component', () => {
  const mockOnNoteCreated = jest.fn();
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock localStorage
    global.localStorage = {
      getItem: jest.fn(() => 'fake-token')
    };
  });

  test('renders form elements correctly', () => {
    render(<TodoForm onNoteCreated={mockOnNoteCreated} />);
    
    // Check if form elements are rendered
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create note/i })).toBeInTheDocument();
  });

  test('updates state when input values change', () => {
    render(<TodoForm onNoteCreated={mockOnNoteCreated} />);
    
    // Get input elements
    const titleInput = screen.getByPlaceholderText('Title');
    const contentInput = screen.getByPlaceholderText('Content');
    
    // Simulate user typing
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(contentInput, { target: { value: 'Test Content' } });
    
    // Check if values are updated
    expect(titleInput.value).toBe('Test Title');
    expect(contentInput.value).toBe('Test Content');
  });

  test('submits form with correct data', async () => {
    // Mock successful response
    const mockNewNote = { 
      id: 1, 
      title: 'Test Title', 
      content: 'Test Content' 
    };
    axios.post.mockResolvedValueOnce({ data: mockNewNote });
    
    render(<TodoForm onNoteCreated={mockOnNoteCreated} />);
    
    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('Title'), { 
      target: { value: 'Test Title' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Content'), { 
      target: { value: 'Test Content' } 
    });
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /create note/i }).closest('form'));
    
    // Check if axios was called with correct data
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${BaseUrl}/api/notes/create/`,
        { title: 'Test Title', content: 'Test Content' },
        { headers: { 'Authorization': 'Token fake-token' } }
      );
    });
    
    // Check if callback was called
    expect(mockOnNoteCreated).toHaveBeenCalledWith(mockNewNote);
    
    // Check if inputs were cleared
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Title').value).toBe('');
      expect(screen.getByPlaceholderText('Content').value).toBe('');
    });
  });

  test('handles error response gracefully', async () => {
    // Mock error
    const mockError = new Error('Request failed');
    mockError.response = { status: 400 };
    axios.post.mockRejectedValueOnce(mockError);
    
    // Spy on window.alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<TodoForm onNoteCreated={mockOnNoteCreated} />);
    
    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('Title'), { 
      target: { value: 'Test Title' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Content'), { 
      target: { value: 'Test Content' } 
    });
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: /create note/i }).closest('form'));
    
    // Check if alert was shown
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Failed to create note');
    });
    
    // Check if callback was not called
    expect(mockOnNoteCreated).not.toHaveBeenCalled();
    
    // Restore mock
    alertMock.mockRestore();
  });
});

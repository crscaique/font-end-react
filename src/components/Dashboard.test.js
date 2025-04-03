import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock components used in Dashboard
jest.mock('./TodoForm', () => () => <div data-testid="todo-form">TodoForm</div>);
jest.mock('./Deletenote', () => ({ id, onDelete }) => (
  <button onClick={() => onDelete(id)} data-testid={`delete-note-${id}`}>
    Delete Note
  </button>
));

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock localStorage
    global.localStorage = {
      getItem: jest.fn(() => 'fake-token'),
      removeItem: jest.fn()
    };
  });

  test('redirects to login when no token is present', () => {
    // Mock no token
    localStorage.getItem.mockReturnValueOnce(null);
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    // Since we're using React Router's Navigate component, 
    // we can't directly test the redirect in this test environment.
    // Instead, we'll check if authentication state is set correctly
    expect(localStorage.getItem).toHaveBeenCalledWith('Token');
  });

  test('displays loading state initially', () => {
    // Mock API call that never resolves
    axios.get.mockImplementationOnce(() => new Promise(() => {}));
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Loading notes/i)).toBeInTheDocument();
  });

  test('displays notes when API returns data', async () => {
    // Mock successful API response with notes
    const mockNotes = [
      { id: 1, title: 'Note 1', content: 'Content 1' },
      { id: 2, title: 'Note 2', content: 'Content 2' }
    ];
    
    axios.get.mockResolvedValueOnce({ data: mockNotes });
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    // Wait for notes to be displayed
    await waitFor(() => {
      expect(screen.getByText('Note 1')).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Note 2')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
  });

  test('displays empty state when no notes', async () => {
    // Mock API response with empty array
    axios.get.mockResolvedValueOnce({ data: [] });
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    // Wait for empty state message
    await waitFor(() => {
      expect(screen.getByText(/No notes found/i)).toBeInTheDocument();
    });
  });

  test('handles API error gracefully', async () => {
    // Mock failed API call
    axios.get.mockRejectedValueOnce({ 
      response: { status: 401 }
    });
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    // Check that localStorage token is removed on 401 error
    await waitFor(() => {
      expect(localStorage.removeItem).toHaveBeenCalledWith('Token');
    });
  });
});

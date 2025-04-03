import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './login';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('Login Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn()
    };
    global.localStorage = localStorageMock;
    
    // Mock window.location
    delete window.location;
    window.location = { href: '' };
  });

  test('renders login form correctly', () => {
    render(<Login />);
    
    // Check if important elements are rendered
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('updates state when input values change', () => {
    render(<Login />);
    
    // Get input elements
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    // Simulate user typing
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Check if values are updated
    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
  });

  test('redirects to dashboard on successful login', async () => {
    // Mock successful axios response
    axios.request.mockResolvedValueOnce({ 
      data: { token: 'fake-token' } 
    });
    
    render(<Login />);
    
    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('Username'), { 
      target: { value: 'testuser' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), { 
      target: { value: 'password123' } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Wait for the async login function to complete
    await waitFor(() => {
      // Check if token was stored
      expect(localStorage.setItem).toHaveBeenCalledWith('Token', 'fake-token');
      // Check if redirect happened
      expect(window.location.href).toBe('/dashboard');
    });
  });

  test('displays error message on failed login', async () => {
    // Mock failed axios response
    axios.request.mockRejectedValueOnce({ 
      response: { 
        data: { username: 'Invalid credentials' } 
      } 
    });
    
    render(<Login />);
    
    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('Username'), { 
      target: { value: 'wronguser' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), { 
      target: { value: 'wrongpass' } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/username: Invalid credentials/i)).toBeInTheDocument();
    });
  });
});

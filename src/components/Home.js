import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/GlobalStyles.css';

function Home() {
    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Welcome to To Do Notes App</h1>
                <p>Your personal notes and todo management application</p>
                <div className="hero-buttons">
                    <Link to="/login" className="btn">Login</Link>
                    <Link to="/register" className="btn" style={{ marginLeft: '10px' }}>Register</Link>
                </div>
            </div>
            <br/>
            <div className="features-section">
                <div className="card-grid">
                    <div className="card">
                        <h3>Manage Your Notes</h3>
                        <p>Create, edit, and organize your notes in one place.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
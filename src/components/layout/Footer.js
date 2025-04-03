import React from 'react';
import '../../styles/GlobalStyles.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} To Do Notes App. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

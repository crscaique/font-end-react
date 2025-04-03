import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../../styles/GlobalStyles.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

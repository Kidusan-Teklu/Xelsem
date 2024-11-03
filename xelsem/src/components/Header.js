// src/components/Header.js
import React from 'react';
import './Header.css';
import Navbar from './Navbar'; // Import the Navbar component
import logo from './logo1.png';
const Header = () => {
    return (
        <header className="header">
            <div className="header-content">
                <img src={logo} alt="XelsemBooks Logo" className="header-logo" />
                <h1 className="header-title">XelsemBooks</h1>
            </div>
            <Navbar /> {/* Including the Navbar component */}
        </header>
    );
};

export default Header;

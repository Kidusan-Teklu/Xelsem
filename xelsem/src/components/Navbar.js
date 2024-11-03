// src/components/Navbar.js
import React from 'react';
import './Navbar.css'; // Importing the CSS file for the navbar

const Navbar = () => {
    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li className="navbar-item"><a href="/">Home</a></li>
                <li className="navbar-item"><a href="/about">About</a></li>
                <li className="navbar-item"><a href="/MyBooks">MyBooks</a></li>
                <li className="navbar-item"><a href="/contact">Contact</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;

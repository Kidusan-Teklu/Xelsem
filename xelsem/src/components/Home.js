import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <h1>How to use XelsemBooks</h1>

            <div className="features-grid">
                <div className="feature-card">
                    <h3>Upload your favorite books.</h3>
                    <Link to="/upload" className="feature-link">
                        Upload Book
                    </Link>
                </div>

                <div className="feature-card">
                    <h3>View all your uploaded books.</h3>
                    <Link to="/mybooks" className="feature-link">
                        View Books
                    </Link>
                </div>

                <div className="feature-card">
                    <h3>Update book details or delete books as needed.</h3>
                    <Link to="/mybooks" className="feature-link">
                        Manage Books
                    </Link>
                </div>
            </div>

            <div className="reading-feature">
                <h3>Read your uploaded books directly on the platform.</h3>
                <Link to="/mybooks" className="feature-link">
                    Start Reading
                </Link>
            </div>

            <div className="quote-section">
                <p className="quote">
                    "A room without books is like a body without a soul." - Marcus Tullius Cicero
                </p>
            </div>

            <footer className="home-footer">
                <p>© 2024 XelsemBooks. All rights reserved.</p>
                <div className="social-links">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-github"></i>
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default Home; 
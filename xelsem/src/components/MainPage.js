// src/components/MainPage/MainPage.js
import React, { useState, useEffect } from 'react';
import './MainPage.css'; // Importing the CSS file
import logo from './logo1.png'; // Import the image

const MainPage = () => {
    // Array of background images
    const backgroundImages = [
      './b-g1.jfif',
      './b-g2.jfif',
      './b-g3.jfif',
      './b-g4.jfif',
      './b-g5.jfif'
  ];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval); // Clean up on component unmount
    }, [backgroundImages.length]);

    return (
        <div className="main-page" style={{ backgroundImage: `url(${backgroundImages[currentImageIndex]})` }}>
            <h1 style={{ color: 'red' }}>Welcome to XelsemBooks</h1>
            <img src={logo} alt="logo" className="logo" /> 
            <p>
                XelsemBooks is a platform where you can upload your favorite books and read them whenever you need. 
                Our mission is to create a community of readers who share their love for literature.
            </p>
            <h2>How to Use XelsemBooks</h2>
            <ul>
                <li>Upload your favorite books.</li>
                <li>View all your uploaded books.</li>
                <li>Update book details or delete books as needed.</li>
                <li>Read your uploaded books directly on the platform.</li>
            </ul>
            <h3>Quotes about Reading</h3>
            <blockquote>
                "A room without books is like a body without a soul." – Marcus Tullius Cicero
            </blockquote>
        </div>
    );
};

export default MainPage;

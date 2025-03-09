import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './components/MainPage';
import About from './components/About';
import Contact from './components/Contact';
import MyBooks from './components/MyBooks';
import Read from './components/Read';
import BookReader from './components/BookReader';

function App() {
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
    <Router>
      <div className="App" style={{ backgroundImage: `url(${backgroundImages[currentImageIndex]})` }}>
        <Header /> {/* The Header component with Navbar */}
        <main>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/mybooks" element={<MyBooks />} />
            <Route path="/read/:id" element={<Read />} />
            <Route path="/read/:bookId" element={<BookReader />} />
          </Routes>
        </main>
        <Footer /> {/* The Footer component */}
      </div>
    </Router>
  );
}

export default App;

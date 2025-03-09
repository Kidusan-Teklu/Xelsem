import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyBooks.css';

const API_URL = 'http://localhost:5000'; // Make sure this matches your backend port

const MyBooks = () => {
    const [books, setBooks] = useState([]);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category: '',
        file: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch(`${API_URL}/api/books`);
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error('Error fetching books:', error);
            setError('Failed to load books');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            file: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('author', formData.author);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('file', formData.file);

            const response = await fetch(`${API_URL}/api/books`, {
                method: 'POST',
                body: formDataToSend,
                // Remove the Content-Type header - FormData will set it automatically
                headers: {
                    'Accept': 'application/json',
                },
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Upload failed');
            }

            // Reset form
            setFormData({
                title: '',
                author: '',
                category: '',
                file: null
            });
            
            // Reset file input
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) {
                fileInput.value = '';
            }

            setShowUploadForm(false);
            // Refresh book list
            fetchBooks();
            
            // Show success message
            alert('Book uploaded successfully!');

        } catch (error) {
            console.error('Error uploading book:', error);
            setError(error.message || 'Failed to upload book');
            alert(error.message || 'Failed to upload book');
        }
    };

    if (loading) return <div className="loading">Loading books...</div>;

    return (
        <div className="mybooks-container">
            <h2>My Books</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="upload-section">
                <button 
                    className="upload-button"
                    onClick={() => setShowUploadForm(!showUploadForm)}
                >
                    {showUploadForm ? 'Cancel Upload' : 'Upload New Book'}
                </button>

                {showUploadForm && (
                    <form onSubmit={handleSubmit} className="upload-form">
                        <div className="form-group">
                            <label htmlFor="title">Title:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="author">Author:</label>
                            <input
                                type="text"
                                id="author"
                                name="author"
                                value={formData.author}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">Category:</label>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="file">Book File (PDF):</label>
                            <input
                                type="file"
                                id="file"
                                name="file"
                                accept=".pdf,.epub,.mobi,.doc,.docx,.txt"
                                onChange={handleFileChange}
                                required
                            />
                        </div>

                        <button type="submit" className="submit-button">
                            Upload Book
                        </button>
                    </form>
                )}
            </div>

            <div className="books-grid">
                {books.map((book) => (
                    <div key={book._id} className="book-card">
                        <div className="book-info">
                            <h3>{book.title}</h3>
                            <p>Author: {book.author}</p>
                            <p>Category: {book.category}</p>
                        </div>
                        <div className="book-actions">
                            <Link 
                                to={`/read/${book._id}`}
                                state={{ book: book }}
                                className="read-button"
                            >
                                Read Now
                            </Link>
                            <a 
                                href={`${API_URL}/api/books/${book._id}/download`}
                                className="download-button"
                            >
                                Download
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {books.length === 0 && !showUploadForm && (
                <div className="no-books">
                    <p className="upload-text">No books uploaded yet</p>
                </div>
            )}
        </div>
    );
};

export default MyBooks;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyBooks.css';

const MyBooks = () => {
    const backgroundImages = [
        './b-g1.jfif',
        './b-g2.jfif',
        './b-g3.jfif',
        './b-g4.jfif',
        './b-g5.jfif'
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({ title: '', author: '', category: '' });
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [backgroundImages.length]);

    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost/xelsem/Xelsem/backend/getBooks.php');
            const result = await response.json();
            setBooks(result);
        } catch (error) {
            setMessage('Error fetching books.');
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const addBook = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', newBook.title);
        formData.append('author', newBook.author);
        formData.append('category', newBook.category);
        if (file) {
            formData.append('file', file);
        }

        try {
            const response = await fetch(isEditing ? `http://localhost/xelsem/Xelsem/backend/update.php?id=${isEditing}` : 'http://localhost/xelsem/Xelsem/backend/create.php', {
                method: 'POST',
                body: formData,
            });

            const result = await response.text();
            setMessage(result);
            alert(result);
            setNewBook({ title: '', author: '', category: '' });
            setFile(null);
            setIsUploading(false);
            setIsEditing(null);
            fetchBooks();
        } catch (error) {
            setMessage('Error uploading the book.');
            alert('Error uploading the book.');
        }
    };

    const editBook = (book) => {
        setNewBook({ title: book.title, author: book.author, category: book.category });
        setIsUploading(true);
        setIsEditing(book.id);
    };

    const deleteBook = async (id) => {
        try {
            const response = await fetch(`http://localhost/xelsem/Xelsem/backend/delete.php?id=${id}`, {
                method: 'DELETE',
            });

            const result = await response.text();
            setMessage(result);
            alert(result);
            fetchBooks();
        } catch (error) {
            setMessage('Error deleting the book.');
            alert('Error deleting the book.');
        }
    };

    return (
        <div>
            <h2>My Books</h2>
            <button 
                style={{ fontSize: '20px', padding: '10px 20px', marginBottom: '20px' }} 
                onClick={() => {
                    setIsUploading(true);
                    setIsEditing(null);
                }}
            >
                {isEditing ? 'Edit Book' : 'Upload New Book'}
            </button>

            {isUploading ? (
                <form onSubmit={addBook}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={newBook.title}
                        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Author"
                        value={newBook.author}
                        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        value={newBook.category}
                        onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                        required
                    />
                    {!isEditing && (
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            accept=".pdf, .epub, .mobi, .doc, .docx, .txt"
                            required
                        />
                    )}
                    <button type="submit">{isEditing ? 'Update Book' : 'Add Book'}</button>
                    <button type="button" onClick={() => { setIsUploading(false); setIsEditing(null); }}>
                        Cancel
                    </button>
                </form>
            ) : (
                <div>
                    <h3>Uploaded Books</h3>
                    <ul>
                        {books.map((book) => (
                            <li key={book.id}>
                                <strong>{book.title}</strong> by {book.author} (Category: {book.category})
                                <button onClick={() => editBook(book)}>Edit</button>
                                <button onClick={() => deleteBook(book.id)}>Delete</button>
                                <button onClick={() => navigate(`/read/${book.id}`)}>Read</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {message && <p>{message}</p>}
        </div>
    );
};

export default MyBooks;

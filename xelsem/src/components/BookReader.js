// src/components/ReadBook.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ReadBook = () => {
    const { id } = useParams(); // Get the book ID from the URL
    const [book, setBook] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch the book details using the book ID
        const fetchBook = async () => {
            try {
                const response = await fetch(`http://localhostxelsem/Xelsem/backend/getBooks.php?id=${id}`);
                const result = await response.json();

                if (result.success) {
                    setBook(result.data);
                } else {
                    setError('Book not found.');
                }
            } catch (error) {
                setError('Error fetching the book.');
            }
        };

        fetchBook();
    }, [id]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!book) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{book.title}</h2>
            <h4>by {book.author}</h4>
            <p>Category: {book.category}</p>

            <iframe
                src={`./uploads/${book.fileName}`} 
                title={book.title}></iframe>
</div>)
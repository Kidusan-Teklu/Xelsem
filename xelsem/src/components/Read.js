import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Read.css';

const Read = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBook = async () => {
            try {
                console.log('\n--- Fetching Book ---');
                console.log('Book ID:', id);
                
                if (!id) {
                    throw new Error('No book ID provided');
                }

                const url = `http://localhost:5000/api/books/${id}`;
                console.log('Fetching from URL:', url);

                const response = await fetch(url);
                console.log('Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    contentType: response.headers.get('content-type')
                });

                // Always try to get the response text first
                const responseText = await response.text();
                console.log('Raw response:', responseText);

                let data;
                try {
                    // Try to parse as JSON
                    data = JSON.parse(responseText);
                } catch (e) {
                    console.error('Failed to parse response as JSON:', e);
                    throw new Error('Server returned invalid JSON');
                }

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch book');
                }

                console.log('Parsed book data:', data);
                setBook(data);
            } catch (error) {
                console.error('Error in fetchBook:', error);
                setError(error.message);
            }
        };

        fetchBook();
    }, [id]);

    const handleDownload = async () => {
        try {
            console.log('\n=== Starting Download ===');
            console.log('Book ID:', id);

            const response = await fetch(`http://localhost:5000/api/books/${id}/download`);
            console.log('Response:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries())
            });

            if (!response.ok) {
                let errorMessage = 'Download failed';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorData.details || errorMessage;
                } catch (e) {
                    console.error('Error parsing error response:', e);
                }
                throw new Error(errorMessage);
            }

            // Get filename from Content-Disposition header
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = 'download';
            if (contentDisposition) {
                const matches = /filename="([^"]*)"/.exec(contentDisposition);
                if (matches && matches[1]) {
                    filename = decodeURIComponent(matches[1]);
                }
            }

            console.log('Starting blob download:', {
                filename,
                type: response.headers.get('Content-Type'),
                size: response.headers.get('Content-Length')
            });

            const blob = await response.blob();
            console.log('Blob received:', {
                size: blob.size,
                type: blob.type
            });

            // Create and trigger download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            console.log('Download completed successfully');
        } catch (error) {
            console.error('Download error:', error);
            setError(error.message);
        }
    };

    if (error) {
        return (
            <div className="read-container">
                <div className="error-message">{error}</div>
                <button onClick={() => navigate('/mybooks')}>Back to My Books</button>
            </div>
        );
    }

    if (!book) {
        return <div className="read-container">Loading...</div>;
    }

    return (
        <div className="read-container">
            <div className="book-details">
                <h2>{book.title}</h2>
                <p>Author: {book.author}</p>
                <p>Category: {book.category}</p>
                <div className="actions">
                    <button onClick={handleDownload}>Download Book</button>
                    <button onClick={() => navigate('/mybooks')}>Back to My Books</button>
                </div>
            </div>
        </div>
    );
};

export default Read; 
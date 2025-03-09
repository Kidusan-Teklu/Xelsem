// src/components/ReadBook.js
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import './BookReader.css';

const BookReader = () => {
    const { bookId } = useParams();
    const location = useLocation();
    const bookData = location.state?.book;
    const [currentPage, setCurrentPage] = useState(1);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (bookData?.fileUrl) {
            setPdfUrl(bookData.fileUrl);
            setLoading(false);
        } else {
            setError('Book data not found');
            setLoading(false);
        }
    }, [bookData]);

    if (loading) return <div className="reader-loading">Loading book...</div>;
    if (error) return <div className="reader-error">{error}</div>;

    return (
        <div className="book-reader">
            <div className="reader-header">
                <div className="reader-nav">
                    <Link to="/mybooks" className="back-button">
                        ← Back to My Books
                    </Link>
                    <h2>{bookData?.title}</h2>
                </div>
                <div className="reader-info">
                    <p>Author: {bookData?.author}</p>
                    <p>Description: {bookData?.description}</p>
                </div>
            </div>

            <div className="reader-content">
                {pdfUrl ? (
                    <iframe
                        src={`${pdfUrl}#toolbar=0`}
                        title="PDF Viewer"
                        className="pdf-viewer"
                    />
                ) : (
                    <div className="reader-placeholder">
                        <p>No preview available</p>
                        <a 
                            href={bookData?.fileUrl} 
                            download 
                            className="download-button"
                        >
                            Download to Read
                        </a>
                    </div>
                )}
            </div>

            <div className="reader-controls">
                <div className="control-buttons">
                    <button 
                        className="nav-button prev"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous Page
                    </button>
                    <span className="page-info">
                        Page {currentPage}
                    </span>
                    <button 
                        className="nav-button next"
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        Next Page
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookReader;

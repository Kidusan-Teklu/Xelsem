require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const Book = require('./models/Book');

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:5001',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: false
};
app.use(cors(corsOptions));

// Static file serving
const publicPath = path.join(__dirname, 'public');
const uploadsDir = path.join(__dirname, 'uploads');

app.use('/uploads', express.static(uploadsDir));
app.use(express.static(publicPath));

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Create a safe filename
        const safeName = Date.now() + '-' + encodeURIComponent(file.originalname);
        cb(null, safeName);
    }
});

const fileUpload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.epub', '.mobi', '.doc', '.docx', '.txt'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

// Database connection
mongoose.connect('mongodb://localhost:27017/xelsemdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Debug routes
app.get('/api/debug', (req, res) => {
    res.json({
        message: 'Debug endpoint working',
        timestamp: new Date().toISOString(),
        serverInfo: {
            directory: __dirname,
            uploadsDir: uploadsDir,
            uploadsExists: fs.existsSync(uploadsDir)
        }
    });
});

app.get('/api/debug/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json({
            count: books.length,
            books: books.map(book => ({
                id: book._id,
                title: book.title,
                filePath: book.file
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/debug/files', async (req, res) => {
    try {
        // Check uploads directory
        const uploadsExists = fs.existsSync(uploadsDir);
        
        // List files in uploads directory
        const files = uploadsExists ? fs.readdirSync(uploadsDir) : [];
        
        // Get file details
        const fileDetails = files.map(file => {
            const fullPath = path.join(uploadsDir, file);
            const stats = fs.statSync(fullPath);
            return {
                name: file,
                path: fullPath,
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime
            };
        });

        res.json({
            uploadsDir,
            exists: uploadsExists,
            fileCount: files.length,
            files: fileDetails
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/debug/book/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const filePath = path.join(__dirname, book.file);
        const exists = fs.existsSync(filePath);

        res.json({
            book: {
                id: book._id,
                title: book.title,
                author: book.author,
                storedPath: book.file
            },
            file: {
                exists,
                absolutePath: filePath,
                stats: exists ? fs.statSync(filePath) : null
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Book Routes
app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.find().sort({ uploadTime: -1 });
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create book
app.post('/api/books', fileUpload.single('file'), async (req, res) => {
    try {
        const { title, author, category } = req.body;
        
        if (!title || !author || !category) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const book = new Book({
            title,
            author,
            category,
            file: req.file.path
        });

        await book.save();
        res.json({
            success: true,
            message: 'Book uploaded successfully!',
            file_path: req.file.path
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Download book
app.get('/api/books/:id/download', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('\n=== Download Request ===');
        console.log('Book ID:', id);

        // Find book
        const book = await Book.findById(id);
        if (!book) {
            console.log('Book not found in database');
            return res.status(404).json({ error: 'Book not found' });
        }

        console.log('Book found:', {
            id: book._id,
            title: book.title,
            storedPath: book.file
        });

        // Resolve file path
        let filePath = book.file;
        if (!path.isAbsolute(filePath)) {
            filePath = path.join(__dirname, filePath);
        }
        filePath = filePath.replace(/\\/g, '/');

        console.log('Resolved file path:', filePath);

        // Verify file exists and is readable
        try {
            await fs.promises.access(filePath, fs.constants.R_OK);
            const stats = await fs.promises.stat(filePath);
            
            if (!stats.isFile()) {
                throw new Error('Path exists but is not a file');
            }

            console.log('File stats:', {
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime
            });

            // Set headers
            const filename = path.basename(filePath);
            const ext = path.extname(filename).toLowerCase();
            const mimeType = getMimeType(ext);

            console.log('Preparing download:', {
                filename,
                mimeType,
                size: stats.size
            });

            res.setHeader('Content-Type', mimeType);
            res.setHeader('Content-Length', stats.size);
            res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);

            // Stream file
            const stream = fs.createReadStream(filePath);
            
            stream.on('error', (error) => {
                console.error('Stream error:', error);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Error streaming file' });
                }
                stream.destroy();
            });

            stream.on('end', () => {
                console.log('Download completed successfully');
            });

            stream.pipe(res);

            // Handle client disconnect
            res.on('close', () => {
                stream.destroy();
            });

        } catch (error) {
            console.error('File access error:', error);
            return res.status(404).json({ 
                error: 'File not accessible',
                details: error.message
            });
        }

    } catch (error) {
        console.error('Download error:', error);
        if (!res.headersSent) {
            res.status(500).json({ 
                error: 'Server error',
                details: error.message
            });
        }
    }
});

// Helper function for MIME types
function getMimeType(ext) {
    const mimeTypes = {
        '.pdf': 'application/pdf',
        '.epub': 'application/epub+zip',
        '.mobi': 'application/x-mobipocket-ebook',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.txt': 'text/plain'
    };
    return mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
}

// Delete book
app.delete('/api/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        // Delete the file if it exists
        if (book.file) {
            const filePath = path.join(__dirname, book.file);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Book.findByIdAndDelete(req.params.id);
        res.json({
            success: true,
            message: 'Book deleted successfully!'
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add this debug route
app.get('/api/debug/file/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        let filePath = book.file;
        if (!path.isAbsolute(filePath)) {
            filePath = path.join(__dirname, filePath);
        }

        const fileExists = fs.existsSync(filePath);
        const stats = fileExists ? fs.statSync(filePath) : null;

        res.json({
            book: {
                id: book._id,
                title: book.title,
                storedPath: book.file
            },
            file: {
                resolvedPath: filePath,
                exists: fileExists,
                stats: stats ? {
                    size: stats.size,
                    created: stats.birthtime,
                    modified: stats.mtime
                } : null
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update the debug route
app.get('/api/debug/filepath', async (req, res) => {
    try {
        // Check uploads directory
        const uploadsExists = fs.existsSync(uploadsDir);
        console.log('Uploads directory:', {
            path: uploadsDir,
            exists: uploadsExists
        });

        // Get all books
        const books = await Book.find();
        console.log('Found books:', books.length);

        const fileInfo = books.map(book => {
            // Get stored path
            const storedPath = book.file;
            
            // Get absolute path
            const absolutePath = path.isAbsolute(storedPath) 
                ? storedPath 
                : path.join(__dirname, storedPath);
            
            // Check if file exists
            const exists = fs.existsSync(absolutePath);
            let stats = null;
            
            if (exists) {
                try {
                    stats = fs.statSync(absolutePath);
                } catch (err) {
                    console.error(`Error getting stats for ${absolutePath}:`, err);
                }
            }

            return {
                book: {
                    id: book._id,
                    title: book.title,
                    author: book.author,
                    category: book.category,
                    uploadTime: book.uploadTime
                },
                file: {
                    storedPath,
                    absolutePath,
                    exists,
                    stats: stats ? {
                        size: stats.size,
                        created: stats.birthtime,
                        modified: stats.mtime,
                        isFile: stats.isFile(),
                        isDirectory: stats.isDirectory(),
                        permissions: stats.mode
                    } : null
                }
            };
        });

        res.json({
            server: {
                currentDirectory: __dirname,
                uploadsDirectory: uploadsDir,
                uploadsExists,
                uploadsStats: uploadsExists ? fs.statSync(uploadsDir) : null
            },
            books: fileInfo
        });
    } catch (error) {
        console.error('Debug error:', error);
        res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
});

// Add a route to check a specific book
app.get('/api/debug/book/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Debugging book:', id);

        // Check if ID is valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                error: 'Invalid book ID format',
                providedId: id
            });
        }

        // Find the book
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ 
                error: 'Book not found',
                providedId: id
            });
        }

        // Get file information
        const storedPath = book.file;
        const absolutePath = path.isAbsolute(storedPath) 
            ? storedPath 
            : path.join(__dirname, storedPath);
        
        const exists = fs.existsSync(absolutePath);
        let stats = null;
        
        if (exists) {
            try {
                stats = fs.statSync(absolutePath);
            } catch (err) {
                console.error(`Error getting stats for ${absolutePath}:`, err);
            }
        }

        res.json({
            book: {
                id: book._id,
                title: book.title,
                author: book.author,
                category: book.category,
                uploadTime: book.uploadTime,
                storedPath: book.file
            },
            file: {
                exists,
                absolutePath,
                stats: stats ? {
                    size: stats.size,
                    created: stats.birthtime,
                    modified: stats.mtime,
                    isFile: stats.isFile(),
                    permissions: stats.mode.toString(8)
                } : null
            },
            paths: {
                serverDir: __dirname,
                uploadsDir,
                relativePath: path.relative(__dirname, absolutePath)
            }
        });
    } catch (error) {
        console.error('Debug error:', error);
        res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
});

// Other routes...

// Add this right after your middleware setup
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Add this at the end, before app.listen
app.use((req, res) => {
    console.log(`404 - Not Found: ${req.method} ${req.url}`);
    res.status(404).json({
        error: 'Route not found',
        method: req.method,
        url: req.url
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});